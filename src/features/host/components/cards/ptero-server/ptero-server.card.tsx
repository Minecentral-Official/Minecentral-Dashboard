'use client';

import { type PropsWithChildren } from 'react';

import { Card } from '@/components/ui/card';

export default function PteroServerCard({ children }: PropsWithChildren) {
  return <Card>{children}</Card>;
}
