import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ProductType } from "@/app/types";

// GET - Fetch all products
export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const page = Number.parseInt(searchParams.get("page") || "1");
		const limit = Number.parseInt(searchParams.get("limit") || "10");
		const categoryId = searchParams.get("categoryId");
		const type = searchParams.get("type");
		const search = searchParams.get("search");

		const skip = (page - 1) * limit;

		const where: any = {};

		if (categoryId) {
			where.categoryId = Number.parseInt(categoryId);
		}

		if (type) {
			where.type = type;
		}

		if (search) {
			where.OR = [
				{ name: { contains: search, mode: "insensitive" } },
				{ sku: { contains: search, mode: "insensitive" } },
				{ description: { contains: search, mode: "insensitive" } },
			];
		}

		const [products, total] = await Promise.all([
			prisma.product.findMany({
				where,
				skip,
				take: limit,
				orderBy: { createdAt: "desc" },
				include: {
					category: {
						select: {
							id: true,
							name: true,
						},
					},
					images: true,
					sizes: true,
					// _count: {
					// 	select: {
					// 		parentBundle: true,
					// 		childBundles: true,
					// 	},
					// },
				},
			}),
			prisma.product.count({ where }),
		]);

		return NextResponse.json({
			products,
			pagination: {
				page,
				limit,
				total,
				pages: Math.ceil(total / limit),
			},
		});
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to fetch products" },
			{ status: 500 }
		);
	}
}

export async function POST(req: NextRequest) {
	try {
		const data = await req.json();

		// Проверка обязательных полей (БЕЗ price)
		if (!data.name || !data.sku || !data.categoryId) {
			return NextResponse.json(
				{ error: "Обязательные поля: name, sku, categoryId" },
				{ status: 400 }
			);
		}

		// Проверка уникальности SKU
		const existingProduct = await prisma.product.findUnique({
			where: { sku: data.sku },
		});

		if (existingProduct) {
			return NextResponse.json(
				{ error: "Товар с таким SKU уже существует" },
				{ status: 409 }
			);
		}

		// Создание продукта с транзакцией
		const newProduct = await prisma.$transaction(async (tx) => {
			// 1. Создаем основной продукт
			const product = await tx.product.create({
				data: {
					sku: data.sku,
					name: data.name,
					description: data.description || null,
					type: data.type || ProductType.SINGLE,
					markup: data.markup,
					categoryId: data.categoryId,

					images: data.images?.length
						? {
								createMany: {
									data: data.images,
								},
						  }
						: undefined,

					sizes: data.sizes?.length
						? {
								createMany: {
									data: data.sizes,
								},
						  }
						: undefined,
				},
			});

			// 2. Обработка комплектов (BUNDLE) - ФИКС ПРОБЛЕМЫ
			if (data.type === ProductType.BUNDLE && data.childBundles?.length) {
				const childIds = data.childBundles.map((b: any) => b.childId);
				const uniqueChildIds = [...new Set(childIds)]; // Уникальные ID

				const existingChildren = await tx.product.count({
					where: { id: { in: uniqueChildIds as number[] } },
				});

				if (existingChildren !== uniqueChildIds.length) {
					throw new Error("Некоторые дочерние товары не найдены");
				}

				// ФИКС: Создаем связи для комплекта
				await tx.productBundle.createMany({
					data: data.childBundles.map((bundle: any) => ({
						parentId: product.id,
						childId: bundle.childId,
						quantity: bundle.quantity || 1,
					})),
				});
			}

			// 3. ВОЗВРАЩАЕМ ПОЛНЫЙ ОБЪЕКТ С КОМПЛЕКТАМИ - ГЛАВНЫЙ ФИКС
			return await tx.product.findUnique({
				where: { id: product.id },
				include: {
					images: true,
					sizes: true,
					childBundles: {
						// Включаем связи комплектов
						include: {
							child: true, // Включаем информацию о дочернем продукте
						},
					},
					parentBundle: {
						// Включаем связи комплектов
						include: {
							child: true, // Включаем информацию о дочернем продукте
						},
					},
				},
			});
		});

		return NextResponse.json(newProduct, { status: 201 });
	} catch (error: any) {
		console.error("Ошибка создания продукта:", error);
		return NextResponse.json(
			{ error: error.message || "Ошибка сервера" },
			{ status: 500 }
		);
	}
}
