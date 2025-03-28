import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { hostHelperGetPaymentsPerMonth } from '@/features/host/helpers/get-payments-per-month.helper';

import type { ComponentProps } from 'react';

type NextPaymentCardProps = {
  cardProps?: ComponentProps<typeof Card>;
  // can add additional props for card subcomponents
};

export default async function NextPaymentCard({
  cardProps,
}: NextPaymentCardProps) {
  const totalCost = await hostHelperGetPaymentsPerMonth();
  return (
    <Card {...cardProps}>
      <CardHeader>
        <CardTitle>Total invoice per month</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='min-w-[200px] text-3xl font-bold'>{totalCost}</div>
        <CardDescription>Servers</CardDescription>
      </CardContent>
    </Card>
  );
}
