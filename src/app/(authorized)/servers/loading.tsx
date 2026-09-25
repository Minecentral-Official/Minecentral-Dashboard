export default function LoadingWorkspaces() {
  return (
    <div role='status' className='space-y-4 py-8'>
      <p className='text-muted-foreground'>Loading your workspaces…</p>
      <div aria-hidden='true' className='grid gap-4 md:grid-cols-2'>
        {[0, 1].map((key) => (
          <div
            key={key}
            className='h-48 rounded-lg border bg-muted motion-safe:animate-pulse'
          />
        ))}
      </div>
    </div>
  );
}
