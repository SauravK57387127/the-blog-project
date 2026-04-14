/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
experimental: {
    scrollRestoration: true,
  },
 // Fix Turbopack monorepo path
  turbopack: {
    root: "../../",  // Point to /app (monorepo root)
  },
  images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'images.unsplash.com',
    },
    {
      protocol: 'https',
      hostname: '**', // or your specific CDN/storage hostname
    },
  ],
},
};

export default nextConfig;
