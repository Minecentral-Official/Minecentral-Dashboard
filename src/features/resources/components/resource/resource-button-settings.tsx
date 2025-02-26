import { SettingsIcon } from 'lucide-react';
import Link from 'next/link';

import ButtonTooltip from '@/components/ui/tooltip-button';
import { T_DTOResource } from '@/features/resources/types/t-dto-resource.type';

export default function ResourceButtonSettings({
  id,
}: Pick<T_DTOResource, 'id'>) {
  return (
    <Link href={`/dashboard/resources/edit/${id}`}>
      <ButtonTooltip tooltip={'Settings'} Icon={SettingsIcon} />
    </Link>
  );
}
