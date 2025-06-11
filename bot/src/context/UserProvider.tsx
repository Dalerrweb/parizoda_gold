import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { User } from "@/types";
import axios from "../lib/axios";

interface UserContextValue {
	user: User | null;
	isLoading: boolean;
	updateUser: any;
}

const UserContext = createContext<UserContextValue>({
	user: null,
	isLoading: true,
	updateUser: null,
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	const authCheck = useCallback(async () => {
		try {
			// const token = localStorage.getItem("token");

			// console.log({ token }, "token");

			// if (token) {
			// 	const response = await axios.get("/user");
			// 	setUser(response.data);
			// 	return;
			// }

			const initData = window.Telegram.WebApp.initData;
			const { data } = await axios.post("/auth/telegram", { initData });
			console.log({ initData }, "initData");

			localStorage.setItem("token", data.token);
			setUser(data.user);
		} catch (error) {
			console.error("Auth error:", error);
			localStorage.removeItem("token");
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		authCheck();
	}, [authCheck]);

	return (
		<UserContext.Provider value={{ user, isLoading, updateUser: setUser }}>
			{children}
		</UserContext.Provider>
	);
};
