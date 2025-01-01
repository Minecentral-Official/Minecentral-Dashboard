export const hostNavigationConfig = [
  {
    title: 'Home',
    href: '/host',
    description: '',
  },
  {
    title: 'Products',
    // TODO: Think of better copy here
    description: 'Your one stop shop for all things multiplayer minecraft',
    items: [
      {
        title: 'Host',
        href: '/host',
      },
      {
        title: 'Plugins',
        href: '/plugins',
        disabled: true,
      },
      {
        title: 'Servers',
        href: '/servers',
        disabled: true,
      },
    ],
  },
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
        href: '/host/panel',
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
