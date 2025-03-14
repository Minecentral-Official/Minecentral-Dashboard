import { C_PluginLoaders } from '@/features/resources/config/c-plugin-loaders.plugin';

export function pluginGetLoaderText(
  loader: (typeof C_PluginLoaders)[number],
): string {
  switch (loader) {
    case 'bungee-cord':
      return 'BungeeCord';
    default:
      return loader.charAt(0).toUpperCase() + loader.slice(1);
  }
}
