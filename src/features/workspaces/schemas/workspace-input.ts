import { z } from 'zod';

// Deliberate metadata baseline, not a claim of plugin compatibility.
// Paper Java guidance: https://docs.papermc.io/paper/getting-started/
export const workspaceVersions = ['1.21.11', '1.21.4', '1.20.6'] as const;
export const workspaceInput = z
  .object({
    name: z.string().trim().min(1, 'Give your server a name.').max(80),
    description: z.string().trim().max(500).default(''),
    notes: z.string().trim().max(10000).default(''),
    platform: z.literal('paper', {
      errorMap: () => ({ message: 'This workspace beta supports Paper.' }),
    }),
    minecraftVersion: z.enum(workspaceVersions, {
      errorMap: () => ({ message: 'Choose a supported Minecraft version.' }),
    }),
    javaVersion: z.preprocess(
      (value) => (value === '' || value == null ? null : Number(value)),
      z.literal(21).nullable(),
    ),
    status: z.enum(['planning', 'active', 'paused']).default('planning'),
    visibility: z.enum(['private', 'team']).default('private'),
    connectionHost: z
      .string()
      .trim()
      .max(253)
      .regex(
        /^[a-zA-Z0-9.:[\]-]*$/,
        'Enter a hostname or IP address, without a URL or credentials.',
      )
      .default('')
      .transform((value) => value || null),
    connectionPort: z.preprocess(
      (value) => (value === '' || value == null ? null : Number(value)),
      z.number().int().min(1).max(65535).nullable(),
    ),
  })
  .superRefine((value, context) => {
    if (value.connectionPort && !value.connectionHost)
      context.addIssue({
        code: 'custom',
        path: ['connectionHost'],
        message: 'Enter a host before setting a port.',
      });
  });
export type WorkspaceInput = z.input<typeof workspaceInput>;
export const memberInput = z.object({
  email: z
    .string()
    .trim()
    .email()
    .max(254)
    .transform((value) => value.toLowerCase()),
  role: z.enum(['admin', 'editor', 'viewer']),
});
export const workspaceIdInput = z.string().uuid('Workspace not found.');
