import { useEffect, useState } from "react";
import { authenticateUser } from "./utils/auth";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/home";

const tg = window.Telegram.WebApp;

function App() {
	const user = tg.initDataUnsafe?.user;
	const [status, setStatus] = useState("");

	useEffect(() => {
		tg.ready();
		authenticateUser()
			.then((res) => {
				console.log("User authenticated", res);
				setStatus(JSON.stringify(res));
			})
			.catch((error) => {
				console.error("Authentication error:", error);
				setStatus(error.message);
			});
	}, []);

	// const onClose = () => {};

	return (
		<>
			<Routes>
				<Route index element={<Home />} />
			</Routes>
		</>
	);
}

export default App;
