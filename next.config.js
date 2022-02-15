// eslint-disable-next-line @typescript-eslint/no-var-requires
const withOptimizedImages = require('next-optimized-images')

/** @type {import('next').NextConfig} */
const nextConfig = withOptimizedImages({
  reactStrictMode: true,
  images: {
    disableStaticImages: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false
    }
    return config
  },
})

module.exports = nextConfig
