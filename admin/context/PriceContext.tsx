// app/components/PriceContext.tsx
"use client";
import { AuPrice } from "@/app/types";
import { createContext, useContext } from "react";

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
	return useContext(PriceContext);
}
