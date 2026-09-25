export default function LoadingStack() {
  return (
    <div role='status' className='space-y-4 p-4'>
      <p className='text-sm text-muted-foreground'>
        Loading your plugin stack…
      </p>
      <div className='h-24 rounded-lg bg-muted motion-safe:animate-pulse' />
      <div className='h-24 rounded-lg bg-muted motion-safe:animate-pulse' />
    </div>
  );
}
