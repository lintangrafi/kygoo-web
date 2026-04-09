import type { NextConfig } from "next";

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  /* Performance Optimizations */
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,

  /* Image Optimization */
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    unoptimized: process.env.NODE_ENV !== 'production',
  },

  /* Security Headers */
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
        ],
      },
    ];
  },

  /* Redirects for old routes */
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },

  /* Cache Configuration */
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },

  /* Webpack Config */
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunk
            vendor: {
              filename: 'chunks/vendor.js',
              test: /node_modules/,
              priority: 10,
              reuseExistingChunk: true,
              name(module: any) {
                const pkgName = module.context.match(/[\\/]node_modules[\\/](.*?)($|[\\/])/)[1];
                return `npm.${pkgName.replace('@', '')}`;
              },
            },
            // Common chunk
            common: {
              minChunks: 2,
              priority: 5,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }
    return config;
  },

  /* Experimental Features */
  experimental: {
    optimizePackageImports: ['@radix-ui/react-icons'],
  },

  /* Turbopack Configuration */
  turbopack: {
    resolveAlias: {},
  },
};

export default withBundleAnalyzer(nextConfig);

