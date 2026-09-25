import Link from 'next/link';

export default function StackReleaseFilter({
  all,
  empty,
  href,
}: {
  all: boolean;
  empty: boolean;
  href: string;
}) {
  return (
    <div className='space-y-2'>
      {empty && (
        <p className='rounded-lg border p-3 text-sm text-muted-foreground'>
          {all ?
            'No catalog releases are available on this page. If this plugin has a Modrinth or Hangar source, ask a curator to refresh its import.'
          : 'No releases match the exact platform and Minecraft version filter. Choose “Show all releases” to check for other imported versions.'
          }
        </p>
      )}
      <Link href={href} className='inline-block text-sm underline'>
        {all ? 'Show relevant releases' : 'Show all releases'}
      </Link>
    </div>
  );
}
