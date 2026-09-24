import type { SqlClient } from './migration-utils';

export async function listUsers(client: SqlClient) {
  const { rows } = await client.query(
    'SELECT id, name, email, role, banned FROM public."user" ORDER BY email, id',
  );
  return rows;
}

export async function makeAdmin(client: SqlClient, userId: string) {
  if (!userId.trim()) throw new Error('A user ID is required');
  const { rows } = await client.query(
    `UPDATE public."user" SET role = 'admin', "updatedAt" = CURRENT_TIMESTAMP
     WHERE id = $1 RETURNING id, name, email, role, banned`,
    [userId],
  );
  if (!rows.length) {
    throw new Error('User not found; run pnpm users:list to find the ID');
  }
  return rows[0];
}
