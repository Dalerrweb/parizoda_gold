import {
	createContext,
	useContext,
	useEffect,
	useState,
	useCallback,
} from "react";

interface CartItem {
	id: string | number;
	quantity: number;
}

interface CartContextType {
	cart: CartItem[];
	cartLength: number;
	addToCart: (item: CartItem) => void;
	removeFromCart: (id: CartItem["id"]) => void;
	changeQuantity: (id: CartItem["id"], newQuantity: number) => void;
	emptyCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
	const [cart, setCart] = useState<CartItem[]>([]);

	// Инициализация корзины из localStorage
	useEffect(() => {
		const rawCart = localStorage.getItem("cart");
		if (rawCart) {
			try {
				const parsed = JSON.parse(rawCart);
				setCart(Array.isArray(parsed) ? parsed : []);
			} catch {
				localStorage.removeItem("cart");
				setCart([]);
			}
		}
	}, []);

	// Синхронизация с localStorage при изменении корзины
	useEffect(() => {
		localStorage.setItem("cart", JSON.stringify(cart));
	}, [cart]);

	const addToCart = useCallback((item: CartItem) => {
		setCart((prev) => {
			// Проверка на существование товара в корзине
			const existing = prev.find((i) => i.id === item.id);

			if (existing) {
				// Обновляем количество если товар уже есть
				return prev.map((i) =>
					i.id === item.id
						? { ...i, quantity: i.quantity + item.quantity }
						: i
				);
			} else {
				// Добавляем новый товар
				return [...prev, item];
			}
		});
	}, []);

	const removeFromCart = useCallback((id: CartItem["id"]) => {
		setCart((prev) => prev.filter((item) => item.id !== id));
	}, []);

	const changeQuantity = useCallback(
		(id: CartItem["id"], newQuantity: number) => {
			setCart(
				(prev) =>
					prev
						.map((item) =>
							item.id === id
								? {
										...item,
										quantity: Math.max(1, newQuantity),
								  }
								: item
						)
						.filter((item) => item.quantity > 0) // Автоматическое удаление при нуле
			);
		},
		[]
	);

	const emptyCart = useCallback(() => {
		setCart([]);
	}, []);

	const contextValue: CartContextType = {
		cart,
		cartLength: cart.reduce((sum, item) => sum + item.quantity, 0),
		addToCart,
		removeFromCart,
		changeQuantity,
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
