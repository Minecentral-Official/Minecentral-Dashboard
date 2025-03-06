'use client';

import { Download } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import ResourceCategoryBadges from '@/features/resources/components/resource/resource-category-badges';
import { T_DTOResource } from '@/features/resources/types/t-dto-resource.type';
import { getResourceUrl } from '@/features/resources/util/get-resource-url';

type props = Pick<
  T_DTOResource,
  'title' | 'author' | 'subtitle' | 'categories' | 'iconUrl' | 'slug' | 'type'
>;

export default function PluginCardView({
  title,
  author,
  subtitle,
  categories,
  iconUrl,
  slug,
  type,
}: props) {
  const url = `/${getResourceUrl(type)}/${slug}`;
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
        <ResourceCategoryBadges categories={categories} />

        <p className='text-sm text-gray-600'>by {author.name}</p>
      </CardContent>
      <CardFooter className='flex items-center justify-between bg-secondary p-4'>
        <div className='flex items-center'>
          <Download className='mr-2 h-4 w-4' />
          <span className='text-sm'>{subtitle}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
