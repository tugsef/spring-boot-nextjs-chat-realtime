/** @type {import('next').NextConfig} */
const nextConfig = {
	webpack: (config) => {
		config.resolve = config.resolve || {};
		config.resolve.alias = {
			...(config.resolve.alias || {}),
			"supports-color": false,
		};
		return config;
	},
};

export default nextConfig;
