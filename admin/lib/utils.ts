import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// Валидация JWT
export async function verifyJWT(token: string): Promise<any> {
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
		const secretKey = encoder.encode(process.env.ADMIN_JWT_SECRET);

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

export const uploadFiles = async (files: any) => {
	const formData = new FormData();
	files.forEach((file: any) => formData.append("files", file.file)); // Ключ "files"

	const response = await fetch("/api/admin/multiple-upload", {
		method: "POST",
		body: formData,
	});

	const { urls } = await response.json();
	return urls;
};
export function formatPrice(price: number | bigint): string {
	const num = typeof price === "bigint" ? Number(price) : price;
	const fixed = num.toFixed(2); // округление до двух знаков

	const [integerPart, decimalPart] = fixed.split(".");
	const formattedInt = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");

	return decimalPart === "00"
		? `${formattedInt} сум`
		: `${formattedInt}.${decimalPart} сум`;
}
export function formatDate(date: Date) {
	return new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	}).format(date);
}
