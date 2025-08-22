import { NextRequest, NextResponse } from "next/server";
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

type OrderInput = {
	userId: number;
	body: any;
};

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



	return BigInt(priceWithoutMarkup * parseInt((1 + Number(markup) / 100).toFixed(0)));
};


export async function createOrder({ userId, body }: OrderInput) {
	const user = await prisma.user.findFirst({
		where: {
			OR: [{ telegramId: userId }, { id: userId }],
		},
		select: { id: true },
	});
	if (!user) throw new Error("User not found");

	const auPrice = await prisma.auPrice.findFirst();
	if (!auPrice) throw new Error("Gold price not found");

	let totalAmount = BigInt(0);
	const orderItemsData: any[] = [];

	for (const item of body.order.items) {
		const dbProduct = await prisma.product.findUnique({
			where: { id: item.productId },
		});
		if (!dbProduct) throw new Error(`Product with ID ${item.productId} not found`);

		if (dbProduct.type === ProductType.SINGLE) {
			const dbSize = await prisma.productSize.findUnique({
				where: { id: item.variantId },
			});
			if (!dbSize) throw new Error(`Size with ID ${item.variantId} not found`);

			const price = calculate({
				weight: dbSize.weight,
				markup: dbProduct.markup,
				pricePerGram: BigInt(auPrice.pricePerGram),
			});

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
			const bundleItems: any[] = [];
			let bundleTotalPrice = BigInt(0);

			for (const b of item.bundleItems) {
				const bundleDbProduct = await prisma.product.findUnique({
					where: { id: b.productId },
				});
				if (!bundleDbProduct) throw new Error(`Bundle product with ID ${b.productId} not found`);

				const dbSize = await prisma.productSize.findUnique({
					where: { id: b.variantId },
				});
				if (!dbSize) throw new Error(`Size with ID ${b.variantId} not found`);

				const price = calculate({
					weight: dbSize.weight,
					markup: bundleDbProduct.markup,
					pricePerGram: BigInt(auPrice.pricePerGram),
				});

				bundleTotalPrice += price;
				bundleItems.push({
					productId: b.productId,
					variantId: b.variantId,
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
				weight: bundleItems.reduce((sum, it) => sum + Number(it.weight ?? 0), 0).toString(),
				markup: dbProduct.markup,
				type: ProductType.BUNDLE,
				bundleItems,
			});
		}
	}

	return prisma.$transaction(async (tx) => {
		const newOrder = await tx.order.create({
			data: {
				userId: user.id,
				paymentType: body.order.paymentType,
				goldPrice: Number(auPrice.pricePerGram),
				totalAmount: Number(totalAmount),
			},
		});

		for (const itemData of orderItemsData) {
			const orderItem = await tx.orderItem.create({
				data: {
					orderId: newOrder.id,
					productId: itemData.productId,
					quantity: itemData.quantity,
					price: Number(itemData.price),
					weight: itemData.weight,
					markup: itemData.markup,
					variantId: itemData.variantId,
					type: itemData.type,
				},
			});

			if (itemData.type === ProductType.BUNDLE && itemData.bundleItems.length > 0) {
				await tx.bundleItem.createMany({
					data: itemData.bundleItems.map((b: any) => ({
						orderItemId: orderItem.id,
						productId: b.productId,
						variantId: b.variantId,
						weight: b.weight,
						markup: b.markup,
						price: Number(b.price),
					})),
				});
			}
		}

		return newOrder;
	});
}

export async function POST(req: NextRequest) {
	try {
		const auth = await requireAuth(req);
		if (!auth.success) return auth.response;

		const body = await req.json();
		const order = await createOrder({ userId: auth.payload.userId, body });

		return NextResponse.json({ data: order }, { status: 201 });
	} catch (e: any) {
		return NextResponse.json({ error: e.message ?? "Failed to create order" }, { status: 500 });
	}
}