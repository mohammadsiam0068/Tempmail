/** @type {import('next').NextConfig} */
const nextConfig = {
  // Skip static optimization for pages that require runtime access
  skipStaticOptimization: true,
  // Set a timeout to avoid prerendering issues
  staticPageGenerationTimeout: 0,
  // Disable static exports to avoid build time errors
  experimental: {
    isrMemoryCacheSize: 0,
  },
}

module.exports = nextConfig
