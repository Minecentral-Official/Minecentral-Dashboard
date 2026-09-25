import Link from 'next/link';

export default function WorkspaceNotFound() {
  return (
    <div className='space-y-3 py-10'>
      <h1 className='text-2xl font-semibold'>Workspace unavailable</h1>
      <p className='text-muted-foreground'>
        It may have been removed, or your account may not have access.
      </p>
      <Link href='/servers' className='inline-block text-primary underline'>
        Back to My Servers
      </Link>
    </div>
  );
}
