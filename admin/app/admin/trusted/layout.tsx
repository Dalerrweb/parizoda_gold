import { Role } from "@/app/types";
import { verifyJWT } from "@/lib/utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import SuperadminLogin from "./SuperAdminLogin";

const layout = async ({ children }: { children: React.ReactElement }) => {
	const cookieStore = await cookies();
	const token = cookieStore.get("admin-token")?.value;

	if (!token) {
		redirect("/admin");
	}

	let decoded;

	try {
		decoded = await verifyJWT(token);
	} catch (err) {
		console.error("Invalid token", err);
		redirect("/admin");
	}

	if (!decoded || typeof decoded !== "object") {
		redirect("/admin");
	}

	if (decoded.role === Role.SUPERADMIN) {
		return <div>{children}</div>;
	}

	if (decoded.role === Role.ADMIN) {
		return <SuperadminLogin>{children}</SuperadminLogin>;
	}

	redirect("/login");
};

export default layout;
