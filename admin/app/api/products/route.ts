import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

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
