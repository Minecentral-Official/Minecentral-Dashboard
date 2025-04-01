import { fileURLToPath } from 'url';

import { createJiti } from 'jiti';

import type { NextConfig } from 'next';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const removeImports = require('next-remove-imports')();

const jiti = createJiti(fileURLToPath(import.meta.url));
jiti.esmResolve('./src/lib/env/server.env.ts');
jiti.esmResolve('./src/lib/env/client.env.ts');

const nextConfig: NextConfig = removeImports({
  /* config options here */
  experimental: {
    useCache: true,
    dynamicIO: false,
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
      {
        protocol: 'https',
        hostname: '*.ufs.sh',
        port: '',
        pathname: '**',
        search: '',
      },
    ],
  },
});

export default nextConfig;
