import { BoxIcon, ServerIcon } from 'lucide-react';

import { NavigationConfig } from '@/components/nav/nav-config.type';

export function baseNavigationConfig() {
  return [
    {
      title: 'Resources',
      Icon: BoxIcon,
      href: '/plugins',
      // items: [
      //   {
      //     title: 'Plugins',
      //     href: '/plugins',
      //     Icon: PlugIcon,
      //   },
      //   {
      //     title: 'Mods',
      //     href: '/mods',
      //     Icon: SwatchBookIcon,
      //   },
      //   {
      //     title: 'Data Packs',
      //     href: '/datapacks',
      //     Icon: BetweenVerticalEndIcon,
      //   },
      //   {
      //     title: 'Mod Packs',
      //     href: '/modpacks',
      //     Icon: PackageIcon,
      //   },
      //   {
      //     title: 'Resource Packs',
      //     href: '/resourcepacks',
      //     Icon: BoxIcon,
      //   },
      //   {
      //     title: 'Shaders',
      //     href: '/shaders',
      //     Icon: CloudMoonIcon,
      //   },
      // ],
    },
    {
      title: 'Hosting',
      href: '/hosting',
      Icon: ServerIcon,
    },
    {
      title: 'Server List',
      href: '/serverlist',
      Icon: ServerIcon,
    },
  ] satisfies NavigationConfig;
}
