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
	const str = price.toString();
	return str.replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " сум";
}

export function formatDate(date: Date) {
	return new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	}).format(date);
}
