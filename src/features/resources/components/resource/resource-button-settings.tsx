import { SettingsIcon } from 'lucide-react';
import Link from 'next/link';

import ButtonTooltip from '@/components/ui/tooltip-button';
import { T_DTOResource } from '@/features/resources/types/t-dto-resource.type';

export default function ResourceButtonSettings({
  slug,
}: Pick<T_DTOResource, 'slug'>) {
  return (
    <Link href={`/dashboard/resources/${slug}`}>
      <ButtonTooltip tooltip='Settings' Icon={SettingsIcon} variant='ghost' />
    </Link>
  );
}
