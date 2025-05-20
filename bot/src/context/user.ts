import { createContext } from "react";

export type User = {
	id: number;
	first_name: string;
	last_name: string;
	username: string;
	language_code: string;
	photo_url: string;
} | null;

export const userCTX = createContext<User>(null);
