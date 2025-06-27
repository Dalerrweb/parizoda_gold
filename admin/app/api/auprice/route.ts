import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
export async function GET() {
	try {
		const auPrice = await prisma.auPrice.findFirst();

		if (!auPrice) {
			return NextResponse.json(
				{ error: "Price not found" },
				{ status: 404 }
			);
		}

		const serializedPrice = {
			...auPrice,
			pricePerGram: Number(auPrice.pricePerGram),
		};

		return NextResponse.json(serializedPrice, { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: "Failed to fetch price" },
			{ status: 500 }
		);
	}
}
