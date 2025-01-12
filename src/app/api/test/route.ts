import { pterodactylClientGetServerStatus } from '@/features/host/lib/pterodactyl/client/server-status.get';

export async function GET() {
  await pterodactylClientGetServerStatus('23');
  // return Response.json(JSON.stringify(data));
}
