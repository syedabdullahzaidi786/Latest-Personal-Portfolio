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
        /* Security — also helps SEO trust signals */
        { key: 'X-DNS-Prefetch-Control',  value: 'on' },
        { key: 'X-Content-Type-Options',  value: 'nosniff' },
        { key: 'X-Frame-Options',         value: 'SAMEORIGIN' },
        { key: 'Referrer-Policy',         value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy',      value: 'camera=(), microphone=(), geolocation=()' },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains; preload',
        },
        /* Prevents caching stale HTML — let CDN handle it */
        { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
      ],
    },
    /* Long-lived cache for static assets */
    {
      source: '/images/(.*)',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
      ],
    },
    {
      source: '/models/(.*)',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
      ],
    },
    {
      source: '/_next/static/(.*)',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
      ],
    },
  ],
};

export default nextConfig;
