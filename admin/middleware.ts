import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const allowedOrigin = process.env.ALLOWED_ORIGIN || "";
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET!;

// Protected admin panel paths
const protectedPaths = [
	"/admin", // and other protected routes
];

// Auth routes where authenticated users should be redirected
const authRoutes = ["/login"];

// JWT verification using Web Crypto API (Edge Runtime compatible)
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
		const secretKey = encoder.encode(ADMIN_JWT_SECRET);

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

export async function middleware(request: NextRequest) {
	const response = NextResponse.next();
	const pathname = request.nextUrl.pathname;

	// Set CORS headers
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

	// Handle preflight requests
	if (request.method === "OPTIONS") {
		return new NextResponse(null, {
			status: 204,
			headers: response.headers,
		});
	}

	// Check if current path is protected
	const isProtectedPath = protectedPaths.some((path) =>
		pathname.startsWith(path)
	);
	const isAuthRoute = authRoutes.includes(pathname);

	if (isProtectedPath) {
		// Get token from cookie or Authorization header
		const token =
			request.cookies.get("admin-token")?.value ||
			request.headers.get("Authorization")?.split(" ")[1];

		if (!token) {
			return NextResponse.redirect(new URL("/login", request.url));
		}

		try {
			// Verify JWT token using Web Crypto API
			const decoded = await verifyJWT(token);

			if (decoded.role !== "admin") {
				throw new Error("Invalid role");
			}

			// Pass data from token in headers
			const headers = new Headers(request.headers);
			headers.set("x-admin-user-id", decoded.userId);
			headers.set("x-admin-role", decoded.role);

			return NextResponse.next({
				request: {
					headers,
				},
			});
		} catch (error) {
			console.error("Admin auth failed:", error);
			return NextResponse.redirect(new URL("/login", request.url));
		}
	}

	// If user is authenticated and trying to access auth routes, redirect to dashboard
	if (isAuthRoute) {
		const token =
			request.cookies.get("admin-token")?.value ||
			request.headers.get("Authorization")?.split(" ")[1];

		if (token) {
			try {
				const decoded = await verifyJWT(token);
				if (decoded.role === "admin") {
					return NextResponse.redirect(
						new URL("/dashboard", request.url)
					);
				}
			} catch (error) {
				// Invalid token, continue to login page
			}
		}
	}

	return response;
}

export const config = {
	matcher: ["/admin/:path*", "/login"],
};
