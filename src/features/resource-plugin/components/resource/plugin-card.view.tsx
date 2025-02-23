'use client';

import { Download } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { TResourcePluginBasic } from '@/features/resource-plugin/types/plugin-basic.type';

type props = Pick<
  TResourcePluginBasic,
  'title' | 'author' | 'subtitle' | 'id' | 'categories' | 'iconUrl'
>;

export default function PluginCard({
  title,
  author,
  subtitle,
  id,
  categories,
  iconUrl,
}: props) {
  const url = `/resources/${id}`;
  return (
    <Card className='overflow-hidden'>
      <Link href={url}>
        <Image
          src={iconUrl || '/placeholder.png'}
          alt={title}
          width={300}
          height={200}
          className='h-48 w-full object-cover'
        />
      </Link>
      <CardContent className='p-4'>
        <Link href={url}>
          <h3 className='mb-2 text-lg font-semibold'>{title}</h3>
        </Link>
        <div className='mb-2 flex flex-row gap-2'>
          {categories.map((category) => (
            <Badge key={category} variant='outline'>
              {category}
            </Badge>
          ))}
        </div>

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
