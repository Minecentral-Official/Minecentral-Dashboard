import { pteroServer } from '@/features/host/pterodactyl/ptero';

export async function hostADMINGetAllServers() {
  // const {user} = await validateSession();
  return await pteroServer.getServers();
}
