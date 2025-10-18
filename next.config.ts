import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  webpack: (config, { isServer }) => {
    // Fix for chrome-extension scheme errors
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

    // Ignore source map warnings
    config.ignoreWarnings = [
      /Failed to parse source map/,
      /Original file.*outside project/,
      /Unknown url scheme 'chrome-extension'/,
    ];

    return config;
  },
  // Disable source maps completely to avoid errors
  productionBrowserSourceMaps: false,
  // Optimize for better performance
  // Handle static files better
  trailingSlash: false,
  // Better error handling
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // Disable source maps in development
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
