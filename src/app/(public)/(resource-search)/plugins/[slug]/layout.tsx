import { PropsWithChildren } from 'react';

export default async function layout({
  // params,
  children,
}: PropsWithChildren & { params: Promise<{ slug: string }> }) {
  // const { slug } = await params;

  return <>{children}</>;
}
