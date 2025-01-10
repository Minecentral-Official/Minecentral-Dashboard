import { pteroServerDTO } from '@/features/host/lib/pterodactyl/dto/ptero-server.dto';
import { pteroServer } from '@/features/host/lib/pterodactyl/ptero';

export async function pterodactylGetServerById(
  pteroServerId: number,
): Promise<ReturnType<typeof pteroServerDTO> | undefined> {
  const server = await pteroServer.getServer(pteroServerId);
  if (!server) return undefined;
  return await pteroServerDTO(server);
}
