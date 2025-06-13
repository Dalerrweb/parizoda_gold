import { type NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import prisma from "@/lib/prisma";

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

		// Валидация основных полей
		if (!data.name || !data.sku || !data.price || !data.categoryId) {
			return NextResponse.json(
				{ error: "Обязательные поля: name, sku, price, categoryId" },
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

		console.log(data.images, "data.images");
		console.log(data.sizes, "data.sizes");

		// Создание продукта с транзакцией
		const newProduct = await prisma.$transaction(async (tx) => {
			// 1. Создаем основной продукт
			const product = await tx.product.create({
				data: {
					sku: data.sku,
					name: data.name,
					description: data.description || null,
					type: data.type || "SINGLE",
					categoryId: data.categoryId,

					// 2. Добавляем изображения
					images: data.images?.length
						? {
								createMany: {
									data: data.images,
								},
						  }
						: undefined,

					// 3. Добавляем размеры
					sizes: data.sizes?.length
						? {
								createMany: {
									data: data.sizes.map((size: any) => ({
										value: size.value,
										quantity: size.quantity || 0,
									})),
								},
						  }
						: undefined,
				},
			});

			console.log(product, "product created");

			// 4. Обработка комплектов (только для BUNDLE)
			if (data.type === "BUNDLE" && data.childBundles?.length) {
				// Проверка существования дочерних товаров
				const childIds = data.childBundles.map((b: any) => b.childId);
				const existingChildren = await tx.product.count({
					where: { id: { in: childIds } },
				});

				if (existingChildren !== childIds.length) {
					throw new Error("Некоторые дочерние товары не найдены");
				}

				// Создаем связи для комплекта
				await tx.productBundle.createMany({
					data: data.childBundles.map((bundle: any) => ({
						parentId: product.id,
						childId: bundle.childId,
						quantity: bundle.quantity || 1,
					})),
				});
			}

			return product;
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
