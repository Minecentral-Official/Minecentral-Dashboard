import { C_ResourceSort } from '@/features/resources/config/resource-sort-by.config';

export type TResourceSortValues = typeof C_ResourceSort;
export type TResourceSortBy = TResourceSortValues[number];
