import { z } from 'zod';

import { C_ServerCategories } from '@/features/serverlist/config/c-server-categories.config';
import { C_ServerLoaders } from '@/features/serverlist/config/c-server-loaders.config';

const commaArray = <T extends readonly [string, ...string[]]>(values: T) =>
  z
    .preprocess((value) => {
      if (!value || typeof value !== 'string') return undefined;
      return value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
    }, z.array(z.enum(values as unknown as [T[number], ...T[number][]])).optional())
    .catch(undefined);

export const C_ServerSort = ['updated', 'top', 'newest'] as const;

export const S_ServerListFilter = z.object({
  query: z.string().optional().catch(undefined),
  categories: commaArray(C_ServerCategories),
  platforms: commaArray(C_ServerLoaders),
  sort: z.enum(C_ServerSort).default('updated').catch('updated'),
  page: z
    .preprocess((value) => parseInt(value as string, 10), z.number().positive())
    .catch(1),
  limit: z
    .preprocess((value) => parseInt(value as string, 10), z.number())
    .transform((value) => ([16, 32, 48].includes(value) ? value : 16))
    .catch(16),
});

export type T_ServerListFilter = z.infer<typeof S_ServerListFilter>;
