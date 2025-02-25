import { Badge } from '@/components/ui/badge';
import { TResourcePluginBasic } from '@/features/resources/types/t-dto-resource.type';

export default function ResourceCategoryBadges({
  categories,
  maxBadges,
}: Pick<TResourcePluginBasic, 'categories'> & { maxBadges?: number }) {
  return (
    <div className='mb-2 flex flex-row gap-2'>
      {categories?.slice(0, maxBadges).map((category) => (
        <Badge key={category} variant='outline'>
          {category.slice(0, 1).toUpperCase() + category.slice(1)}
        </Badge>
      ))}
    </div>
  );
}
