import { z } from 'zod';

export const signUpSchema = z
  .object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(8).max(32),
    confirmPassword: z.string(),
  })
  .refine(
    ({ password, confirmPassword }) => password === confirmPassword,
    'Passwords do not match',
  );
