import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

const generateCode = () =>
	Math.floor(100000 + Math.random() * 900000).toString();

export async function POST() {
	const code = generateCode();
	const expiresInMin = Number(process.env.OTP_EXPIRATION_MINUTES || 5);
	const expiresAt = new Date(Date.now() + expiresInMin * 60_000);

	await prisma.otpCode.create({
		data: {
			type: "superadmin",
			code,
			expiresAt,
		},
	});

	const botToken = process.env.TG_ADMIN_BOT_TOKEN;
	const chatId = process.env.TG_SUPERADMIN_ID;

	await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			chat_id: chatId,
			text: `🔐 Код подтверждения: *${code}*\nСрок действия: ${expiresInMin} мин.`,
			parse_mode: "Markdown",
		}),
	});

	return NextResponse.json({ success: true });
}
