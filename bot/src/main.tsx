import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./context/UserProvider";
import { Provider } from "react-redux";
import { store } from "./store.ts";
import { PriceProvider } from "./context/PriceContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<Provider store={store}>
			<BrowserRouter>
				<PriceProvider>
					<UserProvider>
						<App />
					</UserProvider>
				</PriceProvider>
			</BrowserRouter>
		</Provider>
	</React.StrictMode>
);
