import { z } from 'zod';

export const S_ServerUpdateVotifier = z.object({
  id: z.string(),
  publicKey: z.string().optional(),
  ip: z.string().optional(),
  port: z.number().int().min(1).max(65535, 'Max of 5 numbers').optional(),
  enabled: z
    .union([z.boolean(), z.string()])
    .optional()
    .transform((val) => val === true || val === 'on' || val === 'true'),
  voteCooldownHours: z
    .number()
    .refine((val) => [8, 12, 16, 20, 24].includes(val), {
      message: 'Choose a valid cooldown',
    }),
});
