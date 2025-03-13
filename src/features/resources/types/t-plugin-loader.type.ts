import { C_PluginLoaders } from '@/features/resources/config/c-loaders.plugin';

export type T_PluginLoaders = typeof C_PluginLoaders;
export type T_PluginLoader = T_PluginLoaders[number];
