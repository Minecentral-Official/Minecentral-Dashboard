import { pteroServer } from '@/features/host/pterodactyl/ptero';

export async function hostADMINGetAllServers() {
  // const {user} = await validateSession();
  try {
    return await pteroServer.getServers();
  } catch {
    return null;
  }
}
