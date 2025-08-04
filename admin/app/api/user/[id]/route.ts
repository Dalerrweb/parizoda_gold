import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function PATCH(req: Request) {
	try {
		const authHeader = req.headers.get("authorization");
		const body = await req.json();

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}

		const token = authHeader.split(" ")[1];
		const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
			userId: number;
		};

		if (!decoded?.userId) {
			return NextResponse.json(
				{ error: "Invalid token" },
				{ status: 401 }
			);
		}

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
			where: { id: decoded.userId },
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
