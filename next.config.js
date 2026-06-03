/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable static export to avoid build errors with Supabase
  output: 'standalone',
}

module.exports = nextConfig
