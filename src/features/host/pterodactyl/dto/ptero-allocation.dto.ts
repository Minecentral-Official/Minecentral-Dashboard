import { NodeAllocation } from 'pterodactyl.ts';

export function pteroAllocationDTO(
  pteroAllocationData: Awaited<NodeAllocation>,
) {
  const { ip, port } = pteroAllocationData;
  return {
    ip,
    port,
  };
}
