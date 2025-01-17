import { userGetPterodactylServerCount } from '@/features/host/pterodactyl/queries/get-server-count.user';

export default async function HostServerCount() {
  const serverCount = await userGetPterodactylServerCount();
  return <>{serverCount}</>;
}
