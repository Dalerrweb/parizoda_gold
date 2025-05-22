import { User } from "@/types";
import { createContext } from "react";

export const mockUser: User = {
	id: 1,
	telegramId: 123456789,
	username: "johndoe",
	first_name: "John",
	last_name: "Doe",
	photo_url: "",
	language_code: "en",
	createdAt: new Date("2023-01-15"),
	// Mock orders data
	orders: [
		{
			id: 101,
			status: "DELIVERED",
			totalAmount: 5999,
			items: [{ name: "Wireless Headphones", quantity: 1, price: 5999 }],
			createdAt: new Date("2023-05-20"),
		},
		{
			id: 102,
			status: "PROCESSING",
			totalAmount: 2499,
			items: [
				{ name: "Phone Case", quantity: 1, price: 1499 },
				{ name: "Screen Protector", quantity: 1, price: 1000 },
			],
			createdAt: new Date("2023-06-15"),
		},
		{
			id: 103,
			status: "CANCELLED",
			totalAmount: 8999,
			items: [{ name: "Smart Watch", quantity: 1, price: 8999 }],
			createdAt: new Date("2023-07-10"),
		},
	],
};

export const userCTX = createContext<User | null>(mockUser);
