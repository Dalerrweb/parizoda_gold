// app/components/PriceContext.tsx
"use client";
import { AuPrice } from "@/app/types";
import { createContext, useCallback, useContext, useEffect } from "react";
import { toast } from "sonner";

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

	useEffect(() => {
		if (!AuPrice) {
			toast.error("Цены на золото временно недоступны", {
				style: {
					background: "red",
					color: "#fff",
					borderColor: "red",
				},
			});
		}
	}, [AuPrice]);

	const calculate = useCallback(
		({ weight, markup }: { weight: string; markup: string }) => {
			if (!AuPrice) return 0;

			const pricePerGram = Number(AuPrice.pricePerGram);
			const priceWithoutMarkup = pricePerGram * parseFloat(weight);

			return priceWithoutMarkup * (1 + parseFloat(markup) / 100);
		},
		[AuPrice]
	);

	return {
		AuPrice,
		calculate,
	};
}
