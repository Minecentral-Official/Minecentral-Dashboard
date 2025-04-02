import { pteroServerDTO } from '@/features/host/pterodactyl/dto/ptero-server.dto';
import { pteroServer } from '@/features/host/pterodactyl/ptero';
import { cacheLife } from '@/lib/cache/cache-exports';

export async function pterodactylGetServerById(pteroServerId: number) {
  'use cache';
  cacheLife('hours');
  const server = await pteroServer.getServer(pteroServerId);

  return pteroServerDTO(server);
}
