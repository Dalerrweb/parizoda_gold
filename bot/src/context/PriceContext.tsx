import { AuPrice } from "@/types";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";

export const PriceContext = createContext<AuPrice | null>(null);

export function PriceProvider({ children }: { children: React.ReactNode }) {
	const [price, setPrice] = useState<AuPrice | null>(null);

	useEffect(() => {
		const fetchPrice = async () => {
			try {
				const response = await fetch(
					import.meta.env.VITE_API_URL + "/auprice"
				);
				if (!response.ok) {
					throw new Error("Failed to fetch price");
				}
				const data: AuPrice = await response.json();

				setPrice(data);
			} catch (error) {
				console.error("Error fetching AuPrice:", error);
			}
		};

		fetchPrice();
	}, []);

	return (
		<PriceContext.Provider value={price}>{children}</PriceContext.Provider>
	);
}

export function usePrice() {
	const AuPrice = useContext(PriceContext);

	useEffect(() => {
		if (!AuPrice) {
			console.log("Цены на золото временно недоступны");
		}
	}, [AuPrice]);

	const calculate = useCallback(
		({ weight, markup }: { weight: number; markup: number }) => {
			if (!AuPrice) return 0;

			const pricePerGram = AuPrice.pricePerGram;
			const priceWithoutMarkup = pricePerGram * weight;

			return priceWithoutMarkup * (1 + markup / 100);
		},
		[AuPrice]
	);

	return {
		AuPrice,
		calculate,
	};
}
