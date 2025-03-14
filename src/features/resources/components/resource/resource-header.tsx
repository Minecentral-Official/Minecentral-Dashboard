import Image from 'next/image';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import ResourceCategoryBadges from '@/features/resources/components/resource/resource-category-badges';
import ResourceStats from '@/features/resources/components/resource/resource-stats';
import { T_DTOResource_WithReleases } from '@/features/resources/types/t-dto-resource.type';

export default function ResourceHeader({
  title,
  subtitle,
  downloads,
  categories,
  iconUrl,
  likes,
}: Pick<
  T_DTOResource_WithReleases,
  'title' | 'subtitle' | 'iconUrl' | 'categories' | 'downloads' | 'likes'
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
            className='aspect-square rounded-xl bg-secondary'
          />
        </div>

        <ResourceStats {...{ categories, downloads, likes }} />
      </CardContent>
    </Card>
  );
}
