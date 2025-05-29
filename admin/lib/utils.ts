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
