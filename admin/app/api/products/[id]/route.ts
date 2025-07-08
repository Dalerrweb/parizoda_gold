import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		const productId = parseInt(id);

		if (isNaN(productId)) {
			return NextResponse.json(
				{ error: "Неверный ID продукта" },
				{ status: 400 }
			);
		}

		const product = await prisma.product.findUnique({
			where: { id: productId },
			include: {
				category: true,
				images: true,
				sizes: true,

				parentBundle: {
					include: {
						child: {
							select: {
								id: true,
								name: true,
								images: true,
								sku: true,
								markup: true,
								sizes: true,
							},
						},
					},
				},
			},
		});

		if (!product) {
			return NextResponse.json(
				{ error: "Продукт не найден" },
				{ status: 404 }
			);
		}

		return NextResponse.json(product, { status: 200 });
	} catch (error) {
		console.error("Ошибка получения продукта:", error);
		return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
	}
}
