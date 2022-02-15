import optimizedImages from 'next-optimized-images'

/** @type {import('next').NextConfig} */
const nextConfig = optimizedImages({
  reactStrictMode: true,

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false
    }
    return config
  },
})

module.exports = nextConfig
