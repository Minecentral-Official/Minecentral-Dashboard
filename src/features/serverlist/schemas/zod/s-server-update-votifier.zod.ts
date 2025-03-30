import { z } from 'zod';

export const S_ServerUpdateVotifier = z.object({
  id: z.string(),
  publicKey: z.string(),
  ip: z.string(),
  port: z.number().max(65535, 'Max of 5 numbers'),
  enabled: z.boolean(),
});
