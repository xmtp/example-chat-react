// eslint-disable-next-line @typescript-eslint/no-var-requires
const optimizedImages = require('next-optimized-images')
// // eslint-disable-next-line @typescript-eslint/no-var-requires
// const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = optimizedImages({
  reactStrictMode: true,
  images: {
    disableStaticImages: true,
  },
  handleImages: ['jpeg', 'png', 'svg'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false
    }
    return config
  },
})

module.exports = nextConfig
