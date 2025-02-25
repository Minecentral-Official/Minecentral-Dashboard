import MarkdownViewer from '@/components/markdown-editor/markdown-viewer';
import { Card, CardContent } from '@/components/ui/card';
import { TResourcePlugin } from '@/features/resources/types/t-dto-resource-with-releases.type';

export default function ResourceCardContent({
  description,
}: Pick<TResourcePlugin, 'description'>) {
  return (
    <Card className='w-full'>
      <CardContent className='my-2'>
        <main className='flex-1'>
          <MarkdownViewer markdown={description} />
        </main>
      </CardContent>
    </Card>
  );
}
