import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import crypto from "crypto";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function parseInitData(initData: string): Record<string, string> {
	const params = new URLSearchParams(initData);
	const data: Record<string, string> = {};
	for (const [key, value] of params.entries()) {
		data[key] = value;
	}
	return data;
}

export function validateInitData(
	initData: string,
	TELEGRAM_BOT_TOKEN: string
): boolean {
	const parsed = parseInitData(initData);
	const hash = parsed.hash;
	delete parsed.hash;

	const sorted = Object.keys(parsed)
		.sort()
		.map((key) => `${key}=${parsed[key]}`)
		.join("\n");

	const secret = crypto
		.createHmac("sha256", "WebAppData")
		.update(TELEGRAM_BOT_TOKEN)
		.digest();

	const checkHash = crypto
		.createHmac("sha256", secret)
		.update(sorted)
		.digest("hex");

	return checkHash === hash;
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
