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
				childBundles: {
					include: {
						child: true,
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

export async function PATCH(
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

		const data = await req.json();
		// Проверка существования продукта
		const existingProduct = await prisma.product.findUnique({
			where: { id: productId },
			include: {
				images: true,
				sizes: true,
				childBundles: true,
			},
		});

		if (!existingProduct) {
			return NextResponse.json(
				{ error: "Продукт не найден" },
				{ status: 404 }
			);
		}

		// Транзакция для всех операций
		const updatedProduct = await prisma.$transaction(async (tx) => {
			// 1. Обновление основных полей
			const productData: any = {
				name: data.name ?? existingProduct.name,
				description: data.description ?? existingProduct.description,
				price: data.price ?? existingProduct.price,
				weight: data.weight ?? existingProduct.weight,
				type: data.type ?? existingProduct.type,
				preciousMetal:
					data.preciousMetal ?? existingProduct.preciousMetal,
				categoryId: data.categoryId ?? existingProduct.categoryId,
			};

			// 2. Обновление SKU с проверкой уникальности
			if (data.sku && data.sku !== existingProduct.sku) {
				const skuExists = await tx.product.findUnique({
					where: { sku: data.sku },
					select: { id: true },
				});

				if (skuExists) {
					throw new Error("SKU уже используется другим продуктом");
				}
				productData.sku = data.sku;
			}

			// 3. Обработка изображений (полная замена)
			if (data.images) {
				// Удаляем старые изображения
				await tx.productImage.deleteMany({
					where: { productId },
				});

				// Добавляем новые
				if (data.images.length > 0) {
					productData.images = {
						createMany: {
							data: data.images.map((url: string) => ({ url })),
						},
					};
				}
			}

			// 4. Обработка размеров (полная замена)
			if (data.sizes) {
				// Удаляем старые размеры
				await tx.productSize.deleteMany({
					where: { productId },
				});

				// Добавляем новые
				if (data.sizes.length > 0) {
					productData.sizes = {
						createMany: {
							data: data.sizes.map((size: any) => ({
								value: size.value,
								quantity: size.quantity || 0,
							})),
						},
					};
				}
			}

			// 5. Обновление основного продукта
			const updated = await tx.product.update({
				where: { id: productId },
				data: productData,
				include: {
					images: true,
					sizes: true,
				},
			});

			// 6. Обработка комплектов (только для BUNDLE)
			if (data.type === "BUNDLE" || existingProduct.type === "BUNDLE") {
				// Удаляем старые связи комплекта
				await tx.productBundle.deleteMany({
					where: { parentId: productId },
				});

				// Добавляем новые связи
				if (data.childBundles && data.childBundles.length > 0) {
					// Проверка существования дочерних товаров
					const childIds = data.childBundles.map(
						(b: any) => b.childId
					);
					const existingCount = await tx.product.count({
						where: { id: { in: childIds } },
					});

					if (existingCount !== childIds.length) {
						throw new Error("Некоторые дочерние товары не найдены");
					}

					// Создаем новые связи
					await tx.productBundle.createMany({
						data: data.childBundles.map((bundle: any) => ({
							parentId: productId,
							childId: bundle.childId,
							quantity: bundle.quantity || 1,
						})),
					});
				}
			}

			// Получаем обновленный продукт со всеми связями
			return tx.product.findUnique({
				where: { id: productId },
				include: {
					images: true,
					sizes: true,
					childBundles: {
						include: {
							child: true,
						},
					},
				},
			});
		});

		return NextResponse.json(updatedProduct, { status: 200 });
	} catch (error: any) {
		console.error("Ошибка обновления продукта:", error);
		return NextResponse.json(
			{ error: error.message || "Ошибка сервера" },
			{ status: 500 }
		);
	}
}

export async function DELETE(
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

		// Проверка существования продукта
		const existingProduct = await prisma.product.findUnique({
			where: { id: productId },
		});

		if (!existingProduct) {
			return NextResponse.json(
				{ error: "Продукт не найден" },
				{ status: 404 }
			);
		}

		//   // Проверка связанных заказов
		//   const hasOrders = await prisma.order.count({
		//     where: { products: { some: { id: productId } } }
		//   ) > 0;

		//   if (hasOrders) {
		//     return NextResponse.json(
		//       { error: "Невозможно удалить продукт с существующими заказами" },
		//       { status: 400 }
		//     );
		//   }

		// Транзакция удаления
		await prisma.$transaction(async (tx) => {
			// 1. Удаление связей комплектов (где продукт является родителем)
			await tx.productBundle.deleteMany({
				where: { parentId: productId },
			});

			// 2. Удаление связей комплектов (где продукт является компонентом)
			await tx.productBundle.deleteMany({
				where: { childId: productId },
			});

			// 3. Удаление связанных сущностей
			await tx.productImage.deleteMany({
				where: { productId },
			});

			await tx.productSize.deleteMany({
				where: { productId },
			});

			// 4. Удаление самого продукта
			await tx.product.delete({
				where: { id: productId },
			});
		});

		return NextResponse.json(
			{ message: "Продукт успешно удален" },
			{ status: 200 }
		);
	} catch (error: any) {
		console.error("Ошибка удаления продукта:", error);
		return NextResponse.json(
			{ error: error.message || "Ошибка сервера" },
			{ status: 500 }
		);
	}
}
