import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
import { afterAll, beforeAll, expect, it, vi } from 'vitest';

import ticketChangeStatus from '@/features/tickets/mutations/change-status.ticket';
import ticketCreateMessage from '@/features/tickets/mutations/ticket-message.create';
import * as database from '@/lib/db';
import * as schema from '@/lib/db/schema';

import { applyMigrations } from '../../scripts/migration-utils';

const state = vi.hoisted(() => ({ actor: { id: 'outsider', role: 'user' } }));
vi.mock('@/lib/db', async () => {
  const { PGlite } = await import('@electric-sql/pglite');
  const { drizzle } = await import('drizzle-orm/pglite');
  const schema = await import('@/lib/db/schema');
  const client = new PGlite();
  return { db: drizzle(client, { schema, casing: 'camelCase' }), client };
});
vi.mock('@/lib/auth/helpers/validate-session', () => ({
  default: async () => ({ user: state.actor }),
}));
vi.mock('@/lib/cache/invalidate-tag', () => ({ invalidateTag: vi.fn() }));

const { db, client } = database as unknown as {
  db: ReturnType<typeof drizzle<typeof schema>>;
  client: PGlite;
};
let ticketId: number;
beforeAll(async () => {
  await applyMigrations(client);
  for (const id of ['owner', 'outsider', 'moderator']) {
    await db
      .insert(schema.userTable)
      .values({
        id,
        name: id,
        email: `${id}@example.test`,
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
  }
  const [ticket] = await db
    .insert(schema.ticket)
    .values({ userId: 'owner', title: 'Private request', category: 'general' })
    .returning();
  ticketId = ticket.id;
});
afterAll(async () => {
  await client.close();
});
function form(values: Record<string, string>) {
  const data = new FormData();
  Object.entries(values).forEach(([key, value]) => data.set(key, value));
  return data;
}
it('rejects another user’s reply and status change without writes', async () => {
  await expect(
    ticketCreateMessage(
      null,
      form({ ticketId: String(ticketId), message: 'Unauthorized message' }),
    ),
  ).rejects.toThrow('Forbidden');
  await expect(
    ticketChangeStatus(null, form({ id: String(ticketId), status: 'closed' })),
  ).rejects.toThrow('Forbidden');
  expect(await db.select().from(schema.ticketMessage)).toHaveLength(0);
  expect((await db.select().from(schema.ticket))[0].status).toBe('open');
});
it('allows the owner to reply and a moderator to handle the request', async () => {
  state.actor = { id: 'owner', role: 'user' };
  await ticketCreateMessage(
    null,
    form({ ticketId: String(ticketId), message: 'Owner reply' }),
  );
  state.actor = { id: 'moderator', role: 'moderator' };
  await ticketCreateMessage(
    null,
    form({ ticketId: String(ticketId), message: 'Support reply' }),
  );
  expect((await db.select().from(schema.ticket))[0].status).toBe('in-progress');
  await ticketChangeStatus(
    null,
    form({ id: String(ticketId), status: 'closed' }),
  );
  expect(await db.select().from(schema.ticketMessage)).toHaveLength(2);
  expect((await db.select().from(schema.ticket))[0].status).toBe('closed');
});
