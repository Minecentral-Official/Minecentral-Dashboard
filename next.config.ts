import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: {
    serverActions: { bodySizeLimit: '10mb' },
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'utfs.io', pathname: '**' },
      { protocol: 'https', hostname: '*.ufs.sh', pathname: '**' },
    ],
  },
};

export default nextConfig;
