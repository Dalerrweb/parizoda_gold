import { Product, ProductType } from "@/types";
import {
	createContext,
	useContext,
	useEffect,
	useState,
	useCallback,
} from "react";

export interface CartItem {
	id: number;
	type: ProductType;
	variantId: number;
	weight: number;
	markup: number;
	title: string;
	quantity: number;
	items?: CartBundleItem[];
}

type CartBundleItem = {
	id: number;
	variantId: string;
	weight: number;
	markup: number;
	title: string;
};

interface CartContextType {
	cart: CartItem[];
	cartLength: number;
	addToCart: (item: CartItem) => void;
	removeFromCart: (id: CartItem["id"]) => void;
	increment: (id: CartItem["id"], variantId: CartItem["variantId"]) => void;
	decrement: (id: CartItem["id"], variantId: CartItem["variantId"]) => void;
	emptyCart: () => void;
	Item: (productId: Product["id"], variantId: any) => CartItem | undefined;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
	const [cart, setCart] = useState<CartItem[]>(() => {
		try {
			const raw = localStorage.getItem("cart");
			return raw ? JSON.parse(raw) : [];
		} catch (err) {
			localStorage.removeItem("cart");
			return [];
		}
	});

	// Синхронизация с localStorage при изменении корзины
	useEffect(() => {
		localStorage.setItem("cart", JSON.stringify(cart));
	}, [cart]);

	const addToCart = useCallback((item: CartItem) => {
		setCart((prev) => {
			const existing = prev.find(
				(i) => i.id === item.id && item.variantId === i.variantId
			);

			if (existing) {
				return prev.map((i) =>
					i.id === item.id && item.variantId === i.variantId
						? { ...i, quantity: i.quantity + item.quantity }
						: i
				);
			} else {
				return [...prev, item];
			}
		});
	}, []);

	const removeFromCart = useCallback((id: CartItem["id"]) => {
		setCart((prev) => prev.filter((item) => item.id !== id));
	}, []);

	const increment = useCallback(
		(id: CartItem["id"], variantId: CartItem["variantId"]) => {
			setCart((prev) =>
				prev.map((item) =>
					item.id === id && item.variantId === variantId
						? {
								...item,
								quantity: item.quantity + 1,
						  }
						: item
				)
			);
		},
		[]
	);
	const decrement = useCallback(
		(id: CartItem["id"], variantId: CartItem["variantId"]) => {
			setCart((prev) =>
				prev
					.map((item) =>
						item.id === id && item.variantId === variantId
							? {
									...item,
									quantity: item.quantity - 1,
							  }
							: item
					)
					.filter((item) => item.quantity > 0)
			);
		},
		[]
	);
	// .filter((item) => item.quantity > 0) // Автоматическое удаление при нуле
	const Item = (productId: Product["id"], variantId: any) => {
		return cart.find(
			(elem) => elem.id === productId && variantId === elem.variantId
		);
	};

	const emptyCart = useCallback(() => {
		setCart([]);
	}, []);

	const contextValue: CartContextType = {
		Item,
		cart,
		cartLength: cart.reduce((sum, item) => sum + item.quantity, 0),
		addToCart,
		removeFromCart,
		increment,
		decrement,
		emptyCart,
	};

	return (
		<CartContext.Provider value={contextValue}>
			{children}
		</CartContext.Provider>
	);
}

export function useCart() {
	const context = useContext(CartContext);
	if (!context) {
		throw new Error("useCart must be used within a CartProvider");
	}
	return context;
}
