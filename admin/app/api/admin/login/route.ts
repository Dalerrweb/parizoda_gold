import { type NextRequest, NextResponse } from "next/server";
import { sign } from "jsonwebtoken";
import { compare } from "bcryptjs";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

const JWT_SECRET = process.env.ADMIN_JWT_SECRET!;

export async function POST(request: NextRequest) {
	try {
		const { email, password } = await request.json();

		const admin = await prisma.adminUser.findUnique({
			where: { email },
		});

		if (!admin) {
			return NextResponse.json(
				{ error: "Invalid credentials" },
				{ status: 401 }
			);
		}

		const passwordValid = await compare(password, admin.password);
		if (!passwordValid) {
			return NextResponse.json(
				{ error: "Invalid credentials" },
				{ status: 401 }
			);
		}

		const token = sign({ userId: admin.id, role: "admin" }, JWT_SECRET, {
			expiresIn: "8h",
		});

		const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000);

		await prisma.adminSession.create({
			data: {
				token,
				userId: admin.id,
				expires: expiresAt,
			},
		});

		const cookieStore = await cookies();
		cookieStore.set("admin-token", token, {
			path: "/admin",
			httpOnly: true,
			sameSite: "strict",
			secure: process.env.NODE_ENV === "production",
			maxAge: 8 * 60 * 60, // 8 hours
		});

		return NextResponse.json({ ok: true, message: "Login successful" });
	} catch (error) {
		console.error("Login error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
