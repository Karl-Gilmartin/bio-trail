/** @type {import("next").NextConfig} */
const nextConfig = {
    eslint: {
      ignoreDuringBuilds: true, // ✅ Disables ESLint in builds
    },
  };
  
  export default nextConfig; // ✅ Use ESM export instead of module.exports
  