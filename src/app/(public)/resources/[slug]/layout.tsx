import { PropsWithChildren } from 'react';

import { notFound } from 'next/navigation';

export default async function layout({
  params,
  children,
}: PropsWithChildren & { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // First, check if we need to redirect
  const checkResponse = await fetch(
    `localhost:3000/api/redirect-resource/${slug}`,
  );
  if (!checkResponse.ok) {
    return <>{children}</>;
  }

  // If we get here, it means we should have been redirected
  // This shouldn't happen, but just in case:
  notFound();
}
