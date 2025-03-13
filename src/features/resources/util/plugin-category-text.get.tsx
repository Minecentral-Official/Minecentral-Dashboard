import { C_PluginCategories } from '@/features/resources/config/plugin-categories.config';

export function pluginGetCategoryText(
  category: (typeof C_PluginCategories)[number],
): string {
  switch (category) {
    case 'misc':
      return 'Miscellaneous';
    case 'utility':
      return 'Tools & Utility';
    default:
      return category.charAt(0).toUpperCase() + category.slice(1);
  }
}
