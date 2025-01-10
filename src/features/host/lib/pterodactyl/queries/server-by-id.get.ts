import { pteroServerDTO } from '@/features/host/lib/pterodactyl/dto/ptero-server.dto';
import { pteroServer } from '@/features/host/lib/pterodactyl/ptero';

export async function pterodactylGetServerById(pteroServerId: number) {
  const server = await pteroServer.getServer(pteroServerId);

  return pteroServerDTO(server);
}
