import { z } from 'zod';

import { isSlug } from '@/lib/utils/slugify';

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
  deletingIcon: z.string().transform((val) => val === 'true'),
});
