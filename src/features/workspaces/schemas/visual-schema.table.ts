import { sql } from 'drizzle-orm';
import {
  boolean,
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

import { catalogProjectTable, userTable } from '@/lib/db/schema';

import type { VisualSchema } from '@/features/workspaces/schemas/visual-schema';

export const visualSchemaTable = pgTable(
  'visual_schema_release',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    key: text('key').notNull(),
    release: integer('release').notNull(),
    projectId: uuid('project_id').references(() => catalogProjectTable.id, {
      onDelete: 'restrict',
    }),
    definition: jsonb('definition').$type<VisualSchema>().notNull(),
    retired: boolean('retired').notNull().default(false),
    actorId: text('actor_id').references(() => userTable.id, {
      onDelete: 'set null',
    }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex('visual_schema_key_release_unique').on(
      table.key,
      table.release,
    ),
    index('visual_schema_project_idx').on(table.projectId),
    check('visual_schema_release_positive', sql`${table.release}>0`),
    check(
      'visual_schema_definition_size',
      sql`octet_length(${table.definition}::text)<=65536`,
    ),
  ],
);
