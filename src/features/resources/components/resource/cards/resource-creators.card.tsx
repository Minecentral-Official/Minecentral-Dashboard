import { CrownIcon } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TResourcePlugin } from '@/features/resources/types/t-dto-resource-with-releases.type';
import WrapperAvatar from '@/lib/auth/components/avatar/wrapper.avatar';

export default function ResourceCardCreators({
  author,
}: Pick<TResourcePlugin, 'author'>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='font-semibold'>Creators</CardTitle>
      </CardHeader>
      <CardContent className='flex flex-row items-center gap-2'>
        <WrapperAvatar name={author.name} imageUrl={author.image} />
        <div className='flex flex-col hover:underline'>
          <div className='flex flex-row items-center'>
            {author.name} <CrownIcon className='ml-1 h-4 w-4 text-purple-500' />
          </div>
          <p className='text-sm text-accent-foreground'>Owner</p>
        </div>
      </CardContent>
    </Card>
  );
}
