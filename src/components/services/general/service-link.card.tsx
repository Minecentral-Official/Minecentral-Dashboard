import Link from 'next/link';

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

type ServiceLinkCardProps = {
  title: string;
  description: string;
  href: string;
  enabled?: boolean;
};

export default function ServiceLinkCard({
  title,
  description,
  href,
  enabled = true,
}: ServiceLinkCardProps) {
  return (
    <Link href={enabled ? href : '#'}>
      <Card
        className={cn(
          'relative overflow-hidden',
          enabled && 'transition-shadow hover:shadow-xl',
        )}
      >
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        {!enabled && (
          <div className='absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center bg-muted/90'>
            Coming Soon
          </div>
        )}
      </Card>
    </Link>
  );
}
