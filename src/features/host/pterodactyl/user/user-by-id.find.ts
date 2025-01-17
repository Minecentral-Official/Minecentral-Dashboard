import { PanelUser } from 'pterodactyl.ts';

import { pteroServer } from '@/features/host/pterodactyl/ptero';

export async function pterodactylUserFindById(
  user_id: number,
): Promise<PanelUser> {
  return await pteroServer.getUser(user_id);
}
