import { Product } from "@/types";
import {
	createContext,
	useContext,
	useEffect,
	useState,
	useCallback,
} from "react";

type LikedItem = {
	id: number;
	name: string;
	description: string | undefined;
	images: { url: string }[];
	sizes: { weight: number }[];
	markup: number;
	type: string;
};

const FavsContext = createContext<{
	favs: Product[];
	likeOrDislike: (product: LikedItem) => void;
} | null>(null);

export function FavsProvider({ children }: { children: React.ReactNode }) {
	const [favs, setFavs] = useState(() => {
		try {
			const raw = localStorage.getItem("favs");
			return raw ? JSON.parse(raw) : [];
		} catch (err) {
			localStorage.removeItem("favs");
			return [];
		}
	});

	const likeOrDislike = useCallback((product: LikedItem) => {
		setFavs((prev: LikedItem[]) => {
			const existingIndex = prev.findIndex(
				(item: LikedItem) => item.id === product.id
			);
			if (existingIndex !== -1) {
				return prev.filter((_, index) => index !== existingIndex);
			}
			return [...prev, product];
		});
	}, []);

	useEffect(() => {
		localStorage.setItem("favs", JSON.stringify(favs));
	}, [favs]);

	return (
		<FavsContext.Provider value={{ favs, likeOrDislike }}>
			{children}
		</FavsContext.Provider>
	);
}

export function useLikes() {
	const context = useContext(FavsContext);
	if (!context) {
		throw new Error("useLikes must be used within a FavsProvider");
	}
	return context;
}
