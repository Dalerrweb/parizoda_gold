import { useEffect, useState } from "react";
import "./App.css";
import { authenticateUser } from "./utils/auth";

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
			<div className="App">
				<h1>Telegram Web App</h1>
				<h2>Status of the request: {status}</h2>
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
