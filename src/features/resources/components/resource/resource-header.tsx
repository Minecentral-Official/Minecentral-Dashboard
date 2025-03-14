import Image from 'next/image';

import ResourceStats from '@/features/resources/components/resource/resource-stats';
import { T_DTOResource_WithReleases } from '@/features/resources/types/t-dto-resource.type';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ResourceCategoryBadges from './resource-category-badges';

export default function ResourceHeader({
  title,
  subtitle,
  downloads,
  categories,
  iconUrl,
}: Pick<
  T_DTOResource_WithReleases,
  'title' | 'subtitle' | 'iconUrl' | 'categories' | 'downloads'
> & {
  likeCount: number;
}) {
  return (




    <Card>
      <CardHeader>
        <div className='mb-4'>
          <ResourceCategoryBadges maxBadges={3} categories={categories} />
        </div>
        <CardTitle className='text-2xl font-light'>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col gap-4'>
        <div className='relative aspect-square'>
          <Image
            src={iconUrl || '/placeholder.png'}
            alt={title}
            fill
            className='rounded-xl bg-secondary aspect-square'
          />
        </div>

        <ResourceStats
          {...{ categories, downloads: downloads || 0, likeCount: 0 }}
        />
      </CardContent>
    </Card>
  );
}
