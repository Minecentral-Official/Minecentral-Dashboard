import { C_ResourceSort } from '@/features/resources/config/resource-sort-by.config';
import { TResourceSortBy } from '@/features/resources/types/t-resource-type.type';

export default function sortStringToValue(value: string | null) {
  if (!value) return null;
  return (C_ResourceSort as readonly string[]).includes(value) ?
      (value as TResourceSortBy)
    : null;
}
