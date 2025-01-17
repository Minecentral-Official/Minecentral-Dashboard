import { NodeAllocation } from 'pterodactyl.ts';

export function pteroAllocationDTO(
  pteroAllocationData: Awaited<NodeAllocation | undefined>,
) {
  if (!pteroAllocationData) return undefined;
  const { id, ip, port, assigned } = pteroAllocationData;
  return {
    id,
    ip,
    port,
    assigned,
  };
}
