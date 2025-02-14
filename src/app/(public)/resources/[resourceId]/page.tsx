import { ResourcePluginProvider } from '@/features/resource/context/plugin.context';
import resourceGetById from '@/features/resource/queries/resource-by-id.get';

type PageProps = {
  params: Promise<{ resourceId: number }>;
};

export default async function Page({ params }: PageProps) {
  const { resourceId } = await params;
  const plugin = await resourceGetById(resourceId);
  if (!plugin) return <>Huh</>;

  return (
    <ResourcePluginProvider plugin={plugin}>
      {resourceId}
    </ResourcePluginProvider>
  );
}
