import { Badge } from '@/components/ui/badge';
import { T_DTOResource } from '@/features/resources/types/t-dto-resource.type';
import { pluginGetCategoryIcon } from '@/features/resources/util/plugin-category-icon.get';
import { pluginGetCategoryText } from '@/features/resources/util/plugin-category-text.get';

export default function ResourceCategoryBadges({
  categories,
  maxBadges,
}: Pick<T_DTOResource, 'categories'> & { maxBadges?: number }) {
  return (
    <div className='flex flex-wrap gap-2'>
      {categories?.slice(0, maxBadges).map((category) => {
        const Icon = pluginGetCategoryIcon(category);
        return (
          <Badge key={category} variant='outline'>
            <Icon className='mr-1 h-4 w-4' />
            {pluginGetCategoryText(category)}
          </Badge>
        );
      })}
    </div>
  );
}
