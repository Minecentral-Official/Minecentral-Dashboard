import { C_PluginCategories } from '@/features/resources/config/plugin-categories.config';

export type T_PluginCategories = typeof C_PluginCategories;
export type T_PluginCategory = T_PluginCategories[number];
