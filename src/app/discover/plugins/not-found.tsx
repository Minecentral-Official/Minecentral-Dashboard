import Link from 'next/link';

export default function NotFound() {
  return (
    <main className='space-y-4 py-12'>
      <h1 className='text-2xl font-semibold'>Plugin unavailable</h1>
      <p>This project is not publicly available.</p>
      <Link href='/discover/plugins' className='text-primary underline'>
        Browse the catalog
      </Link>
    </main>
  );
}
