/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		unoptimized: true, // Required for static export
		remotePatterns: [
			{
				protocol: "https",
				hostname: "www.barbudaleisure.com",
			},
			{
				protocol: "https",
				hostname: "barbudaleisure.com",
			},
			{
				protocol: "https",
				hostname: "cdn.sanity.io",
			},
		],
		formats: ["image/avif", "image/webp"],
		deviceSizes: [640, 750, 828, 1080, 1200, 1920],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
		// Pre-configure qualities used in <Image quality={90}> to be Next 16 ready
		qualities: [90],
	},
	compress: true,
	poweredByHeader: false,
	// Fix for multiple lockfiles warning - set the workspace root
	outputFileTracingRoot: require("path").join(__dirname, "../"),
	output: "export",
};

module.exports = nextConfig;
