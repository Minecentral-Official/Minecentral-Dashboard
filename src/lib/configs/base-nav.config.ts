export const baseNavigationConfig = [
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
];
