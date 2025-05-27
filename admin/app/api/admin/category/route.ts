import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();

		console.log(req.cookies);

		if (body.name === "") {
			throw new Error("Category name is required");
		}

		const category = await prisma.category.create({
			data: body,
		});

		return NextResponse.json(
			{
				message: "Category created successfully",
				category,
			},
			{ status: 201 }
		);
	} catch (e) {
		return NextResponse.json(
			{
				error: "Error " + e,
			},
			{ status: 400 }
		);
	}
}
