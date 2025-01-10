import { pteroServer } from '@/features/host/lib/pterodactyl/ptero';

export async function pterodactylServerSuspend(pteroServerId: number) {
  const server = await pteroServer.getServer(pteroServerId);
  await server.suspend();
}
