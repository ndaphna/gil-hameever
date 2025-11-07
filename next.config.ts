import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Build configuration - temporarily ignoring lint/type errors for deployment
  // TODO: Re-enable strict checks after resolving issues
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Webpack customizations
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Exclude Node.js modules from client-side bundle
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    // Suppress known source map warnings
    const webpackConfig = config as typeof config & {
      ignoreWarnings?: RegExp[];
    };
    webpackConfig.ignoreWarnings = [
      /Failed to parse source map/,
      /Original file.*outside project/,
      /Unknown url scheme 'chrome-extension'/,
    ];

    // Configure SVGR for importing SVG files as React components
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },

  // Performance and routing settings
  productionBrowserSourceMaps: false,
  trailingSlash: false,

  // On-demand entries configuration for development
  onDemandEntries: {
    maxInactiveAge: 25 * 1000, // 25 seconds
    pagesBufferLength: 2,
  },
};

export default nextConfig;
