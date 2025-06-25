import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatPrice(price: number | bigint): string {
	const num = typeof price === "bigint" ? Number(price) : price;
	const fixed = num.toFixed(2); // округление до двух знаков

	const [integerPart, decimalPart] = fixed.split(".");
	const formattedInt = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");

	return decimalPart === "00"
		? `${formattedInt} сум`
		: `${formattedInt}.${decimalPart} сум`;
}
