import { sql } from 'drizzle-orm';
import {
  check,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

import { userTable } from '@/lib/auth/schema/auth.table';

import type {
  CatalogDependency,
  CatalogMetadata,
  CatalogSupport,
  Provider,
} from '@/features/catalog/schemas/catalog-input';
import type { AnyPgColumn } from 'drizzle-orm/pg-core';

export const catalogProjectTable = pgTable(
  'catalog_project',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    slug: text('slug').notNull(),
    name: text('name').notNull(),
    description: text('description').notNull(),
    metadata: jsonb('metadata').$type<CatalogMetadata>().notNull(),
    curated: jsonb('curated')
      .$type<Partial<CatalogMetadata>>()
      .notNull()
      .default({}),
    status: text('status', { enum: ['published', 'hidden', 'merged'] })
      .notNull()
      .default('published'),
    mergedIntoId: uuid('merged_into_id').references(
      (): AnyPgColumn => catalogProjectTable.id,
      { onDelete: 'restrict' },
    ),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index('catalog_project_name_idx').on(t.name, t.id),
    index('catalog_project_updated_idx').on(t.updatedAt, t.id),
    index('catalog_project_search_idx').using(
      'gin',
      sql`to_tsvector('simple', ${t.name} || ' ' || ${t.description})`,
    ),
    check(
      'catalog_project_status_check',
      sql`${t.status} IN ('published','hidden','merged')`,
    ),
  ],
);
export const catalogSourceTable = pgTable(
  'catalog_source',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    projectId: uuid('project_id')
      .notNull()
      .references(() => catalogProjectTable.id, { onDelete: 'restrict' }),
    provider: text('provider').$type<Provider>().notNull(),
    externalId: text('external_id').notNull(),
    locator: text('locator').notNull(),
    url: text('url').notNull(),
    metadata: jsonb('metadata').$type<CatalogMetadata>().notNull(),
    status: text('status', {
      enum: ['ok', 'pending', 'error', 'unavailable', 'manual'],
    }).notNull(),
    lastSyncedAt: timestamp('last_synced_at', { withTimezone: true }),
    lastAttemptAt: timestamp('last_attempt_at', { withTimezone: true }),
    nextSyncAt: timestamp('next_sync_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    failures: integer('failures').notNull().default(0),
    error: text('error'),
  },
  (t) => [
    uniqueIndex('catalog_source_identity_unique').on(t.provider, t.externalId),
    index('catalog_source_project_idx').on(t.projectId),
    index('catalog_source_due_idx').on(t.nextSyncAt),
    check(
      'catalog_source_provider_check',
      sql`${t.provider} IN ('modrinth','hangar','manual')`,
    ),
    check(
      'catalog_source_status_check',
      sql`${t.status} IN ('ok','pending','error','unavailable','manual')`,
    ),
  ],
);
export const catalogVersionTable = pgTable(
  'catalog_version',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    sourceId: uuid('source_id')
      .notNull()
      .references(() => catalogSourceTable.id, { onDelete: 'restrict' }),
    externalId: text('external_id').notNull(),
    name: text('name').notNull(),
    channel: text('channel').notNull(),
    publishedAt: timestamp('published_at', { withTimezone: true }).notNull(),
    url: text('url').notNull(),
    support: jsonb('support').$type<CatalogSupport[]>().notNull(),
    dependencies: jsonb('dependencies').$type<CatalogDependency[]>().notNull(),
    available: integer('available').notNull().default(1),
  },
  (t) => [
    uniqueIndex('catalog_version_identity_unique').on(t.sourceId, t.externalId),
    index('catalog_version_source_date_idx').on(t.sourceId, t.publishedAt),
    check('catalog_version_available_check', sql`${t.available} IN (0,1)`),
  ],
);
export const catalogJobTable = pgTable(
  'catalog_job',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    provider: text('provider').$type<Exclude<Provider, 'manual'>>().notNull(),
    locator: text('locator').notNull(),
    status: text('status', { enum: ['queued', 'running', 'done', 'failed'] })
      .notNull()
      .default('queued'),
    attempts: integer('attempts').notNull().default(0),
    nextAttemptAt: timestamp('next_attempt_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    startedAt: timestamp('started_at', { withTimezone: true }),
    finishedAt: timestamp('finished_at', { withTimezone: true }),
    error: text('error'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index('catalog_job_due_idx').on(t.status, t.nextAttemptAt),
    uniqueIndex('catalog_job_active_unique')
      .on(t.provider, t.locator)
      .where(sql`${t.status} IN ('queued','running')`),
    check(
      'catalog_job_provider_check',
      sql`${t.provider} IN ('modrinth','hangar')`,
    ),
    check(
      'catalog_job_status_check',
      sql`${t.status} IN ('queued','running','done','failed')`,
    ),
  ],
);
export const catalogAuditTable = pgTable(
  'catalog_audit',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    actorId: text('actor_id').references(() => userTable.id, {
      onDelete: 'set null',
    }),
    projectId: uuid('project_id').references(() => catalogProjectTable.id, {
      onDelete: 'restrict',
    }),
    event: text('event').notNull(),
    detail: jsonb('detail').$type<Record<string, unknown>>().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [index('catalog_audit_project_idx').on(t.projectId, t.createdAt)],
);
