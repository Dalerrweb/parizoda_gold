import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function PATCH(req: Request) {
	try {
		// 1. Получаем куки из запроса
		const cookieStore = await cookies();
		const token = cookieStore.get("token")?.value;

		if (!token) {
			return NextResponse.json(
				{ error: "Unauthorized - No token" },
				{ status: 401 }
			);
		}

		// 2. Проверяем токен
		const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
			userId: number;
		};

		if (!decoded?.userId) {
			return NextResponse.json(
				{ error: "Invalid token" },
				{ status: 401 }
			);
		}

		// 3. Получаем и проверяем тело запроса
		const body = await req.json();

		const allowedFields = ["phone", "first_name", "last_name"];
		const updateData: Record<string, any> = {};

		for (const field of allowedFields) {
			if (body[field] !== undefined && body[field] !== null) {
				updateData[field] = body[field];
			}
		}

		if (Object.keys(updateData).length === 0) {
			return NextResponse.json(
				{ error: "No valid fields to update" },
				{ status: 400 }
			);
		}

		// 4. Обновляем пользователя
		const updatedUser = await prisma.user.update({
			where: { id: decoded.userId },
			data: updateData,
		});

		// 5. Возвращаем безопасные данные
		const { id, telegramId, createdAt, ...safeUser } = updatedUser;
		return NextResponse.json(safeUser);
	} catch (err: any) {
		console.error(err);

		// Специфичные ошибки
		if (err.name === "JsonWebTokenError") {
			return NextResponse.json(
				{ error: "Invalid token" },
				{ status: 401 }
			);
		}

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
