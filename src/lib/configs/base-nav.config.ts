import { minecentralServicesConfig } from '@/lib/configs/minecentral-services.config';

export function baseNavigationConfig(
  service?: (typeof minecentralServicesConfig)[number],
) {
  return [
    {
      title: 'Home',
      href: `/${service || ''}`,
      description: '',
    },
    {
      title: 'Services',
      description: 'Your one stop shop for all things minecraft',
      items: [
        {
          title: 'Minecraft Hosting',
          href: '/hosting',
        },
        {
          title: 'Plugins & Resources',
          href: '/resources',
        },
        {
          title: 'Server List',
          href: '/worlds',
          disabled: true,
        },
        {
          title: 'Docs',
          href: 'https://docs.minecentral.net',
        },
      ],
    },
  ];
}
