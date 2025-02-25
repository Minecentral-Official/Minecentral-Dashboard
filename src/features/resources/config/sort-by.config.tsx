export const TResourceSort = [
  'relevance',
  'downloads',
  'date_updated',
  'date_published',
] as const;

export type TResourceSortValues = typeof TResourceSort;
export type TResourceSortBy = TResourceSortValues[number];
