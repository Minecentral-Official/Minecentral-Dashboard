import {
  TResourceSort,
  TResourceSortBy,
} from '@/features/resources/config/sort-by.config';

export default function sortStringToValue(value: string | null) {
  if (!value) return null;
  return (TResourceSort as readonly string[]).includes(value) ?
      (value as TResourceSortBy)
    : null;
}
