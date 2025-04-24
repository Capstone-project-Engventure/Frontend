import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  /* config options here */
  // allowedDevOrigins:"*",
  publicRuntimeConfig: {
    baseURL: process.env.NEXT_PUBLIC_BASE_URL || "https://yourdomain.com",
  },
};
// const withNextIntl = createNextIntlPlugin();
export default nextConfig;
