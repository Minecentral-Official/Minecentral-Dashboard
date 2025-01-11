import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import type { ComponentProps } from 'react';

type NextPaymentCardProps = {
  cardProps?: ComponentProps<typeof Card>;
  // can add additional props for card subcomponents
};

export default function NextPaymentCard({ cardProps }: NextPaymentCardProps) {
  return (
    <Card {...cardProps}>
      <CardHeader>
        <CardTitle>Total invoice per month</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='min-w-[200px] text-3xl font-bold'>31</div>
        <CardDescription>Servers</CardDescription>
      </CardContent>
    </Card>
  );
}
