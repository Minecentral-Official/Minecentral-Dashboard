import { pteroServer } from '@/features/host/pterodactyl/ptero';

export async function pterodactylServerSuspend(pteroServerId: number) {
  const server = await pteroServer.getServer(pteroServerId);
  await server.suspend();
}
