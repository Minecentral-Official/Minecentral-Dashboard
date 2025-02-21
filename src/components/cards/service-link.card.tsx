import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

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
    <div
      key={title}
      // whileHover={{ scale: 1.05 }}
      // whileTap={{ scale: 0.95 }}
      className='w-full'
    >
      <Card
        className={`transition-all hover:shadow-lg ${!enabled ? 'cursor-not-allowed opacity-50' : ''}`}
      >
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant='outline'
            className='w-full'
            disabled={!enabled}
            asChild
          >
            <Link href={enabled ? href : '#'}>
              Learn More <ArrowRight className='ml-2 h-4 w-4' />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
