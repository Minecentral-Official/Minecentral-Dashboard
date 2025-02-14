import { Download } from 'lucide-react';
import Image from 'next/image';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useResourcePluginContext } from '@/features/resource/context/plugin.context';

export default function ResourcePageView() {
  const {
    plugin: { title, author, subtitle },
  } = useResourcePluginContext();
  return (
    <Card className='overflow-hidden'>
      <Image
        src={'/placeholder.png'}
        alt={title}
        width={300}
        height={200}
        className='h-48 w-full object-cover'
      />
      <CardContent className='p-4'>
        <h3 className='mb-2 text-lg font-semibold'>{title}</h3>
        {/* <Badge variant='secondary' className='mb-2'>
          {type}
        </Badge> */}
        <p className='text-sm text-gray-600'>by {author.name}</p>
      </CardContent>
      <CardFooter className='flex items-center justify-between bg-secondary p-4'>
        <div className='flex items-center'>
          <Download className='mr-2 h-4 w-4' />
          <span className='text-sm'>{subtitle}</span>
        </div>
        <Badge variant='default'>Download</Badge>
      </CardFooter>
    </Card>
  );
}
