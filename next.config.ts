import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	basePath: process.env.BASEPATH,
	images: {
		unoptimized: true,
	},
};

export default nextConfig;
