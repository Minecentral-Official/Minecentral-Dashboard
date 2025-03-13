'use client';

import { XCircleIcon, XIcon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { usePluginFilterContext } from '@/features/resources/context/plugin-filter.context';
import { pluginGetCategoryText } from '@/features/resources/util/plugin-category-text.get';
import { pluginGetLoaderText } from '@/features/resources/util/plugin-loader-text.get';
import { useUpdateSearchParams } from '@/hooks/use-update-search-params';

export default function PluginFilterBadges() {
  const { versions, categories, loaders } = usePluginFilterContext();
  const updateSearchParams = useUpdateSearchParams();

  function clearFilters() {
    updateSearchParams({ c: null, v: null, l: null });
  }

  return (
    <>
      {versions.length + categories.length + loaders.length > 1 && (
        <Badge onClick={clearFilters} className='pl-1 hover:cursor-pointer'>
          <XCircleIcon className='mr-1 h-4 w-4 hover:text-destructive' />
          Clear Filters
        </Badge>
      )}
      <VersionBadges />
      <CategoryBadges />
      <LoaderBadges />
    </>
  );
}

function VersionBadges() {
  const { versions, toggleVersions } = usePluginFilterContext();
  return (
    <>
      {versions.map((string) => (
        <Badge
          onClick={() => toggleVersions(string)}
          className='w-auto pl-1 hover:cursor-pointer'
          key={string}
        >
          <XIcon className='mr-1 h-4 w-4 hover:text-destructive' />
          {string}
        </Badge>
      ))}
    </>
  );
}

function CategoryBadges() {
  const { categories, toggleCategory } = usePluginFilterContext();
  return (
    <>
      {categories.map((string) => (
        <Badge
          onClick={() => toggleCategory(string)}
          className='w-auto pl-1 hover:cursor-pointer'
          key={string}
        >
          <XIcon className='mr-1 h-4 w-4 hover:text-destructive' />
          {pluginGetCategoryText(string)}
        </Badge>
      ))}
    </>
  );
}

function LoaderBadges() {
  const { loaders, toggleLoaders } = usePluginFilterContext();
  return (
    <>
      {loaders.map((string) => (
        <Badge
          onClick={() => toggleLoaders(string)}
          className='w-auto pl-1 hover:cursor-pointer'
          key={string}
        >
          <XIcon className='mr-1 h-4 w-4 hover:text-destructive' />
          {pluginGetLoaderText(string)}
        </Badge>
      ))}
    </>
  );
}
