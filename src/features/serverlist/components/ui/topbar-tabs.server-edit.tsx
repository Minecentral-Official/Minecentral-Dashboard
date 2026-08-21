'use client';

import {
  CheckCircle2Icon,
  ExternalLinkIcon,
  Globe2Icon,
  PanelLeftIcon,
  RadioTowerIcon,
  ServerIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { T_DTOServer } from '@/features/serverlist/types/t-dto-server.type';
import { cn } from '@/lib/utils';

const REQUIRED_FIELD_COUNT = 8;

const navItems = [
  {
    title: 'Profile',
    description: 'Listing, address, tags',
    url: '',
    Icon: PanelLeftIcon,
  },
  {
    title: 'Voting',
    description: 'Rewards and cooldown',
    url: '/votifier',
    Icon: RadioTowerIcon,
  },
];

type ServerEditTopbarTabsProps = {
  server: Pick<
    T_DTOServer,
    'title' | 'slug' | 'ip' | 'port' | 'status' | 'voteCooldownHours'
  >;
  missingRequiredCount: number;
};

export default function ServerEditTopbarTabs({
  server,
  missingRequiredCount,
}: ServerEditTopbarTabsProps) {
  const urlPrefix = `/dashboard/servers/${server.slug}`;
  const pathname = usePathname();
  const completedRequiredCount = Math.max(
    REQUIRED_FIELD_COUNT - missingRequiredCount,
    0,
  );
  const readiness = Math.round(
    (completedRequiredCount / REQUIRED_FIELD_COUNT) * 100,
  );
  const serverAddress = `${server.ip}:${server.port}`;

  return (
    <aside className='rounded-md border bg-card/80 text-card-foreground shadow-sm xl:sticky xl:top-4'>
      <div className='border-b p-4'>
        <div className='mb-4 flex items-center justify-between gap-3'>
          <div className='flex h-10 w-10 items-center justify-center rounded-md border bg-background text-primary'>
            <ServerIcon className='h-5 w-5' />
          </div>
          <Badge
            className={cn(
              'capitalize',
              server.status === 'published' &&
                'border-emerald-200 bg-emerald-50 text-emerald-700',
            )}
          >
            {server.status}
          </Badge>
        </div>
        <div className='min-w-0 space-y-1'>
          <h2 className='truncate text-lg font-semibold'>{server.title}</h2>
          <p className='truncate font-mono text-xs text-muted-foreground'>
            {serverAddress}
          </p>
        </div>
      </div>

      <nav className='p-2'>
        {navItems.map((item) => {
          const href = `${urlPrefix}${item.url}`;
          const isActive = pathname === href;
          return (
            <Link
              key={item.title}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors',
                isActive ?
                  'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <item.Icon className='h-4 w-4 shrink-0' />
              <span className='min-w-0'>
                <span className='block font-medium'>{item.title}</span>
                <span
                  className={cn(
                    'block truncate text-xs',
                    isActive ?
                      'text-primary-foreground/75'
                    : 'text-muted-foreground',
                  )}
                >
                  {item.description}
                </span>
              </span>
            </Link>
          );
        })}
      </nav>

      <div className='border-t p-4'>
        <div className='mb-3 flex items-center justify-between text-sm'>
          <span className='flex items-center gap-2 font-medium'>
            <CheckCircle2Icon className='h-4 w-4 text-emerald-600' />
            Readiness
          </span>
          <span className='font-mono text-xs text-muted-foreground'>
            {completedRequiredCount}/{REQUIRED_FIELD_COUNT}
          </span>
        </div>
        <Progress value={readiness} className='h-1.5' />
        <p className='mt-3 text-xs leading-5 text-muted-foreground'>
          {missingRequiredCount > 0 ?
            `${missingRequiredCount} required field${
              missingRequiredCount === 1 ? '' : 's'
            } left before publish.`
          : 'Ready for public discovery.'}
        </p>
      </div>

      <div className='border-t p-3'>
        {server.status === 'published' ?
          <Button asChild variant='outline' className='w-full justify-start'>
            <Link href={`/serverlist/${server.slug}`}>
              <ExternalLinkIcon className='h-4 w-4' />
              Public page
            </Link>
          </Button>
        : <div className='flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground'>
            <Globe2Icon className='h-4 w-4' />
            Public page after publish
          </div>
        }
      </div>
    </aside>
  );
}
