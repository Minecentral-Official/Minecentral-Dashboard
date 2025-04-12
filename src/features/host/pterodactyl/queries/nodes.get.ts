import { pteroNodeDTO } from '@/features/host/pterodactyl/dto/ptero-node.dto';
import { pteroServer } from '@/features/host/pterodactyl/ptero';
import { cacheLife } from '@/lib/cache/cache-exports';

export async function pterodactylGetNodes() {
  'use cache';
  cacheLife('hours');
  try {
    const nodes = await pteroServer.getNodes();

    return nodes.map((node) => pteroNodeDTO(node));
  } catch {
    return null;
  }
}
