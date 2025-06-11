import { useEffect, useLayoutEffect, useRef } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import CartPage from "./pages/cart";
import Catalog from "./pages/catalog";
import ProductPage from "./pages/product";
import ProfilePage from "./pages/profile";
import Layout from "./layout/layout";
import Favs from "./pages/favourites";

declare global {
	interface Window {
		Telegram: {
			WebApp: any;
		};
	}
}

const tg = window.Telegram?.WebApp;

function App() {
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
				<Route path="/" element={<Layout />}>
					<Route index element={<Home />} />
					<Route path="/catalog/:category" element={<Catalog />} />
					<Route path="/product/:id" element={<ProductPage />} />
					<Route path="/cart" element={<CartPage />} />
					<Route path="/favorites" element={<Favs />} />
					<Route path="/profile" element={<ProfilePage />} />
				</Route>
			</Routes>
		</div>
	);
}

export default App;
