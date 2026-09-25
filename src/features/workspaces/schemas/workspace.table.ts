import { sql } from 'drizzle-orm';
import {
  check,
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

import { userTable } from '@/lib/auth/schema/auth.table';
import { identityColumns, lifecycleColumns } from '@/lib/db/columns';

export const workspaceTable = pgTable(
  'server_workspace',
  {
    ...identityColumns(),
    ownerId: text('owner_id')
      .notNull()
      .references(() => userTable.id, { onDelete: 'restrict' }),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    description: text('description').notNull().default(''),
    notes: text('notes').notNull().default(''),
    platform: text('platform').notNull().default('paper'),
    minecraftVersion: text('minecraft_version').notNull(),
    javaVersion: integer('java_version'),
    status: text('status', { enum: ['planning', 'active', 'paused'] })
      .notNull()
      .default('planning'),
    visibility: text('visibility', { enum: ['private', 'team'] })
      .notNull()
      .default('private'),
    connectionHost: text('connection_host'),
    connectionPort: integer('connection_port'),
    ...lifecycleColumns(),
  },
  (table) => [
    uniqueIndex('server_workspace_owner_slug_unique').on(
      table.ownerId,
      table.slug,
    ),
    index('server_workspace_owner_activity_idx').on(
      table.ownerId,
      table.archivedAt,
      table.updatedAt,
    ),
    check(
      'server_workspace_name_length',
      sql`length(trim(${table.name})) BETWEEN 1 AND 80`,
    ),
    check(
      'server_workspace_slug_format',
      sql`${table.slug} ~ '^[a-z0-9]+(-[a-z0-9]+)*$'`,
    ),
    check(
      'server_workspace_status_valid',
      sql`${table.status} IN ('planning', 'active', 'paused')`,
    ),
    check(
      'server_workspace_visibility_valid',
      sql`${table.visibility} IN ('private', 'team')`,
    ),
    check('server_workspace_platform_valid', sql`${table.platform} = 'paper'`),
    check(
      'server_workspace_version_valid',
      sql`${table.minecraftVersion} IN ('1.20.6', '1.21.4', '1.21.11')`,
    ),
    check(
      'server_workspace_java_valid',
      sql`${table.javaVersion} IS NULL OR ${table.javaVersion} = 21`,
    ),
    check(
      'server_workspace_port_valid',
      sql`${table.connectionPort} IS NULL OR (${table.connectionHost} IS NOT NULL AND ${table.connectionPort} BETWEEN 1 AND 65535)`,
    ),
  ],
);

export const workspaceMemberTable = pgTable(
  'workspace_member',
  {
    workspaceId: uuid('workspace_id')
      .notNull()
      .references(() => workspaceTable.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => userTable.id, { onDelete: 'cascade' }),
    role: text('role', { enum: ['admin', 'editor', 'viewer'] }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.workspaceId, table.userId] }),
    index('workspace_member_user_idx').on(table.userId, table.workspaceId),
    check(
      'workspace_member_role_valid',
      sql`${table.role} IN ('admin', 'editor', 'viewer')`,
    ),
  ],
);

export const workspaceActivityTable = pgTable(
  'workspace_activity',
  {
    ...identityColumns(),
    workspaceId: uuid('workspace_id')
      .notNull()
      .references(() => workspaceTable.id, { onDelete: 'cascade' }),
    actorId: text('actor_id').references(() => userTable.id, {
      onDelete: 'set null',
    }),
    event: text('event').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index('workspace_activity_recent_idx').on(
      table.workspaceId,
      table.createdAt,
    ),
  ],
);

export type Workspace = typeof workspaceTable.$inferSelect;
