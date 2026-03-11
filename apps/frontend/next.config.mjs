/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",

 // Fix Turbopack monorepo path
  turbopack: {
    root: "../../",  // Point to /app (monorepo root)
  }, 
};

export default nextConfig;
