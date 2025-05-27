import prisma from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";

export async function GET() {
	try {
		const categories = await prisma.category.findMany({
			orderBy: {
				createdAt: "desc",
			},
			include: {
				_count: {
					select: {
						products: true,
					},
				},
			},
		});

		return NextResponse.json(categories);
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to fetch categories" },
			{ status: 500 }
		);
	}
}

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();

		if (!body.name || body.name.trim() === "") {
			return NextResponse.json(
				{ error: "Category name is required" },
				{ status: 400 }
			);
		}

		if (!body.imageUrl || body.imageUrl.trim() === "") {
			return NextResponse.json(
				{ error: "Category image URL is required" },
				{ status: 400 }
			);
		}

		const category = await prisma.category.create({
			data: {
				name: body.name.trim(),
				imageUrl: body.imageUrl.trim(),
			},
		});

		return NextResponse.json(
			{
				message: "Category created successfully",
				category,
			},
			{ status: 201 }
		);
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to create category" },
			{ status: 500 }
		);
	}
}
