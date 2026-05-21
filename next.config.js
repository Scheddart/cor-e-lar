/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'
const basePath = isProd ? '/cor-e-lar' : ''

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  reactStrictMode: true,
  basePath,
  assetPrefix: basePath || undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
