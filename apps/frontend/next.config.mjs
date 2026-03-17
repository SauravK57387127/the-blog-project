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
};

export default nextConfig;
