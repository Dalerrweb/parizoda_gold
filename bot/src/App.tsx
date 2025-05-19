import { useEffect } from "react";
import "./App.css";
import { authenticateUser } from "./utils/auth";

const tg = window.Telegram.WebApp;

function App() {
	const user = tg.initDataUnsafe?.user;
	useEffect(() => {
		tg.ready();
		authenticateUser()
			.then((res) => {
				console.log("User authenticated", res);
			})
			.catch((error) => {
				console.error("Authentication error:", error);
			});
	}, []);

	// const onClose = () => {};

	return (
		<>
			<div className="App">
				<h1>Telegram Web App</h1>
				{user && (
					<div>
						<p>First name: {user.first_name}</p>
						<p>Last name: {user.last_name}</p>
						<p>Username: {user.username}</p>
						<p>ID: {user.id}</p>
					</div>
				)}
				{/* <button onClick={onClose}>Close</button> */}
			</div>
		</>
	);
}

export default App;
