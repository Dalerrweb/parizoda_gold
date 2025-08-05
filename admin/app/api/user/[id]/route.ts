import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function PATCH(req: NextRequest) {
	try {
		const auth = await requireAuth(req);
		if (!auth.success) return auth.response;

		const userId = auth.payload.userId;

		const body = await req.json();

		// Список разрешенных для обновления полей
		const allowedFields = ["phone", "first_name", "last_name"];

		// Фильтрация полей из запроса
		const updateData: Record<string, any> = {};
		for (const field of allowedFields) {
			if (body[field] !== undefined && body[field] !== null) {
				updateData[field] = body[field];
			}
		}

		// Проверка наличия полей для обновления
		if (Object.keys(updateData).length === 0) {
			return NextResponse.json(
				{ error: "No valid fields to update" },
				{ status: 400 }
			);
		}

		// Обновление пользователя в базе данных
		const updatedUser = await prisma.user.update({
			where: { id: userId },
			data: updateData,
		});

		// Удаление чувствительных данных перед отправкой
		const { id, telegramId, createdAt, ...safeUser } = updatedUser;

		return NextResponse.json(safeUser);
	} catch (err: any) {
		console.error(err);

		// Обработка ошибки "пользователь не найден"
		if (err.code === "P2025") {
			return NextResponse.json(
				{ error: "User not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json(
			{ error: "Server error", details: err.message },
			{ status: 500 }
		);
	}
}
