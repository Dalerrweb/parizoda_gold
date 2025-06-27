"use client";

import { CartItem, Product } from "@/types";
import {
	createContext,
	useContext,
	useState,
	useEffect,
	type ReactNode,
} from "react";

interface CartContextType {
	items: CartItem[];
	addItem: (product: Product) => void;
	removeItem: (productId: number) => void;
	updateQuantity: (productId: number, quantity: number) => void;
	clearCart: () => void;
	itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
	const [items, setItems] = useState<CartItem[]>([]);

	// Load cart from localStorage on mount
	useEffect(() => {
		const savedCart = localStorage.getItem("cart");
		if (savedCart) {
			try {
				setItems(JSON.parse(savedCart));
			} catch (error) {
				console.error("Failed to parse cart from localStorage:", error);
			}
		}
	}, []);

	// Save cart to localStorage when it changes
	useEffect(() => {
		localStorage.setItem("cart", JSON.stringify(items));
	}, [items]);

	const addItem = (product: Product) => {
		setItems((prevItems) => {
			const existingItem = prevItems.find(
				(item) => item.product.id === product.id
			);

			if (existingItem) {
				return prevItems.map((item) =>
					item.product.id === product.id
						? { ...item, quantity: item.quantity + 1 }
						: item
				);
			}

			return [...prevItems, { product, quantity: 1 }];
		});
	};

	const removeItem = (productId: number) => {
		setItems((prevItems) =>
			prevItems.filter((item) => item.product.id !== productId)
		);
	};

	const updateQuantity = (productId: number, quantity: number) => {
		if (quantity <= 0) {
			removeItem(productId);
			return;
		}

		setItems((prevItems) =>
			prevItems.map((item) =>
				item.product.id === productId ? { ...item, quantity } : item
			)
		);
	};

	const clearCart = () => {
		setItems([]);
	};

	const itemCount = items.reduce((total, item) => total + item.quantity, 0);

	return (
		<CartContext.Provider
			value={{
				items,
				addItem,
				removeItem,
				updateQuantity,
				clearCart,
				itemCount,
			}}
		>
			{children}
		</CartContext.Provider>
	);
}

export function useCart() {
	const context = useContext(CartContext);
	if (context === undefined) {
		throw new Error("useCart must be used within a CartProvider");
	}
	return context;
}
