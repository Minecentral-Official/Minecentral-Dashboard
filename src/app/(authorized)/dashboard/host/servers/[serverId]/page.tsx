import PterodactylServerCard from '@/features/host/components/cards/pterodactyl-server.card';
import { pterodactylGetFullServerData } from '@/features/host/lib/pterodactyl/queries/server-full.get';

type PageProps = {
  params: Promise<{ serverId: number }>;
};

export default async function Page({ params }: PageProps) {
  const { serverId } = await params;
  const {
    server: {
      limits: { cpu, memory, disk },
      id,
      name,
      feature_limits: { backups, databases, splits },
      uuid,
    },
    allocation: { ip, port },
    subscription: {
      stripe: { name: plan },
    },
  } = await pterodactylGetFullServerData({ pterodactylServerId: serverId });

  return (
    <PterodactylServerCard
      key={id}
      name={name}
      backups={backups}
      cpuThreads={cpu}
      databases={databases}
      storage={disk}
      ram={memory}
      splits={splits}
      ip={ip}
      port={port}
      id={id}
      uuid={uuid}
      plan={plan}
    />
  );
}
