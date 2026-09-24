import { z } from 'zod';

const id = z.string().uuid();
const target = z
  .string()
  .trim()
  .min(1)
  .max(80)
  .regex(/^[a-zA-Z0-9_.-]+$/);
const url = z
  .string()
  .url()
  .max(2048)
  .refine((s) => {
    const u = new URL(s);
    return u.protocol === 'https:' && !u.username && !u.password;
  }, 'Use an HTTPS evidence link without credentials.');
const dates = { observedAt: z.coerce.date(), expiresAt: z.coerce.date() };
const provenance = {
  provenance: z.string().trim().min(10).max(2000),
  url,
  ...dates,
};
export const compatibilityEvidenceInput = z.object({
  versionId: id,
  platform: target,
  minecraftVersion: target,
  kind: z.enum(['developer-declared', 'automated-test', 'manual-curation']),
  result: z.enum(['compatible', 'incompatible', 'unknown']),
  confidence: z.enum(['high', 'medium', 'low']),
  ...provenance,
});
export const compatibilityRelationshipInput = z.object({
  fromProjectId: id,
  toProjectId: id,
  fromVersionId: id.nullable(),
  toVersionId: id.nullable(),
  kind: z.enum(['required', 'optional', 'conflict', 'overlap']),
  versionRange: z.string().trim().max(150).nullable(),
  platform: target.nullable(),
  minecraftVersion: target.nullable(),
  ...provenance,
});
export const communityReportInput = z.object({
  versionId: id,
  platform: target,
  minecraftVersion: target,
  result: z.enum(['compatible', 'incompatible']),
  detail: z.string().trim().min(20).max(1000),
  consent: z.literal(true),
  observedAt: z.coerce.date(),
});
