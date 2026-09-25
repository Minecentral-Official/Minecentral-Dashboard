'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

export const workspaceSections = [
  ['', 'Overview'],
  ['stack', 'Stack'],
  ['configs', 'Configs'],
  ['compatibility', 'Compatibility'],
  ['updates', 'Updates'],
  ['diagnostics', 'Diagnostics'],
  ['settings', 'Settings'],
] as const;
export default function WorkspaceNavigation({ id }: { id: string }) {
  const pathname = usePathname();
  return (
    <nav
      aria-label='Workspace sections'
      className='flex flex-wrap gap-1 border-b pb-3'
    >
      {workspaceSections.map(([section, label]) => {
        const href = `/servers/${id}${section ? `/${section}` : ''}`;
        const selected = pathname === href;
        return (
          <Link
            key={section}
            href={href}
            aria-current={selected ? 'page' : undefined}
            className={cn(
              'rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              selected ?
                'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'text-muted-foreground',
            )}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
