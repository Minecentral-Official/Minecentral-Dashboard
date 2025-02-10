import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PteroNodeCard from '@/features/host/components/cards/ptero-node/ptero-node.card';
import PteroNodeCardFooter from '@/features/host/components/cards/ptero-node/ptero-node.card-footer';
import PteroNodeCardHeader from '@/features/host/components/cards/ptero-node/ptero-node.card-header';
import PteroNodeCardTitle from '@/features/host/components/cards/ptero-node/ptero-node.card-title';
import { pterodactylGetNodes } from '@/features/host/pterodactyl/queries/nodes.get';

export default async function AdminDashboard() {
  const nodes = await pterodactylGetNodes();
  return (
    <div className='space-y-6'>
      <h1 className='text-3xl font-bold'>Admin Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Node Status</CardTitle>
        </CardHeader>
        <CardContent className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {nodes.map((node) => (
            <PteroNodeCard key={node.id}>
              <PteroNodeCardHeader>
                <PteroNodeCardTitle nodeId={node.id} />
              </PteroNodeCardHeader>
              <PteroNodeCardFooter nodeId={node.id} />
            </PteroNodeCard>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
