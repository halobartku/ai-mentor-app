/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  experimental: {
    serverComponentsExternalPackages: ['@clerk/backend']
  }
}

module.exports = nextConfig