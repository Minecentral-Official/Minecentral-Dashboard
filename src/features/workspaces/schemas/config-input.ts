import { z } from 'zod';

export const CONFIG_MAX_BYTES = 128 * 1024;
export const CONFIG_MAX_FILES = 50;
export const CONFIG_HISTORY_LIMIT = 20;
export const configId = z.string().uuid();
export const configProfile = z.enum(['syntax', 'bukkit-basic']);
export type ConfigProfile = z.infer<typeof configProfile>;
export const configPath = z
  .string()
  .trim()
  .min(1)
  .max(240)
  .refine(
    (path) =>
      /^[a-zA-Z0-9_./ -]+\.ya?ml$/i.test(path) &&
      path
        .split('/')
        .every(
          (part) =>
            part.length > 0 &&
            part !== '.' &&
            part !== '..' &&
            part.trim() === part,
        ) &&
      !path.startsWith('/') &&
      !path.includes('//'),
    'Use a relative .yml or .yaml path without traversal or special characters.',
  );
export const configMetadata = z.object({
  path: configPath,
  entryId: configId.nullable(),
  kind: z.enum(['server', 'plugin', 'unlinked']),
  profile: configProfile.default('syntax'),
});
export const configSaveInput = z.object({
  content: z.string().max(CONFIG_MAX_BYTES),
  expectedRevision: z.number().int().positive(),
  expectedSchemaId: z.string().uuid().nullable().optional(),
  message: z.string().trim().max(500).default(''),
});
export type ConfigDiagnostic = {
  severity: 'error' | 'warning';
  category: 'syntax' | 'schema' | 'limit';
  message: string;
  line?: number;
  column?: number;
};
export type ConfigFormState = {
  error?: string;
  message?: string;
  diagnostics?: ConfigDiagnostic[];
  revision?: number;
};
