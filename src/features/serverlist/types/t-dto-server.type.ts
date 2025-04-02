import DTOServer from '@/features/serverlist/dto/server-base.dto';
import DTOServer_WithVotes from '@/features/serverlist/dto/server-with-votes.dto';
import DTOServer_Votifier from '@/features/serverlist/dto/votifier.dto';

export type T_DTOServer = ReturnType<typeof DTOServer>;

export type T_DTOServer_Votifier = ReturnType<typeof DTOServer_Votifier>;

export type T_DTOServer_Votes = ReturnType<typeof DTOServer_WithVotes>;
