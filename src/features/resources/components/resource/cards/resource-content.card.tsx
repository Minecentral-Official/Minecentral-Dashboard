import MarkdownViewer from '@/components/markdown-editor/markdown-viewer';
import { Card, CardContent } from '@/components/ui/card';
import { T_DTOResource } from '@/features/resources/types/t-dto-resource.type';

export default function ResourceCardContent({
  description,
}: Pick<T_DTOResource, 'description'>) {
  return (
    <Card className='w-full'>
      <CardContent className='my-2'>
        <main className='flex-1'>
          <MarkdownViewer markdown={description || ''} />
        </main>
      </CardContent>
    </Card>
  );
}
