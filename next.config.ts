import { fileURLToPath } from 'url';

import { createJiti } from 'jiti';

import type { NextConfig } from 'next';

const jiti = createJiti(fileURLToPath(import.meta.url));
jiti.esmResolve('./src/lib/env/server.env.ts');
jiti.esmResolve('./src/lib/env/client.env.ts');

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    dynamicIO: true,
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: '',
        pathname: '**',
        search: '',
      },
    ],
  },
};

export default nextConfig;
