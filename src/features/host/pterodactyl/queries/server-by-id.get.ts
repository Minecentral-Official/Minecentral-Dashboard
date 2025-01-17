import { pteroServerDTO } from '@/features/host/pterodactyl/dto/ptero-server.dto';
import { pteroServer } from '@/features/host/pterodactyl/ptero';

export async function pterodactylGetServerById(pteroServerId: number) {
  const server = await pteroServer.getServer(pteroServerId);

  return pteroServerDTO(server);
}
