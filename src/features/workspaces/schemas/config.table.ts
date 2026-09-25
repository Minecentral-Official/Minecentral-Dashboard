import { sql } from 'drizzle-orm';
import {
  check,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

import {
  catalogProjectTable,
  stackEntryTable,
  userTable,
  workspaceTable,
} from '@/lib/db/schema';

import type { ConfigProfile } from '@/features/workspaces/schemas/config-input';

export const configFileTable = pgTable(
  'config_file',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    workspaceId: uuid('workspace_id')
      .notNull()
      .references(() => workspaceTable.id, { onDelete: 'restrict' }),
    entryId: uuid('entry_id').references(() => stackEntryTable.id, {
      onDelete: 'set null',
    }),
    projectId: uuid('project_id').references(() => catalogProjectTable.id, {
      onDelete: 'restrict',
    }),
    kind: text('kind').$type<'server' | 'plugin' | 'unlinked'>().notNull(),
    path: text('path').notNull(),
    format: text('format').notNull().default('yaml'),
    profile: text('profile').$type<ConfigProfile>().notNull().default('syntax'),
    currentRevision: integer('current_revision').notNull().default(1),
    source: text('source').$type<'upload' | 'paste'>().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    uniqueIndex('config_file_workspace_path_unique').on(t.workspaceId, t.path),
    index('config_file_entry_idx').on(t.entryId),
    check(
      'config_file_kind_valid',
      sql`${t.kind} IN ('server','plugin','unlinked')`,
    ),
    check('config_file_format_valid', sql`${t.format} = 'yaml'`),
    check(
      'config_file_profile_valid',
      sql`${t.profile} IN ('syntax','bukkit-basic')`,
    ),
    check('config_file_source_valid', sql`${t.source} IN ('upload','paste')`),
    check('config_file_revision_valid', sql`${t.currentRevision} > 0`),
    check(
      'config_file_link_valid',
      sql`(${t.kind} = 'plugin' AND ${t.projectId} IS NOT NULL) OR (${t.kind} IN ('server','unlinked') AND ${t.entryId} IS NULL AND ${t.projectId} IS NULL)`,
    ),
  ],
);
export const configRevisionTable = pgTable(
  'config_revision',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    configId: uuid('config_id')
      .notNull()
      .references(() => configFileTable.id, { onDelete: 'cascade' }),
    number: integer('number').notNull(),
    content: text('content').notNull(),
    contentHash: text('content_hash').notNull(),
    authorId: text('author_id').references(() => userTable.id, {
      onDelete: 'set null',
    }),
    source: text('source')
      .$type<'upload' | 'paste' | 'edit' | 'restore'>()
      .notNull(),
    message: text('message').notNull().default(''),
    restoredFrom: integer('restored_from'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    uniqueIndex('config_revision_number_unique').on(t.configId, t.number),
    check('config_revision_number_valid', sql`${t.number} > 0`),
    check(
      'config_revision_size_valid',
      sql`octet_length(${t.content}) BETWEEN 1 AND 131072`,
    ),
    check(
      'config_revision_source_valid',
      sql`${t.source} IN ('upload','paste','edit','restore')`,
    ),
  ],
);
