import DTOServer_WithVotes from '@/features/serverlist/dto/server-with-votes.dto';
import {
  T_ServerDBData_Votifier,
  T_ServerDBData_WithVotes,
} from '@/features/serverlist/types/t-server-db.type';

export default function DTOServer_WithVotifier({
  votifier,
  ...rest
}: T_ServerDBData_WithVotes & { votifier?: T_ServerDBData_Votifier }) {
  return {
    ...DTOServer_WithVotes(rest),
    votifier:
      votifier ?
        {
          enabled: votifier.enabled,
        }
      : undefined,
  };
}
