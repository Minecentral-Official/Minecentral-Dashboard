import { baseNavigationConfig } from '@/lib/configs/base-nav.config';

export const hostNavigationConfig = [
  ...baseNavigationConfig('hosting'),
  {
    title: 'Features',
    // TODO: Think of better copy here
    description: 'Host your own minecraft servers with ease',
    items: [
      {
        title: 'Pricing',
        href: '/hosting/pricing',
      },
      {
        title: 'Performance',
        href: '/hosting/performance',
      },
      {
        title: 'Panel',
        href: '/hosting/panel',
      },
      {
        title: 'Documentation',
        href: '/documentation/host',
      },
    ],
  },
];
