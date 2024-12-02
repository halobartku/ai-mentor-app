/** @type {import('next').NextConfig} */
module.exports = {
  output: 'standalone',
  distDir: '.next',
  typescript: {
    ignoreBuildErrors: true
  }
};