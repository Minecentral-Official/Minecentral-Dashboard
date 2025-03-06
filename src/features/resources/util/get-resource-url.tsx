import { T_ResourceType } from '@/lib/types/t-resource-type.type';

export function getResourceUrl(type: T_ResourceType) {
  switch (type) {
    case 'mod':
      return 'mods';
    case 'data-pack':
      return 'datapacks';
    case 'mod-pack':
      return 'modpacks';
    case 'plugin':
      return 'plugins';
    case 'resource-pack':
      return 'resourcepacks';
    case 'shader':
      return 'shaders';
    default:
      return 'unknown';
  }
}
