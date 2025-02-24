import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResourceUploadImageDialog } from '@/features/resource-plugin/components/dialog/upload-image-dialog';
import { TResourcePlugin } from '@/features/resource-plugin/types/plugin-all-data.type';
import getSession from '@/lib/auth/helpers/get-session';

export default async function ResourceEditButtons({
  title,
  iconUrl,
  id,
  author,
}: Pick<TResourcePlugin, 'title' | 'iconUrl' | 'id' | 'author'>) {
  const session = await getSession();
  if (!session || session.user.id !== author.id) return <></>;

  //Show buttons to edit resource details
  return (
    <Card className='flex flex-col gap-4'>
      <CardHeader>
        <CardTitle>Edit Resource</CardTitle>
      </CardHeader>
      <CardContent>
        <ResourceUploadImageDialog {...{ title, iconUrl, id }} />
      </CardContent>
    </Card>
  );
}
