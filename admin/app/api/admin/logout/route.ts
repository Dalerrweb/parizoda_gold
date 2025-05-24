import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
	try {
		const cookieStore = await cookies();
		const token = cookieStore.get("admin-token")?.value;

		if (token) {
			// Remove session from database
			await prisma.adminSession.deleteMany({
				where: { token },
			});

			// Clear the cookie
			cookieStore.delete("admin-token");
		}

		return NextResponse.json({ message: "Logout successful" });
	} catch (error) {
		console.error("Logout error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
