import { PanelUser } from 'pterodactyl.ts';

import { pteroServer } from '@/features/host/pterodactyl/ptero';

export async function pterodactylUserFindByServerId(
  server_id: number,
): Promise<PanelUser> {
  const server = await pteroServer.getServer(server_id);
  return await pteroServer.getUser(server.user);
}
