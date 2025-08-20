import { type NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { requireAuth } from "@/lib/auth";
import { parseInitData, validateInitData } from "@/lib/utils";
import { ProductType } from "@/app/types";
import prisma from "@/lib/prisma";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(request: NextRequest) {
	try {
		return NextResponse.json("completeOrder", { status: 201 });
	} catch (error) {
		console.error("Error creating order:", error);
		return NextResponse.json(
			{
				error:
					error instanceof Error
						? error.message
						: "Failed to create order",
			},
			{ status: 500 }
		);
	}
}

const calculate = ({
	weight,
	markup,
	pricePerGram,
}: {
	weight: string | null;
	markup: string;
	pricePerGram: bigint;
}) => {
	const priceWithoutMarkup = Number(pricePerGram) * Number(weight);

	return BigInt(priceWithoutMarkup * (1 + Number(markup) / 100));
};

export async function POST(req: NextRequest) {
	try {
		const auth = await requireAuth(req);
		if (!auth.success) return auth.response;
		const userId = auth.payload.userId;

		const body = await req.json();

		if (
			!body.initData ||
			!validateInitData(body.initData, TELEGRAM_BOT_TOKEN)
		) {
			return NextResponse.json(
				{ error: "Invalid initial data" },
				{ status: 400 }
			);
		}

		const data = parseInitData(body.initData);
		const tgUser = JSON.parse(data.user);

		if (Number(userId) !== Number(tgUser.id)) {
			return NextResponse.json(
				{ error: "User ID mismatch" },
				{ status: 400 }
			);
		}

		const auPrice = await prisma.auPrice.findFirst();

		if (!auPrice) {
			return NextResponse.json(
				{ error: "Server error occurred while fetching AU price" },
				{ status: 404 }
			);
		}

		// all checks passed, proceed with order creation
		const items = body.order.items;
		let totalWeight = 0;
		let totalAmount = BigInt(0);
		const orderItemsData: any = [];

		for (const item of items) {
			const dbProduct = await prisma.product.findUnique({
				where: { id: item.productId },
			});
			if (!dbProduct) {
				return NextResponse.json(
					{ error: `Product with ID ${item.id} not found` },
					{ status: 404 }
				);
			}

			if (dbProduct.type === ProductType.SINGLE) {
				const dbSize = await prisma.productSize.findUnique({
					where: { id: item.variantId },
				});
				if (!dbSize) {
					return NextResponse.json(
						{ error: `Size with ID ${item.variantId} not found` },
						{ status: 404 }
					);
				}
				const price = calculate({
					weight: dbSize.weight,
					markup: dbProduct.markup,
					pricePerGram: auPrice.pricePerGram,
				});

				totalWeight += Number(dbSize.weight);
				totalAmount += price * BigInt(item.quantity);

				orderItemsData.push({
					productId: item.productId,
					quantity: item.quantity,
					price,
					weight: dbSize.weight,
					markup: dbProduct.markup,
					variantId: dbSize.id,
					type: ProductType.SINGLE,
					bundleItems: [],
				});
			}
			if (dbProduct.type === ProductType.BUNDLE) {
				const bundleItems = [];
				let bundleTotalPrice = BigInt(0);
				// bundles
				for (const bundleItem of item.bundleItems) {
					const bundleDbProduct = await prisma.product.findUnique({
						where: { id: bundleItem.productId },
					});
					if (!bundleDbProduct) {
						return NextResponse.json(
							{
								error: `Bundle product with ID ${bundleItem.productId} not found`,
							},
							{ status: 404 }
						);
					}
					const dbSize = await prisma.productSize.findUnique({
						where: { id: bundleItem.variantId },
					});
					if (!dbSize) {
						return NextResponse.json(
							{
								error: `Size with ID ${bundleItem.variantId} not found`,
							},
							{ status: 404 }
						);
					}
					const price = calculate({
						weight: dbSize.weight,
						markup: bundleDbProduct.markup,
						pricePerGram: auPrice.pricePerGram,
					});

					totalWeight += Number(dbSize.weight);
					bundleTotalPrice += price;
					bundleItems.push({
						productId: bundleItem.productId,
						variantId: bundleItem.variantId,
						weight: dbSize.weight,
						markup: bundleDbProduct.markup,
						price,
					});
				}
				totalAmount += bundleTotalPrice * BigInt(item.quantity);

				orderItemsData.push({
					productId: item.productId,
					quantity: item.quantity,
					price: bundleTotalPrice,
					weight: bundleItems
						.reduce((sum, item) => sum + Number(item.weight), 0)
						.toString(),
					markup: dbProduct.markup,
					type: ProductType.BUNDLE,
					bundleItems,
				});
			}
		}

		// Транзакция для создания заказа
		const order = await prisma.$transaction(async (tx) => {
			// Создаем основной заказ
			const newOrder = await tx.order.create({
				data: {
					userId,
					paymentType: body.order.paymentType,
					goldPrice: Number(auPrice.pricePerGram),
					totalAmount: Number(auPrice.pricePerGram),
				},
			});

			// Создаем позиции заказа
			for (const itemData of orderItemsData) {
				const orderItem = await tx.orderItem.create({
					data: {
						orderId: newOrder.id,
						productId: itemData.productId,
						quantity: itemData.quantity,
						price: itemData.price,
						weight: itemData.weight,
						markup: itemData.markup,
						variantId: itemData.variantId,
						type: itemData.type,
					},
				});

				// Создаем элементы бандла при необходимости
				if (
					itemData.type === ProductType.BUNDLE &&
					itemData.bundleItems.length > 0
				) {
					await tx.bundleItem.createMany({
						data: itemData.bundleItems.map((bItem: any) => ({
							orderItemId: orderItem.id,
							productId: bItem.productId,
							variantId: bItem.variantId,
							weight: bItem.weight,
							markup: bItem.markup,
							price: bItem.price,
						})),
					});
				}
			}

			return newOrder;
		});

		return NextResponse.json({ data: order }, { status: 201 });
	} catch (e) {
		return NextResponse.json("Failed to create order", { status: 500 });
	}
}
