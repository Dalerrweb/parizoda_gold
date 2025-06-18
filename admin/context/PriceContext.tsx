// app/components/PriceContext.tsx
"use client";
import { AuPrice } from "@/app/types";
import { createContext, useCallback, useContext } from "react";

export const PriceContext = createContext<AuPrice | null>(null);

export function PriceProvider({
	children,
	value,
}: {
	children: React.ReactNode;
	value: AuPrice | null;
}) {
	return (
		<PriceContext.Provider value={value}>{children}</PriceContext.Provider>
	);
}

export function usePrice() {
	const AuPrice = useContext(PriceContext);

	const calucalte = useCallback(
		({ weight, markup }: { weight: number; markup: number }) => {
			console.count("calced");

			if (!AuPrice) {
				return 0;
			}
			const priceWithoutMarkup = Number(AuPrice?.pricePerGram) * weight;
			const priceWithMarkup = priceWithoutMarkup * (1 + markup);

			return priceWithMarkup;
		},
		[AuPrice]
	);

	return {
		AuPrice,
		calucalte,
	};
}
