import { pterodactylServerGetResources } from '@/features/host/lib/pterodactyl/mutations/server.resources';

export async function GET() {
  await pterodactylServerGetResources(0);
  return new Response();
}
