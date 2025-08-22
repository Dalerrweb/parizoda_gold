import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { createOrder } from "./create-order";

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

		const body = await req.json();
		const order = await createOrder({ userId: auth.payload.userId, body });

		return NextResponse.json({ data: order }, { status: 201 });
	} catch (e: any) {
		return NextResponse.json({ error: e.message ?? "Failed to create order" }, { status: 500 });
	}
}