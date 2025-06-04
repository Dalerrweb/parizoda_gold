import { authenticateUser } from "@/utils/auth";
import Axios, {
	AxiosInstance,
	InternalAxiosRequestConfig,
	AxiosHeaders,
} from "axios";

const serverUrl = import.meta.env.VITE_API_URL;

if (!serverUrl) {
	throw new Error("VITE_API_URL is not defined");
}

export const baseURL = `${serverUrl}`;

const axios: AxiosInstance = Axios.create({
	baseURL,
	timeout: 120000,
});

axios.interceptors.request.use(
	async function (
		config: InternalAxiosRequestConfig
	): Promise<InternalAxiosRequestConfig> {
		const token = localStorage.getItem("token");

		if (!config.headers) {
			config.headers = new AxiosHeaders();
		}

		if (token) {
			config.headers.set("Authorization", `Bearer ${token}`);
			config.headers.set("Content-Type", "application/json");
		}

		return config;
	},
	function (error) {
		return Promise.reject(error);
	}
);

axios.interceptors.response.use(
	(response) => response,
	async (error) => {
		if (error.response?.status === 401 && !error.config._retry) {
			error.config._retry = true;
			localStorage.removeItem("token");
			await authenticateUser();
			return axios(error.config);
		}
		return Promise.reject(error);
	}
);
export default axios;
