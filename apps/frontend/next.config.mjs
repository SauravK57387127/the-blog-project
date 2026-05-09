/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    scrollRestoration: true,
  },
turbopack: {
    root: process.env.TURBOPACK_ROOT || "../../",
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
