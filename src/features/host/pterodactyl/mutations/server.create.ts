import {
  NodeAllocation,
  PanelServer,
  PanelUser,
  ServerBuilder,
} from 'pterodactyl.ts';

import { pterodactylFindAvailableNode } from '@/features/host/pterodactyl/node/available-node.find';
import { pteroServer } from '@/features/host/pterodactyl/ptero';
import { TUserSelect } from '@/lib/db/schema';
import { serverEnv } from '@/lib/env/server.env';
import { MetadataHostType } from '@/lib/stripe/schemas/host-metadata.zod';

export async function pterodactylServerCreate(
  user: TUserSelect,
  pteroUser: PanelUser,
  plan: MetadataHostType,
): Promise<PanelServer | null> {
  const availableNodes = await pterodactylFindAvailableNode(
    checkMinimum(plan.ram, 1),
  );
  if (!availableNodes || availableNodes.length <= 0)
    throw new Error('No nodes available for purchase!');
  const node = await pteroServer.getNode(availableNodes[0]).catch(() => null);
  if (!node) throw new Error('Error when grabbing node data!');
  // Node is not null here
  const availableAllocations = (await node.getAllocations())
    .map((v) => v)
    .filter((allocation) => allocation.assigned === false)
    .slice(0, Number(plan.allocations) + 1);

  const defaultAllocation = availableAllocations[0];
  const additionalAllocations: NodeAllocation[] = availableAllocations.slice(
    1,
    Number(plan.allocations) + 1,
  );
  const serverBuilder = new ServerBuilder();
  //Basic
  serverBuilder.setName(`${user.name}'s server`);
  serverBuilder.setOwnerId(pteroUser.id);
  serverBuilder.setEggId(1);
  //Limits
  serverBuilder.setMemoryLimit(checkMinimum(plan.ram, 1) * 1024);
  serverBuilder.setSwapLimit(1 * 1024);
  serverBuilder.setDiskLimit(checkMinimum(plan.disk, 10) * 1024);
  serverBuilder.setIoLimit(200);
  serverBuilder.setCpuLimit(checkMinimum(plan.cpu, 1) * 100);
  //Feature Limits
  serverBuilder.setDatabaseLimit(checkMinimum(plan.databases, 1));
  serverBuilder.setBackupLimit(checkMinimum(plan.backups, 0));
  serverBuilder.setAllocationLimit(checkMinimum(plan.allocations, 1));
  serverBuilder.setCustomLimit('splits', checkMinimum(plan.splits, 0));
  //Allocation
  serverBuilder.setAllocation(defaultAllocation);
  serverBuilder.setAdditionalAllocations(additionalAllocations);
  //Start
  serverBuilder.startServerWhenInstalled(true);
  serverBuilder.setDockerImage('ghcr.io/pterodactyl/yolks:java_21');
  serverBuilder.setStartup(
    'java -Xms$(({{SERVER_MEMORY}}-512))M -Xmx{{SERVER_MEMORY}}M -XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 -XX:+UnlockExperimentalVMOptions -XX:+DisableExplicitGC -XX:G1NewSizePercent=30 -XX:G1MaxNewSizePercent=40 -XX:G1HeapRegionSize=8M -XX:G1ReservePercent=20 -XX:G1HeapWastePercent=5 -XX:G1MixedGCCountTarget=4 -XX:InitiatingHeapOccupancyPercent=15 -XX:G1MixedGCLiveThresholdPercent=90 -XX:G1RSetUpdatingPauseTimePercent=5 -XX:SurvivorRatio=32 -XX:+PerfDisableSharedMem -XX:MaxTenuringThreshold=1 --add-modules=jdk.incubator.vector -jar {{SERVER_JARFILE}} --nogui',
  );
  serverBuilder.addEnvironmentVariable('VANILLA_VERSION', '1.21');
  serverBuilder.addEnvironmentVariable('SERVER_JARFILE', 'server.jar');

  //Only create servers if CREATE_PTERO_SERVER in .env is enabled
  if (serverEnv.HOST_PTERO_SERVER_CREATE) {
    return await pteroServer.createServer(serverBuilder);
  }
  return null;
}

//Checks that values are atleast a safe default minimum value
function checkMinimum(value: number, defaultValue: number): number {
  return value < defaultValue ? defaultValue : value;
}
