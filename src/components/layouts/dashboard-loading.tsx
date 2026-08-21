import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export function DashboardListLoading({
  rows = 4,
  className,
}: {
  rows?: number;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div className='space-y-2'>
          <Skeleton className='h-7 w-48' />
          <Skeleton className='h-4 w-32' />
        </div>
        <Skeleton className='h-9 w-full sm:w-36' />
      </div>
      <div className='grid gap-4'>
        {Array.from({ length: rows }).map((_, index) => (
          <Skeleton key={index} className='h-28 w-full' />
        ))}
      </div>
    </div>
  );
}

export function DashboardEditLoading({
  showAside = false,
}: {
  showAside?: boolean;
}) {
  return (
    <div
      className={cn(
        'grid w-full items-start gap-5',
        showAside && 'xl:grid-cols-[minmax(0,1fr)_18rem]',
      )}
    >
      <div className='space-y-5'>
        <Skeleton className='h-36 w-full' />
        <Skeleton className='h-96 w-full' />
      </div>
      {showAside && <Skeleton className='hidden h-80 w-full xl:block' />}
    </div>
  );
}
