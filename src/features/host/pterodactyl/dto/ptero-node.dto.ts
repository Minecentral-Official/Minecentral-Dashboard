import { PanelNode } from 'pterodactyl.ts';

export function pteroNodeDTO(pteroNodeData: Awaited<PanelNode>) {
  const {
    id,
    name,
    memory,
    disk,
    allocated_resources,
    location_id,
    maintenance_mode,
    allocations,
    created_at,
    description,
    uuid,
    public: isPublic,
  } = pteroNodeData;

  const nodeAllocation = allocations?.map(({ id, ip, port, assigned }) => {
    return { id, ip, port, assigned };
  });

  return {
    id,
    name,
    memory,
    disk,
    allocated_resources,
    location_id,
    maintenance_mode,
    allocations: nodeAllocation,
    created_at,
    description,
    uuid,
    isPublic,
  };
}
