import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { authenticateUser } from "./utils/auth";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import { User, userCTX } from "./context/user";
import CartPage from "./pages/cart";
import Catalog from "./pages/catalog";

declare global {
	interface Window {
		Telegram: {
			WebApp: any;
		};
	}
}

const tg = window.Telegram?.WebApp;

function App() {
	const [user, setUser] = useState<User>(tg?.initDataUnsafe?.user);
	const contentRef = useRef<HTMLDivElement>(null);

	// Блокировка свайпа и скролла
	useLayoutEffect(() => {
		if (!tg) return;

		// Принудительное расширение и блокировка закрытия
		tg.expand();
		tg.enableClosingConfirmation();
		tg.BackButton.hide();

		// Фикс для iOS
		const handleTouchMove = (e: TouchEvent) => {
			if (
				contentRef.current &&
				!contentRef.current.contains(e.target as Node)
			) {
				e.preventDefault();
			}
		};

		document.body.style.overscrollBehavior = "none";
		document.addEventListener("touchmove", handleTouchMove, {
			passive: false,
		});

		return () => {
			document.removeEventListener("touchmove", handleTouchMove);
		};
	}, []);

	// Инициализация приложения
	useEffect(() => {
		if (!tg) return;

		tg.ready();
		tg.onEvent("viewportChanged", handleViewportChange);
		tg.setHeaderColor("#FFFFFF");

		const authenticate = async () => {
			try {
				await authenticateUser();
				console.log("User authenticated");
				setUser(tg.initDataUnsafe?.user);
			} catch (error) {
				console.error("Authentication error:", error);
			}
		};

		authenticate();

		return () => {
			tg.offEvent("viewportChanged", handleViewportChange);
		};
	}, []);

	const handleViewportChange = () => {
		if (!tg.isExpanded) {
			tg.expand();
			window.scrollTo(0, 0);
		}
	};

	return (
		<userCTX.Provider value={user}>
			<div
				ref={contentRef}
				className="app-container"
				onScroll={(e) => {
					// Блокировка скролла за пределы контента
					if (e.currentTarget.scrollTop <= 0) {
						e.currentTarget.scrollTop = 1;
					}
				}}
			>
				<Routes>
					<Route index element={<Home />} />
					<Route path="/catalog/:category" element={<Catalog />} />
					<Route path="/cart" element={<CartPage />} />
				</Routes>
			</div>
		</userCTX.Provider>
	);
}

export default App;
