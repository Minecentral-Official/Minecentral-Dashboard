import { T_ServerDBData_Votifier } from '@/features/serverlist/types/t-server-db.type';

export default function DTOServer_Votifier({
  ip,
  enabled,
  port,
  publicKey,
  serverId,
}: T_ServerDBData_Votifier) {
  return {
    ip,
    enabled,
    port,
    publicKey,
    serverId,
  };
}
