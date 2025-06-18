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
		});

		if (!existingProduct) {
			return NextResponse.json(
				{ error: "Продукт не найден" },
				{ status: 404 }
			);
		}

		// Транзакция для всех операций
		const updatedProduct = await prisma.$transaction(async (tx) => {
			// 1. Подготовка данных для обновления
			const updateData: any = {
				name: data.name,
				description: data.description,
				type: data.type,
				markup: data.markup,
				categoryId: data.categoryId,
			};

			// Удаляем undefined полей
			Object.keys(updateData).forEach(
				(key) => updateData[key] === undefined && delete updateData[key]
			);

			// 2. Обновление SKU с проверкой уникальности
			if (data.sku && data.sku !== existingProduct.sku) {
				const skuExists = await tx.product.findFirst({
					where: {
						sku: data.sku,
						NOT: { id: productId },
					},
				});

				if (skuExists) {
					throw new Error("SKU уже используется другим продуктом");
				}
				updateData.sku = data.sku;
			}

			// 3. Обработка изображений (только если переданы)
			if (data.images) {
				// Полная замена изображений
				await tx.productImage.deleteMany({
					where: { productId },
				});

				if (data.images.length > 0) {
					updateData.images = {
						createMany: {
							data: data.images,
						},
					};
				}
			}

			// 4. Обработка размеров (только если переданы)
			if (data.sizes) {
				// Полная замена размеров
				await tx.productSize.deleteMany({
					where: { productId },
				});

				if (data.sizes.length > 0) {
					updateData.sizes = {
						createMany: {
							data: data.sizes.map((size: any) => ({
								size: size.size,
								weight: size.weight,
								quantity: size.quantity,
							})),
						},
					};
				}
			}

			// 5. Обновление продукта
			await tx.product.update({
				where: { id: productId },
				data: updateData,
			});

			// 6. Обработка комплектов (ТОЛЬКО если явно переданы)
			if (data.childBundles !== undefined) {
				// Удаляем старые связи
				await tx.productBundle.deleteMany({
					where: { parentId: productId },
				});

				// Создаем новые если переданы
				if (data.childBundles && data.childBundles.length > 0) {
					const childIds = data.childBundles.map(
						(b: any) => b.childId
					);
					const existingChildren = await tx.product.count({
						where: { id: { in: childIds } },
					});

					if (existingChildren !== childIds.length) {
						throw new Error("Некоторые дочерние товары не найдены");
					}

					await tx.productBundle.createMany({
						data: data.childBundles.map((bundle: any) => ({
							parentId: productId,
							childId: bundle.childId,
							quantity: bundle.quantity || 0,
						})),
					});
				}
			}

			// Возвращаем полный обновленный продукт
			return tx.product.findUnique({
				where: { id: productId },
				include: {
					images: true,
					sizes: true,
					childBundles: {
						include: { child: true },
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
