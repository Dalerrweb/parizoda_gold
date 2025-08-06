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

	return priceWithoutMarkup * (1 + Number(markup) / 100);
};

export async function POST(req: NextRequest) {
	try {
		const auth = await requireAuth(req);
		if (!auth.success) return auth.response;
		const userId = auth.payload.userId;

		const body = await req.json();

		// if (
		// 	!body.initData ||
		// 	!validateInitData(body.initData, TELEGRAM_BOT_TOKEN)
		// ) {
		// 	return NextResponse.json(
		// 		{ error: "Invalid initial data" },
		// 		{ status: 400 }
		// 	);
		// }

		// const data = parseInitData(body.initData);
		// const tgUser = JSON.parse(data.user);

		// if (userId !== tgUser.id) {
		// 	return NextResponse.json(
		// 		{ error: "User ID mismatch" },
		// 		{ status: 400 }
		// 	);
		// }

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
		let totalAmount = 0;

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
				const price =
					calculate({
						weight: dbSize.weight,
						markup: dbProduct.markup,
						pricePerGram: auPrice.pricePerGram,
					}) * item.quantity;

				totalWeight += Number(dbSize.weight);
				totalAmount += price;

				// console.log({
				// 	type: dbProduct.type,
				// 	weight: dbSize.weight,
				// 	markup: dbProduct.markup,
				// 	pricePerGram: auPrice.pricePerGram,
				// 	priceOfProduct: price,
				// });
			}
			if (dbProduct.type === ProductType.BUNDLE) {
				// bundles
				for (const bundle of item.bundleItems) {
					const bundleDbProduct = await prisma.product.findUnique({
						where: { id: bundle.productId },
					});
					if (!bundleDbProduct) {
						return NextResponse.json(
							{
								error: `Bundle product with ID ${bundle.productId} not found`,
							},
							{ status: 404 }
						);
					}
					const dbSize = await prisma.productSize.findUnique({
						where: { id: bundle.variantId },
					});
					if (!dbSize) {
						return NextResponse.json(
							{
								error: `Size with ID ${item.variantId} not found`,
							},
							{ status: 404 }
						);
					}
					const price =
						calculate({
							weight: dbSize.weight,
							markup: bundleDbProduct.markup,
							pricePerGram: auPrice.pricePerGram,
						}) * item.quantity;

					totalWeight += Number(dbSize.weight);
					totalAmount += price;
				}
			}
		}

		console.log("Total weight of order:", totalWeight);
		console.log("Total amount of order:", totalAmount);

		// const tx = await prisma.$transaction(async (tx) => {
		// 	const order = await tx.order.create({
		// 		data: {
		// 			userId,
		// 		},
		// 	});
		// 	return order;
		// });

		return NextResponse.json("completeOrder", { status: 201 });
	} catch (e) {
		console.log(e);

		return NextResponse.json("Failed to create order", { status: 500 });
	}
}
