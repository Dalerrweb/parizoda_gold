import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getStatusColor(status: string): string {
	const statusColors: Record<string, string> = {
		pending: "bg-yellow-500",
		processing: "bg-blue-500",
		shipped: "bg-purple-500",
		delivered: "bg-green-500",
		cancelled: "bg-red-500",
	};

	return statusColors[status.toLowerCase()] || "bg-gray-500";
}

export const formatDate = (date: Date) => {
	return new Intl.DateTimeFormat("ru", {
		year: "numeric",
		month: "long",
		day: "numeric",
	}).format(new Date(date));
};

export function formatPrice(price: number | bigint): string {
	const num = typeof price === "bigint" ? Number(price) : price;
	const fixed = num.toFixed(2); // округление до двух знаков

	const [integerPart, decimalPart] = fixed.split(".");
	const formattedInt = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

	return decimalPart === "00"
		? `${formattedInt} сум`
		: `${formattedInt}.${decimalPart} сум`;
}
