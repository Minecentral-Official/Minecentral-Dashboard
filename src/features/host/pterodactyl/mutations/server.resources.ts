import { pteroServer } from '@/features/host/pterodactyl/ptero';

export async function pterodactylServerGetResources() {
  const server = pteroServer.getUser(1);
  console.log(server);
}
