import { CircleHelpIcon, Code2Icon } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { TResourcePlugin } from '@/features/resource-plugin/types/plugin-all-data.type';

export default function ResourceLinks({
  linkSupport,
  linkSource,
}: Pick<TResourcePlugin, 'linkSupport' | 'linkSource'>) {
  return (
    <div className='space-y-2'>
      {linkSupport && (
        <Button variant='outline' className='w-full' asChild>
          <Link href={linkSupport}>
            <CircleHelpIcon className='h-4 w-4' />
            Additional Support
          </Link>
        </Button>
      )}
      {linkSource && (
        <Button variant='outline' className='w-full' asChild>
          <Link href={linkSource}>
            <Code2Icon className='h-4 w-4' /> Source Code
          </Link>
        </Button>
      )}
      {/* <Button variant='outline' className='w-full'>
                  <HeartHandshake className='mr-2 h-4 w-4' /> Donate
                </Button> */}
    </div>
  );
}
