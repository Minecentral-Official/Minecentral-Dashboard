import { z } from 'zod';

import { C_ServerAccessTypes } from '@/features/serverlist/config/c-server-access-type.config';
import { C_ServerCategories } from '@/features/serverlist/config/c-server-categories.config';
import { C_ServerEditions } from '@/features/serverlist/config/c-server-editions.config';
import { C_ServerLoaders } from '@/features/serverlist/config/c-server-loaders.config';
import { isSlug } from '@/lib/utils/slugify';

const optionalUrl = z
  .string()
  .url('Please provide a valid URL')
  .or(z.literal(''))
  .optional()
  .transform((val) => (val ? val : undefined));

const commaSeparatedList = z
  .string()
  .optional()
  .transform((value) =>
    value ?
      value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    : undefined,
  );

export const S_ServerUpdateGeneral = z.object({
  id: z.string(),
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(50, 'Max characters 50'),
  slug: z
    .string()
    .max(120, `Please provide a memorizable url slug`)
    .min(3, 'Something a little longer')
    .transform((val) => {
      return val.toLowerCase();
    })
    .refine((val) => isSlug(val), {
      message:
        'Invalid slug format. Slug must contain only lowercase letters, numbers, and hyphens.',
    }),
  ip: z.string().min(1, 'Server address is required'),
  port: z.number().int().min(1).max(65535, 'Max of 5 numbers'),
  description: z
    .string()
    .max(220, 'Keep the short description under 220 characters')
    .optional(),
  categories: z.array(z.enum(C_ServerCategories)).optional(),
  platforms: z.array(z.enum(C_ServerLoaders)).optional(),
  versions: commaSeparatedList,
  editions: z.array(z.enum(C_ServerEditions)).optional(),
  region: z
    .string()
    .max(80, 'Keep the region under 80 characters')
    .or(z.literal(''))
    .optional()
    .transform((val) => (val ? val : undefined)),
  accessType: z
    .enum(C_ServerAccessTypes)
    .or(z.literal(''))
    .optional()
    .transform((val) => (val ? val : undefined)),
  linkDiscord: optionalUrl,
  websiteUrl: optionalUrl,
  storeUrl: optionalUrl,
  mapUrl: optionalUrl,
  modpackUrl: optionalUrl,
  deletingIcon: z.string().transform((val) => val === 'true'),
});
