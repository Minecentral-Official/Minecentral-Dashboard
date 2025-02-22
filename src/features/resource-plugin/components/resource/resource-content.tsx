import { PlateViewer } from '@/components/editor/plate-view';
import { TResourcePlugin } from '@/features/resource-plugin/types/plugin-all-data.type';

export default function ResourceContent({
  description,
}: Pick<TResourcePlugin, 'description'>) {
  return (
    <main className='order-2 flex-1 lg:order-1'>
      <PlateViewer content={JSON.parse(description)} />
    </main>
  );
}
