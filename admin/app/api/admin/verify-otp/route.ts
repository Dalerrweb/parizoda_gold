import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
	const { code } = await req.json();

	const latest = await prisma.otpCode.findFirst({
		where: {
			type: "superadmin",
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	if (!latest) {
		return NextResponse.json({ error: "Код не найден" }, { status: 403 });
	}

	if (new Date() > latest.expiresAt) {
		await prisma.otpCode.delete({ where: { id: latest.id } });
		return NextResponse.json({ error: "Код истёк" }, { status: 403 });
	}

	if (latest.code !== code) {
		return NextResponse.json({ error: "Неверный код" }, { status: 403 });
	}

	await prisma.otpCode.delete({ where: { id: latest.id } });
	return NextResponse.json({ success: true });
}
