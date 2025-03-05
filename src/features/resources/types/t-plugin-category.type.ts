import { C_CategoriesPlugin } from '@/features/resources/config/plugin-categories.config';

export type T_PluginCategories = typeof C_CategoriesPlugin;
export type T_PluginCategory = T_PluginCategories[number];
