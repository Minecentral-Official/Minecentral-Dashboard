import { T_PluginCategory } from '@/features/resources/types/t-plugin-category.type';
import { T_ResourceType } from '@/features/resources/types/t-resource-type.type';
import { TPluginVersion } from '@/features/resources/types/t-resource-version-support.type';

export type T_ResourceFilterRequest = {
  query?: string;
  page: number;
  limit: number;
  categories?: T_PluginCategory[];
  versions?: TPluginVersion[];
  type: T_ResourceType;
};

export type T_ResourceSimpleRequest = {
  page: number;
  limit: number;
  type?: T_ResourceType;
};
