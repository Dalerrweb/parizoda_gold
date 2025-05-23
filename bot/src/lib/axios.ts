import Axios, {
	AxiosInstance,
	InternalAxiosRequestConfig,
	AxiosResponse,
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
	(res: AxiosResponse) => {
		return res;
	},
	(error) => {
		if (error?.response?.status === 401) {
			window.location.href = "/";
		} else if (error?.response?.status === 403) {
			console.warn("Доступ запрещен.");
		}
		return Promise.reject(error);
	}
);

export default axios;
