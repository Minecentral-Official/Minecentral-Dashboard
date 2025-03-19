'use client';

import { TimerIcon, VoteIcon } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { T_ServerDBData } from '@/features/serverlist/types/t-server-datebase.type';
import compactNumber from '@/lib/utils/compact-number';
import { formatDate } from '@/lib/utils/format-date';

export default function ServerOverview({
  votes,
  updatedAt,
}: Pick<T_ServerDBData, 'votes' | 'updatedAt'>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Realm Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className='grid grid-cols-1 gap-4 text-center lg:grid-cols-2'>
          <div>
            <dt className='text-sm font-medium text-muted-foreground'>
              Last Updated
            </dt>
            <dd className='flex flex-row items-center justify-center text-2xl font-semibold'>
              <TimerIcon className='mr-1 h-5 w-5' />
              {formatDate(updatedAt)}
            </dd>
          </div>
          <div>
            <dt className='text-sm font-medium text-muted-foreground'>
              Total Votes
            </dt>
            <dd className='flex flex-row items-center justify-center text-2xl font-semibold'>
              <VoteIcon className='mr-1 h-5 w-5' />
              {compactNumber(votes)}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
