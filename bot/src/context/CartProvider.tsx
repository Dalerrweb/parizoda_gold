import { ProductType } from "@/types";
import {
	createContext,
	useContext,
	useEffect,
	useState,
	useCallback,
} from "react";

export interface CartItem {
	configKey: string;
	id: number;
	type: ProductType;
	image: string;
	weight: number;
	markup: number;
	title: string;
	quantity: number;
	items?: CartBundleItem[];
}

type CartBundleItem = {
	id: number;
	variantId: string;
	image: string;
	weight: number;
	markup: number;
	title: string;
};

interface CartContextType {
	cart: CartItem[];
	cartLength: number;
	addToCart: (item: CartItem) => void;
	removeFromCart: (configKey: string) => void;
	increment: (configKey: string) => void;
	decrement: (configKey: string) => void;
	emptyCart: () => void;
	Item: (configKey: string) => CartItem | undefined;
}

export function generateConfigKey(
	productId: number,
	variantId?: number,
	bundleItems?: Record<string, any>
): string {
	if (bundleItems && Object.keys(bundleItems).length > 0) {
		const parts = Object.values(bundleItems)
			.slice()
			.sort((a, b) => a.childId - b.childId)
			.map((item) => `${item.childId}:${item.selectedSizeId}`);
		return `bundle-${productId}|${parts.join("|")}`;
	} else {
		return `single-${productId}|${variantId}`;
	}
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

	useEffect(() => {
		localStorage.setItem("cart", JSON.stringify(cart));
	}, [cart]);

	const addToCart = useCallback((item: CartItem) => {
		setCart((prev) => {
			const existing = prev.find((i) => i.configKey === item.configKey);
			if (existing) {
				return prev.map((i) =>
					i.configKey === item.configKey
						? { ...i, quantity: i.quantity + item.quantity }
						: i
				);
			} else {
				return [...prev, item];
			}
		});
	}, []);

	const removeFromCart = useCallback((configKey: string) => {
		setCart((prev) => prev.filter((item) => item.configKey !== configKey));
	}, []);

	const increment = useCallback((configKey: string) => {
		setCart((prev) =>
			prev.map((item) =>
				item.configKey === configKey
					? {
							...item,
							quantity: item.quantity + 1,
					  }
					: item
			)
		);
	}, []);
	const decrement = useCallback((configKey: string) => {
		setCart((prev) =>
			prev
				.map((item) =>
					item.configKey === configKey
						? {
								...item,
								quantity: item.quantity - 1,
						  }
						: item
				)
				.filter((item) => item.quantity > 0)
		);
	}, []);
	// .filter((item) => item.quantity > 0) // Автоматическое удаление при нуле
	const Item = (configKey: string) => {
		return cart.find((elem) => elem.configKey === configKey);
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
