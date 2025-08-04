import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	env: {
		ALLOWED_ORIGIN: "*",
	},
};

export default nextConfig;
