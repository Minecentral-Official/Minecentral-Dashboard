import { sql } from 'drizzle-orm';
import {
  bigint,
  check,
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

import {
  catalogProjectTable,
  catalogVersionTable,
  userTable,
  workspaceTable,
} from '@/lib/db/schema';

import type {
  CompatibilityReport,
  EvidenceKind,
} from '@/features/workspaces/schemas/compatibility-types';

export const compatibilityEvidenceTable = pgTable(
  'compatibility_evidence',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    versionId: uuid('version_id')
      .notNull()
      .references(() => catalogVersionTable.id, { onDelete: 'restrict' }),
    platform: text('platform').notNull(),
    minecraftVersion: text('minecraft_version').notNull(),
    kind: text('kind').$type<EvidenceKind>().notNull(),
    result: text('result', {
      enum: ['compatible', 'incompatible', 'unknown'],
    }).notNull(),
    confidence: text('confidence', {
      enum: ['high', 'medium', 'low'],
    }).notNull(),
    provenance: text('provenance').notNull(),
    url: text('url').notNull(),
    observedAt: timestamp('observed_at', { withTimezone: true }).notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    actorId: text('actor_id')
      .notNull()
      .references(() => userTable.id, { onDelete: 'restrict' }),
    revokedAt: timestamp('revoked_at', { withTimezone: true }),
  },
  (t) => [
    index('compatibility_evidence_target_idx').on(
      t.versionId,
      t.platform,
      t.minecraftVersion,
    ),
    check(
      'compatibility_evidence_result_valid',
      sql`${t.result} IN ('compatible','incompatible','unknown')`,
    ),
    check(
      'compatibility_evidence_kind_valid',
      sql`${t.kind} IN ('developer-declared','source-metadata','community-tested','automated-test','manual-curation')`,
    ),
    check(
      'compatibility_evidence_dates_valid',
      sql`${t.expiresAt} > ${t.observedAt}`,
    ),
  ],
);

export const compatibilityRelationshipTable = pgTable(
  'compatibility_relationship',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    fromProjectId: uuid('from_project_id')
      .notNull()
      .references(() => catalogProjectTable.id, { onDelete: 'restrict' }),
    toProjectId: uuid('to_project_id')
      .notNull()
      .references(() => catalogProjectTable.id, { onDelete: 'restrict' }),
    fromVersionId: uuid('from_version_id').references(
      () => catalogVersionTable.id,
      { onDelete: 'restrict' },
    ),
    toVersionId: uuid('to_version_id').references(
      () => catalogVersionTable.id,
      { onDelete: 'restrict' },
    ),
    kind: text('kind', {
      enum: ['required', 'optional', 'conflict', 'overlap'],
    }).notNull(),
    versionRange: text('version_range'),
    platform: text('platform'),
    minecraftVersion: text('minecraft_version'),
    provenance: text('provenance').notNull(),
    url: text('url').notNull(),
    observedAt: timestamp('observed_at', { withTimezone: true }).notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    actorId: text('actor_id')
      .notNull()
      .references(() => userTable.id, { onDelete: 'restrict' }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    revokedAt: timestamp('revoked_at', { withTimezone: true }),
  },
  (t) => [
    index('compatibility_relationship_from_idx').on(t.fromProjectId),
    check(
      'compatibility_relationship_kind_valid',
      sql`${t.kind} IN ('required','optional','conflict','overlap')`,
    ),
    check(
      'compatibility_relationship_dates_valid',
      sql`${t.expiresAt} > ${t.observedAt}`,
    ),
  ],
);

export const compatibilityCommunityTable = pgTable(
  'compatibility_community_report',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => userTable.id, { onDelete: 'cascade' }),
    versionId: uuid('version_id')
      .notNull()
      .references(() => catalogVersionTable.id, { onDelete: 'restrict' }),
    platform: text('platform').notNull(),
    minecraftVersion: text('minecraft_version').notNull(),
    result: text('result', { enum: ['compatible', 'incompatible'] }).notNull(),
    detail: text('detail').notNull(),
    submittedAt: timestamp('submitted_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    consentedAt: timestamp('consented_at', { withTimezone: true }).notNull(),
    observedAt: timestamp('observed_at', { withTimezone: true }).notNull(),
    status: text('status', {
      enum: ['pending', 'approved', 'rejected', 'withdrawn'],
    })
      .notNull()
      .default('pending'),
    reviewerId: text('reviewer_id').references(() => userTable.id, {
      onDelete: 'set null',
    }),
    reviewReason: text('review_reason'),
    reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
  },
  (t) => [
    uniqueIndex('compatibility_community_report_unique').on(
      t.userId,
      t.versionId,
      t.platform,
      t.minecraftVersion,
    ),
    index('compatibility_community_review_idx').on(t.status, t.observedAt),
    check(
      'compatibility_community_result_valid',
      sql`${t.result} IN ('compatible','incompatible')`,
    ),
    check(
      'compatibility_community_status_valid',
      sql`${t.status} IN ('pending','approved','rejected','withdrawn')`,
    ),
  ],
);

export const compatibilityRevisionTable = pgTable('compatibility_revision', {
  scope: text('scope').primaryKey(),
  revision: bigint('revision', { mode: 'number' }).notNull().default(1),
});
export const compatibilityCacheTable = pgTable('compatibility_cache', {
  workspaceId: uuid('workspace_id')
    .primaryKey()
    .references(() => workspaceTable.id, { onDelete: 'cascade' }),
  fingerprint: text('fingerprint').notNull(),
  report: jsonb('report').$type<CompatibilityReport>(),
  computedAt: timestamp('computed_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  error: text('error'),
});
