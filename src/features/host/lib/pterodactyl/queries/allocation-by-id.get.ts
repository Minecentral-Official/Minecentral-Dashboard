import { pteroServer } from '@/features/host/lib/pterodactyl/ptero';

export async function pterodactylGetAllocationById(
  nodeId: number,
  allocationId: number,
) {
  const allocations = await (
    await pteroServer.getNode(nodeId)
  ).getAllocations();
  const allocation = allocations.find(
    (allocation) => allocation.id === allocationId,
  );
  return allocation;
}
