import React from "react";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";

const layout = async ({ children }: { children: React.ReactElement }) => {
	const cookieStore = await cookies();
	const token = cookieStore.get("otp_token")?.value;

	try {
		const decoded = jwt.verify(token!, process.env.JWT_SECRET!);
		if (typeof decoded !== "object" || !decoded.verified) {
			redirect("/admin/trusted/otp");
		}
	} catch {
		redirect("/admin/trusted/otp");
	}

	return children;
};

export default layout;
