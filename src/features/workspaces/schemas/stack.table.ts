import { sql } from 'drizzle-orm';
import {
  boolean,
  check,
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

import { workspaceTable } from '@/features/workspaces/schemas/workspace.table';
import { catalogProjectTable, catalogVersionTable } from '@/lib/db/schema';

export const stackEntryTable = pgTable(
  'stack_entry',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    workspaceId: uuid('workspace_id')
      .notNull()
      .references(() => workspaceTable.id, { onDelete: 'restrict' }),
    projectId: uuid('project_id')
      .notNull()
      .references(() => catalogProjectTable.id, { onDelete: 'restrict' }),
    versionId: uuid('version_id').references(() => catalogVersionTable.id, {
      onDelete: 'restrict',
    }),
    manualVersion: text('manual_version'),
    versionSource: text('version_source', {
      enum: ['unknown', 'manual', 'catalog'],
    })
      .notNull()
      .default('unknown'),
    addedVia: text('added_via', { enum: ['catalog', 'import'] }).notNull(),
    alias: text('alias').notNull().default(''),
    notes: text('notes').notNull().default(''),
    enabled: boolean('enabled').notNull().default(true),
    versionChangedAt: timestamp('version_changed_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    uniqueIndex('stack_entry_workspace_project_unique').on(
      t.workspaceId,
      t.projectId,
    ),
    index('stack_entry_project_idx').on(t.projectId),
    check(
      'stack_entry_version_consistent',
      sql`(${t.versionSource} = 'unknown' AND ${t.versionId} IS NULL AND ${t.manualVersion} IS NULL) OR (${t.versionSource} = 'manual' AND ${t.versionId} IS NULL AND ${t.manualVersion} IS NOT NULL AND length(trim(${t.manualVersion})) BETWEEN 1 AND 150) OR (${t.versionSource} = 'catalog' AND ${t.versionId} IS NOT NULL AND ${t.manualVersion} IS NULL)`,
    ),
    check(
      'stack_entry_added_via_valid',
      sql`${t.addedVia} IN ('catalog','import')`,
    ),
  ],
);

// Transactional outbox for the compatibility engine. Removal events retain entry IDs.
export const stackChangeTable = pgTable(
  'stack_change',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    workspaceId: uuid('workspace_id')
      .notNull()
      .references(() => workspaceTable.id, { onDelete: 'cascade' }),
    entryId: uuid('entry_id').notNull(),
    event: text('event', {
      enum: ['added', 'version', 'metadata', 'removed', 'project_merged'],
    }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    processedAt: timestamp('processed_at', { withTimezone: true }),
  },
  (t) => [index('stack_change_pending_idx').on(t.processedAt, t.createdAt)],
);
