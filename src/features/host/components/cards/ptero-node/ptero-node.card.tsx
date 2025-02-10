'use client';

import { type PropsWithChildren } from 'react';

import { Card } from '@/components/ui/card';

export default function PteroNodeCard({ children }: PropsWithChildren) {
  return <Card>{children}</Card>;
}
