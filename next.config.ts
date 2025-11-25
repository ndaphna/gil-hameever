import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    const webpackConfig = config as typeof config & {
      ignoreWarnings?: (RegExp | ((warning: any) => boolean))[];
    };

    webpackConfig.ignoreWarnings = [
      /Failed to parse source map/,
      /Original file.*outside project/,
      /Unknown url scheme 'chrome-extension'/,
    ];

    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },

  productionBrowserSourceMaps: false,
  trailingSlash: false,

  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};

export default nextConfig;
