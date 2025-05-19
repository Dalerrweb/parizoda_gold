import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	env: {
		ALLOWED_ORIGIN: "*",
	},
};

export default nextConfig;
