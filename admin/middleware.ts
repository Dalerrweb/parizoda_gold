import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const allowedOrigin = process.env.ALLOWED_ORIGIN || "";

export function middleware(request: NextRequest) {
	const response = NextResponse.next();

	// CORS заголовки
	response.headers.set("Access-Control-Allow-Origin", allowedOrigin);
	response.headers.set(
		"Access-Control-Allow-Methods",
		"GET, POST, PUT, PATCH, DELETE, OPTIONS"
	);
	response.headers.set(
		"Access-Control-Allow-Headers",
		"Content-Type, Authorization"
	);
	response.headers.set("Access-Control-Allow-Credentials", "true");

	// Обработка preflight-запроса (OPTIONS)
	if (request.method === "OPTIONS") {
		return new NextResponse(null, {
			status: 204,
			headers: response.headers,
		});
	}

	return response;
}
