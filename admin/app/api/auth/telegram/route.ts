import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const JWT_SECRET = process.env.JWT_SECRET!;

function parseInitData(initData: string): Record<string, string> {
	const params = new URLSearchParams(initData);
	const data: Record<string, string> = {};
	for (const [key, value] of params.entries()) {
		data[key] = value;
	}
	return data;
}

function validateInitData(initData: string): boolean {
	const parsed = parseInitData(initData);
	const hash = parsed.hash;
	delete parsed.hash;

	const sorted = Object.keys(parsed)
		.sort()
		.map((key) => `${key}=${parsed[key]}`)
		.join("\n");

	const secret = crypto
		.createHmac("sha256", "WebAppData")
		.update(TELEGRAM_BOT_TOKEN)
		.digest();

	const checkHash = crypto
		.createHmac("sha256", secret)
		.update(sorted)
		.digest("hex");

	return checkHash === hash;
}

export async function POST(req: NextRequest) {
	const body = await req.json();
	const { initData } = body;

	if (!initData || !validateInitData(initData)) {
		return NextResponse.json(
			{ error: "Invalid initData" },
			{ status: 400 }
		);
	}

	const data = parseInitData(initData);
	const tgUser = JSON.parse(data.user);

	const existingUser = await prisma.user.findUnique({
		where: { telegramId: tgUser.id },
	});

	console.log(tgUser, "tgUser");

	const user =
		existingUser ||
		(await prisma.user.create({
			data: tgUser,
		}));

	const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
		expiresIn: "7d",
	});

	return NextResponse.json({ token });
}
