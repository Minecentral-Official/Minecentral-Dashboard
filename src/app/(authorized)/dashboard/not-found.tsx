import Link from 'next/link';

export default function DashboardNotFound() {
  return (
    <div className='flex min-h-[60vh] flex-col items-center justify-center gap-4'>
      <h2 className='text-2xl font-bold'>Dashboard Page Not Found</h2>
      <p>The dashboard page youre looking for doesnt exist.</p>
      <Link
        href='/dashboard'
        className='rounded-md bg-primary px-4 py-2 text-primary-foreground'
      >
        Return to Dashboard
      </Link>
    </div>
  );
}
