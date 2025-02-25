import { SettingsIcon } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { TResourcePlugin } from '@/features/resources/types/t-dto-resource-with-releases.type';

export default function ResourceButtonSettings({
  id,
}: Pick<TResourcePlugin, 'id'>) {
  return (
    <Button asChild className='h-10 w-10 rounded-full'>
      <Link href={`/dashboard/resources/edit/${id}`}>
        <SettingsIcon />
      </Link>
    </Button>
  );
}
