import { SettingsIcon } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { T_DTOResource } from '@/features/resources/types/t-dto-resource.type';

export default function ResourceButtonSettings({
  id,
}: Pick<T_DTOResource, 'id'>) {
  return (
    <Button asChild className='h-10 w-10 rounded-full'>
      <Link href={`/dashboard/resources/edit/${id}`}>
        <SettingsIcon />
      </Link>
    </Button>
  );
}
