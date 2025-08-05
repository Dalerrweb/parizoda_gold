import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

// export async function getSession() {
// 	try {
// 		const cookieStore = await cookies();
// 		const token = cookieStore.get("admin-token")?.value;

// 		if (!token) {
// 			return null;
// 		}

// 		// Verify JWT token
// 		const decoded = verify(token, JWT_SECRET) as {
// 			userId: string;
// 			role: string;
// 		};

// 		// Check if session exists in database
// 		const session = await prisma.adminSession.findFirst({
// 			where: {
// 				token,
// 				expires: {
// 					gt: new Date(),
// 				},
// 			},
// 			include: {
// 				user: {
// 					select: {
// 						id: true,
// 						email: true,
// 					},
// 				},
// 			},
// 		});

// 		if (!session) {
// 			return null;
// 		}

// 		return {
// 			user: session.user,
// 			role: decoded.role,
// 		};
// 	} catch (error) {
// 		console.error("Session verification error:", error);
// 		return null;
// 	}
// }

// export async function requireAuth() {
// 	const session = await getSession();

// 	if (!session) {
// 		throw new Error("Unauthorized");
// 	}

// 	return session;
// }

export interface AuthPayload {
	userId: number;
	exp: number;
}

export async function requireAuth(
	req: NextRequest
): Promise<
	| { success: true; token: string; payload: AuthPayload }
	| { success: false; response: NextResponse }
> {
	const authHeader = req.headers.get("authorization");

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return {
			success: false,
			response: NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			),
		};
	}

	const token = authHeader.split(" ")[1];

	try {
		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET!
		) as AuthPayload;

		// Проверка на срок действия токена (если вдруг jwt.verify не отлавливает истёкшие токены)
		const currentTime = Math.floor(Date.now() / 1000);
		if (decoded.exp && decoded.exp < currentTime) {
			return {
				success: false,
				response: NextResponse.json(
					{ error: "Token expired" },
					{ status: 401 }
				),
			};
		}

		return { success: true, token, payload: decoded };
	} catch (err) {
		return {
			success: false,
			response: NextResponse.json(
				{ error: "Invalid token" },
				{ status: 401 }
			),
		};
	}
}
