import {
  ArchiveIcon,
  BananaIcon,
  BanIcon,
  BugIcon,
  CarIcon,
  DicesIcon,
  DollarSignIcon,
  EarthIcon,
  FlameKindlingIcon,
  FootprintsIcon,
  GamepadIcon,
  InfinityIcon,
  LibraryIcon,
  PocketKnifeIcon,
  ServerIcon,
  SparklesIcon,
  SwordsIcon,
  TextIcon,
  UserIcon,
  WandIcon,
  ZapIcon,
} from 'lucide-react';

import { C_PluginCategories } from '@/features/resources/config/c-plugin-categories.config';

export function pluginGetCategoryIcon(
  category: (typeof C_PluginCategories)[number],
): React.ElementType {
  switch (category) {
    case 'admin':
      return UserIcon;
    case 'chat':
      return TextIcon;
    case 'cosmetic':
      return SparklesIcon;
    case 'economy':
      return DollarSignIcon;
    case 'gamemode':
      return GamepadIcon;
    case 'misc':
      return InfinityIcon;
    case 'proxy':
      return ServerIcon;
    case 'utility':
      return PocketKnifeIcon;
    case 'world':
      return EarthIcon;
    case 'adventure':
      return FlameKindlingIcon;
    case 'food':
      return BananaIcon;
    case 'magic':
      return WandIcon;
    case 'mobs':
      return FootprintsIcon;
    case 'minigame':
      return DicesIcon;
    case 'transport':
      return CarIcon;
    case 'equipment':
      return SwordsIcon;
    case 'cursed':
      return BugIcon;
    case 'library':
      return LibraryIcon;
    case 'storage':
      return ArchiveIcon;
    case 'optimization':
      return ZapIcon;
    default:
      return BanIcon;
  }
}
