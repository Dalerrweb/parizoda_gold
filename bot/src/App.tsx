import { useEffect, useState } from "react";
import { authenticateUser } from "./utils/auth";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import { User, userCTX } from "./context/user";

const tg = window.Telegram.WebApp;

function App() {
	const [user, setUser] = useState<User>(tg.initDataUnsafe?.user);

	useEffect(() => {
		tg.ready();
		tg.expand();
		authenticateUser()
			.then((res) => {
				console.log("User authenticated", res);
			})
			.catch((error) => {
				console.error("Authentication error:", error);
			});
		// setUser({
		// 	id: 0,
		// 	first_name: "Dalerr",
		// 	last_name: "Sharifkulov",
		// 	username: "Daler Sharifkulov",
		// 	language_code: "",
		// 	photo_url: "",
		// });
		setUser(tg.initDataUnsafe?.user);
	}, []);

	// const onClose = () => {};

	return (
		<>
			<userCTX.Provider value={user}>
				<Routes>
					<Route index element={<Home />} />
				</Routes>
			</userCTX.Provider>
		</>
	);
}

export default App;
