import { pteroClient } from '@/features/host/pterodactyl/ptero';

/**@deprecated */
export async function pterodactylClientGetServerStatus(pteroServerId: string) {
  const server = await pteroClient.getServer(pteroServerId);
  //   const status = await server.getStatus();
  const data = await server.getStatus();
  return data;
}
