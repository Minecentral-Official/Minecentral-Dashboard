import { PanelServer } from 'pterodactyl.ts';

import { pteroServer } from '@/features/host/lib/pterodactyl/ptero';

export async function pterodactylFindAvailableNode(
  memoryNeeded: number,
): Promise<number[] | null> {
  const availableNodes = [];
  try {
    const nodes = await pteroServer.getNodes();

    //   if (nodesFilter)
    //     nodes = nodes.filter((node) => nodesFilter.includes(node.id));

    //Roll through each node
    for (const node of nodes) {
      //Find all servers inside node
      const servers = (await pteroServer.getServers()).filter(
        (server: PanelServer) => server.node === node.id,
      );

      //Get the total used memory on this server right now
      const usedMemory = servers.reduce(
        (acc, server) => acc + server.limits.memory,
        0,
      );

      //Does this server have enough memory for this customer?
      if (process.env.NODE_ENV === 'PROD')
        if (!(usedMemory + memoryNeeded <= node.memory))
          //Are we in production?
          continue; //Skip if not enough memory
      //Enough memory OR not in Production mode
      availableNodes.push(node.id);
    }

    return availableNodes;
  } catch (error) {
    console.error(error);
    return null;
  }
}
