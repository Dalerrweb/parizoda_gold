import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

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
