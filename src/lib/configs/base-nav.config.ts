import {
  BetweenVerticalEndIcon,
  BoxIcon,
  CloudMoonIcon,
  PackageIcon,
  PlugIcon,
  ServerIcon,
  SwatchBookIcon,
} from 'lucide-react';

import { NavigationConfig } from '@/components/nav/nav-config.type';

export function baseNavigationConfig() {
  return [
    {
      title: 'Discover More',
      Icon: BoxIcon,
      items: [
        {
          title: 'Plugins',
          href: '/plugins',
          Icon: PlugIcon,
        },
        {
          title: 'Mods',
          href: '/mods',
          Icon: SwatchBookIcon,
        },
        {
          title: 'Data Packs',
          href: '/datapacks',
          Icon: BetweenVerticalEndIcon,
        },
        {
          title: 'Mod Packs',
          href: '/modpacks',
          Icon: PackageIcon,
        },
        {
          title: 'Resource Packs',
          href: '/resourcepacks',
          Icon: BoxIcon,
        },
        {
          title: 'Shaders',
          href: '/shaders',
          Icon: CloudMoonIcon,
        },
      ],
    },
    {
      title: 'Host a Server',
      href: '/hosting',
      Icon: ServerIcon,
    },
  ] satisfies NavigationConfig;
}
