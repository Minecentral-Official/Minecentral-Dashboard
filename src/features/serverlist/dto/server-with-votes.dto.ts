import DTOServer from '@/features/serverlist/dto/server-base.dto';
import { T_ServerDBData_WithVotes } from '@/features/serverlist/types/t-server-db.type';

export default function DTOServer_WithVotes({
  votes,
  ...rest
}: T_ServerDBData_WithVotes) {
  return {
    ...DTOServer(rest),
    votes,
  };
}
