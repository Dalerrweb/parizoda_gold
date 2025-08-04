import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	async headers() {
		return [
			{
				source: "/:path*",
				headers: [
					{ key: "Access-Control-Allow-Credentials", value: "true" },
					{
						key: "Access-Control-Allow-Origin",
						value: "https://famous-lolly-8c17ac.netlify.app",
					},
					{
						key: "Access-Control-Allow-Methods",
						value: "GET,POST,PATCH,DELETE,OPTIONS",
					},
					{
						key: "Access-Control-Allow-Headers",
						value: "Content-Type,Authorization,Cookie",
					},
				],
			},
		];
	},

	env: {
		ALLOWED_ORIGIN: "*",
	},
};

export default nextConfig;
