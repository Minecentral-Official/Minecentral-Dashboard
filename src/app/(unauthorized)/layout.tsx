import type { PropsWithChildren } from 'react';

// Sign-in owns the return destination and existing-session redirect.
export default function Layout({ children }: PropsWithChildren) {
  return children;
}
