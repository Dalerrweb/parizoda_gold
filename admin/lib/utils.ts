import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
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
