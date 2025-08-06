import { type NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { requireAuth } from "@/lib/auth";
import { parseInitData, validateInitData } from "@/lib/utils";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(request: NextRequest) {
	try {
		return NextResponse.json("completeOrder", { status: 201 });
	} catch (error) {
		console.error("Error creating order:", error);
		return NextResponse.json(
			{
				error:
					error instanceof Error
						? error.message
						: "Failed to create order",
			},
			{ status: 500 }
		);
	}
}

export async function POST(req: NextRequest) {
	try {
		const auth = await requireAuth(req);
		if (!auth.success) return auth.response;
		const userId = auth.payload.userId;

		const body = await req.json();

		if (
			!body.initData ||
			!validateInitData(body.initData, TELEGRAM_BOT_TOKEN)
		) {
			return NextResponse.json(
				{ error: "Invalid initial data" },
				{ status: 400 }
			);
		}

		const data = parseInitData(body.initData);
		const tgUser = JSON.parse(data.user);

		if (userId !== tgUser.id) {
			return NextResponse.json(
				{ error: "User ID mismatch" },
				{ status: 400 }
			);
		}

		console.log({ body });

		return NextResponse.json("completeOrder", { status: 201 });
	} catch {
		return NextResponse.json("Failed to create order", { status: 500 });
	}
}
