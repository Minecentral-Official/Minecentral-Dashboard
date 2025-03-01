import { z } from 'zod';

export const projectUpdateLinksZod = z.object({
  id: z.string(),
  linkDiscord: z.string().url().optional(),
  linkDonation: z.string().url().optional(),
  linkIssues: z.string().url().optional(),
  linkSource: z.string().url().optional(),
  linkSupport: z.string().url().optional(),
});
