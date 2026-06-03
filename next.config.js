/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable static optimization to avoid prerendering errors
  staticPageGenerationTimeout: 0,
}

module.exports = nextConfig
