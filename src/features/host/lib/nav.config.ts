import { baseNavigationConfig } from '@/lib/configs/base-nav.config';

export const hostNavigationConfig = [
  ...baseNavigationConfig,
  {
    title: 'Features',
    // TODO: Think of better copy here
    description: 'Host your own minecraft servers with ease',
    items: [
      {
        title: 'Pricing',
        href: '/host/pricing',
      },
      {
        title: 'Performance',
        href: '/host/performance',
      },
      {
        title: 'Panel',
        href: '/host/panel',
      },
      {
        title: 'Documentation',
        href: '/documentation/host',
      },
    ],
  },
];
