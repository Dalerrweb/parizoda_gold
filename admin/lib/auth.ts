import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import prisma from "./prisma";

const JWT_SECRET = process.env.ADMIN_JWT_SECRET!;

export async function getSession() {
	try {
		const cookieStore = await cookies();
		const token = cookieStore.get("admin-token")?.value;

		if (!token) {
			return null;
		}

		// Verify JWT token
		const decoded = verify(token, JWT_SECRET) as {
			userId: string;
			role: string;
		};

		// Check if session exists in database
		const session = await prisma.adminSession.findFirst({
			where: {
				token,
				expires: {
					gt: new Date(),
				},
			},
			include: {
				user: {
					select: {
						id: true,
						email: true,
					},
				},
			},
		});

		if (!session) {
			return null;
		}

		return {
			user: session.user,
			role: decoded.role,
		};
	} catch (error) {
		console.error("Session verification error:", error);
		return null;
	}
}

export async function requireAuth() {
	const session = await getSession();

	if (!session) {
		throw new Error("Unauthorized");
	}

	return session;
}
