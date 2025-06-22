import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  /* config options here */
  // allowedDevOrigins:"*",
  publicRuntimeConfig: {
    baseURL: process.env.NEXT_PUBLIC_BASE_URL || "https://yourdomain.com",
  },
  images: {
    domains: ['localhost','cloudinary'], //Allowed domains
  },
  
  // Performance optimizations
  experimental: {
    optimizePackageImports: [
      'react-icons/lu',
      'react-icons/hi', 
      'react-icons/fa',
      'react-icons/fi',
      'react-icons/bi',
      'react-icons/tb',
      'react-icons/gi',
      'lodash',
      '@headlessui/react'
    ]
  },
  
  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle splitting
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
            icons: {
              test: /[\\/]node_modules[\\/]react-icons[\\/]/,
              name: 'react-icons',
              chunks: 'all',
            },
            ui: {
              test: /[\\/]node_modules[\\/]@headlessui[\\/]/,
              name: 'headlessui',
              chunks: 'all',
            },
          },
        },
      };
    }

    // Resolve alias for faster imports
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, 'src'),
    };

    return config;
  },
  
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Enable SWC minifier for faster builds
  swcMinify: true,
};

const withNextIntl = createNextIntlPlugin();
// export default nextConfig;
export default withNextIntl(nextConfig);
