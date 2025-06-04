import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const banners = await prisma.banner.findMany({
			where: { isActive: true },
		});

		return NextResponse.json(banners);
	} catch (e) {
		return NextResponse.json(
			{ error: "Failed to fetch banners" },
			{ status: 500 }
		);
	}
}
