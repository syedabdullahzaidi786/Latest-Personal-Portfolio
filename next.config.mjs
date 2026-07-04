/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@splinetool/runtime'],
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', 'three'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-DNS-Prefetch-Control', value: 'on' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
      ],
    },
  ],
};

export default nextConfig;
