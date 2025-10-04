/** @type {import('next').NextConfig} */
const nextConfig = {
  // Set the output file tracing root to avoid workspace detection issues
  outputFileTracingRoot: __dirname,
  // App directory is stable in Next.js 15
  experimental: {
    // Enable latest React features
    reactCompiler: false,
  },
  // Enable TypeScript strict mode
  typescript: {
    ignoreBuildErrors: false,
  },
  // Enable ESLint during builds
  eslint: {
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig
