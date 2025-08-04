import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Role } from "./app/types";

// Конфигурация безопасности
const securityConfig = {
	// CORS
	allowedOrigin: "*",
	allowedMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
	allowedHeaders: [
		"Content-Type",
		"Authorization",
		"Content-Disposition", // Добавить это
	],

	// Аутентификация
	jwtSecret: process.env.ADMIN_JWT_SECRET!,
	authCookieName: "admin-token",

	// Защищенные пути
	protectedRoutes: {
		adminPanel: ["/admin"],
		api: ["/api/admin"],
		authRoutes: ["/login"],
		excludedRoutes: ["/api/admin/login"],
	},

	// Security headers
	securityHeaders: {
		"X-Content-Type-Options": "nosniff",
		"X-Frame-Options": "DENY",
		"X-XSS-Protection": "1; mode=block",
	},
};

// Валидация JWT
async function verifyJWT(token: string): Promise<any> {
	try {
		const parts = token.split(".");
		if (parts.length !== 3) {
			throw new Error("Invalid token format");
		}

		const [header, payload, signature] = parts;

		// Decode header and payload
		const decodedHeader = JSON.parse(
			atob(header.replace(/-/g, "+").replace(/_/g, "/"))
		);
		const decodedPayload = JSON.parse(
			atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
		);

		// Check expiration
		if (decodedPayload.exp && Date.now() >= decodedPayload.exp * 1000) {
			throw new Error("Token expired");
		}

		// Verify signature using Web Crypto API
		const encoder = new TextEncoder();
		const data = encoder.encode(`${header}.${payload}`);
		const secretKey = encoder.encode(securityConfig.jwtSecret);

		const cryptoKey = await crypto.subtle.importKey(
			"raw",
			secretKey,
			{ name: "HMAC", hash: "SHA-256" },
			false,
			["verify"]
		);

		// Convert base64url signature to ArrayBuffer
		const signatureBuffer = Uint8Array.from(
			atob(signature.replace(/-/g, "+").replace(/_/g, "/")),
			(c) => c.charCodeAt(0)
		);

		const isValid = await crypto.subtle.verify(
			"HMAC",
			cryptoKey,
			signatureBuffer,
			data
		);

		if (!isValid) {
			throw new Error("Invalid signature");
		}

		return decodedPayload;
	} catch (error) {
		throw new Error("Invalid token");
	}
}

// Проверка защищенного маршрута
function isProtectedRoute(pathname: string): boolean {
	const { protectedRoutes } = securityConfig;
	const normalizedPath = pathname.toLowerCase();

	const isProtected = [
		...protectedRoutes.adminPanel,
		...protectedRoutes.api,
	].some((path) => normalizedPath.startsWith(path.toLowerCase()));

	const isExcluded = protectedRoutes.excludedRoutes.some(
		(ex) => normalizedPath === ex.toLowerCase()
	);

	return isProtected && !isExcluded;
}

// Проверка auth-маршрута
function isAuthRoute(pathname: string): boolean {
	return securityConfig.protectedRoutes.authRoutes.includes(
		pathname.toLowerCase()
	);
}

export async function middleware(request: NextRequest) {
	const response = NextResponse.next();
	const pathname = request.nextUrl.pathname;
	const isApiRoute = pathname.startsWith("/api");

	// // В блоке проверки защищенных маршрутов
	// console.log("Request to:", pathname);
	// console.log(
	// 	"Token from cookies:",
	// 	request.cookies.get(securityConfig.authCookieName)?.value
	// );
	// console.log("Auth header:", request.headers.get("Authorization"));

	// Установка security headers
	Object.entries(securityConfig.securityHeaders).forEach(([key, value]) => {
		response.headers.set(key, value);
	});

	// Обработка CORS
	response.headers.set(
		"Access-Control-Allow-Origin",
		securityConfig.allowedOrigin
	);
	response.headers.set(
		"Access-Control-Allow-Methods",
		securityConfig.allowedMethods.join(", ")
	);
	response.headers.set(
		"Access-Control-Allow-Headers",
		securityConfig.allowedHeaders.join(", ")
	);
	response.headers.set("Access-Control-Allow-Credentials", "true");

	// Preflight запрос
	if (request.method === "OPTIONS") {
		return new NextResponse(null, {
			status: 204,
			headers: response.headers,
		});
	}

	// Проверка защищенных маршрутов
	if (isProtectedRoute(pathname)) {
		const token =
			request.cookies.get(securityConfig.authCookieName)?.value ||
			request.headers.get("Authorization")?.split(" ")[1];

		if (!token) {
			if (isApiRoute) {
				return NextResponse.json(
					{ error: "Unauthorized" },
					{ status: 401 }
				);
			}
			return NextResponse.redirect(new URL("/login", request.url));
		}

		try {
			const decoded = await verifyJWT(token);
			if (decoded.role !== Role.ADMIN) throw new Error("Invalid role");

			// Передача данных пользователя через headers
			const headers = new Headers(request.headers);
			headers.set("x-admin-user-id", decoded.userId);
			headers.set("x-admin-role", decoded.role);

			return NextResponse.next({ request: { headers } });
		} catch (error) {
			console.error("Auth error:", error);
			if (isApiRoute) {
				return NextResponse.json(
					{ error: "Invalid token" },
					{ status: 401 }
				);
			}
			return NextResponse.redirect(new URL("/login", request.url));
		}
	}

	// Редирект с auth-маршрутов для авторизованных
	if (isAuthRoute(pathname)) {
		const token = request.cookies.get(securityConfig.authCookieName)?.value;
		if (token) {
			try {
				const decoded = await verifyJWT(token);
				if (decoded.role === Role.ADMIN) {
					return NextResponse.redirect(
						new URL("/admin", request.url)
					);
				}
			} catch {
				// Невалидный токен - очищаем куку
				response.cookies.delete(securityConfig.authCookieName);
			}
		}
	}

	return response;
}

export const config = {
	matcher: [
		"/login",
		"/api/:path*",
		"/admin/:path*",
		// "/api/admin/:path*",
		// "/api/admin/upload", // Явное указание
		// "/api/auth/:path*",
	],
};
