import { T_DTOServer } from '@/features/serverlist/types/t-dto-server.type';
import { serverTable } from '@/lib/db/schema';

type ServerLike = Pick<
  typeof serverTable.$inferSelect,
  | 'title'
  | 'slug'
  | 'ip'
  | 'port'
  | 'description'
  | 'categories'
  | 'platforms'
  | 'iconUrl'
>;

export function serverMissingRequiredFields(server: ServerLike) {
  const missing: string[] = [];

  if (!server.title) missing.push('Server name');
  if (!server.slug) missing.push('URL slug');
  if (!server.ip) missing.push('Server address');
  if (!server.port) missing.push('Port');
  if (!server.description?.trim()) missing.push('Short description');
  if (!server.categories || server.categories.length === 0)
    missing.push('Category');
  if (!server.platforms || server.platforms.length === 0)
    missing.push('Platform');
  if (!server.iconUrl) missing.push('Banner');

  return missing;
}

export function serverIsPublicReady(server: ServerLike | T_DTOServer) {
  return serverMissingRequiredFields(server as ServerLike).length === 0;
}
