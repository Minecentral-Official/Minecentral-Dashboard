import { CircleHelpIcon, Code2Icon } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TResourcePlugin } from '@/features/resources/types/plugin-all-data.type';

export default function ResourceCardLinks({
  linkSupport,
  linkSource,
}: Pick<TResourcePlugin, 'linkSupport' | 'linkSource'>) {
  if (!linkSupport && !linkSource) return <></>;

  return (
    <Card className='flex flex-col gap-4'>
      <CardHeader>
        <CardTitle>Links</CardTitle>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
}
