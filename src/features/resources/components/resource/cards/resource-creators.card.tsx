import { CrownIcon } from 'lucide-react';
import Link from 'next/link';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { T_DTOResource } from '@/features/resources/types/t-dto-resource.type';
import WrapperAvatar from '@/lib/auth/components/avatar/wrapper.avatar';

export default function ResourceCardCreators({
  author,
}: Pick<T_DTOResource, 'author'>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='font-semibold'>Creators</CardTitle>
      </CardHeader>
      <CardContent>
        <Link
          className='flex flex-row items-center gap-2 hover:underline'
          href={`/user/${author.name}`}
        >
          <WrapperAvatar name={author.name} imageUrl={author.image} />
          <div className='flex flex-col'>
            <div className='flex flex-row items-center'>
              {author.name}{' '}
              <CrownIcon className='ml-1 h-4 w-4 text-purple-500' />
            </div>
            <p className='text-sm text-accent-foreground'>Owner</p>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}
