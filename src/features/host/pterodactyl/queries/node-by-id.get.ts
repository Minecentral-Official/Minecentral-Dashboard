import { pteroNodeDTO } from '@/features/host/pterodactyl/dto/ptero-node.dto';
import { pteroServer } from '@/features/host/pterodactyl/ptero';
import { cacheLife } from '@/lib/cache/cache-exports';

export async function pterodactylGetNodeById(nodeId: number) {
  'use cache';
  cacheLife('hours');
  const node = await pteroServer.getNode(nodeId);

  return pteroNodeDTO(node);
}
