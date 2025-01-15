import { pteroServer } from '@/features/host/lib/pterodactyl/ptero';

export async function hostADMINGetAllServers() {
  // const {user} = await validateSession();
  return await pteroServer.getServers();
}
