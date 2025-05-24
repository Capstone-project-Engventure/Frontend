import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  /* config options here */
  // allowedDevOrigins:"*",
  publicRuntimeConfig: {
    baseURL: process.env.NEXT_PUBLIC_BASE_URL || "https://yourdomain.com",
  },
  images: {
    domains: ['localhost','cloudinary'], //Allowed domains
  },
};
// const withNextIntl = createNextIntlPlugin();
export default nextConfig;
