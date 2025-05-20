import { useEffect, useLayoutEffect, useState } from "react";
import { authenticateUser } from "./utils/auth";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import { User, userCTX } from "./context/user";

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

	useLayoutEffect(() => {
		if (tg) {
			tg.expand();
			tg.enableClosingConfirmation();
		}
	}, []);

	useEffect(() => {
		if (!tg) return;

		const initApp = async () => {
			tg.ready();
			try {
				await authenticateUser();
				console.log("User authenticated");
			} catch (error) {
				console.error("Authentication error:", error);
			}
			setUser(tg.initDataUnsafe?.user);
		};

		// Настройка кнопки закрытия
		tg.MainButton.show();
		tg.MainButton.setParams({
			text: "ЗАКРЫТЬ",
			color: "#FF3347",
			textColor: "#FFFFFF",
		});
		tg.MainButton.onClick(() => tg.close());

		// Обработчики свайпа и скролла
		let startY = 0;
		const touchStart = (e: TouchEvent) => (startY = e.touches[0].clientY);
		const touchMove = (e: TouchEvent) => {
			if (window.scrollY <= 0 && e.touches[0].clientY - startY > 50) {
				e.preventDefault();
			}
		};

		document.addEventListener("touchstart", touchStart);
		document.addEventListener("touchmove", touchMove, { passive: false });

		// Фикс скролла вверх
		let lastScrollTop = 0;
		const handleScroll = () => {
			const st = window.pageYOffset;
			if (st < lastScrollTop && st <= 0) window.scrollTo(0, 1);
			lastScrollTop = st <= 0 ? 0 : st;
		};

		window.addEventListener("scroll", handleScroll);

		initApp();

		return () => {
			document.removeEventListener("touchstart", touchStart);
			document.removeEventListener("touchmove", touchMove);
			window.removeEventListener("scroll", handleScroll);
			tg.MainButton.offClick();
		};
	}, []);

	return (
		<userCTX.Provider value={user}>
			<div className="app-container">
				<div className="content-wrapper">
					<Routes>
						<Route index element={<Home />} />
					</Routes>
				</div>
			</div>
		</userCTX.Provider>
	);
}

export default App;
