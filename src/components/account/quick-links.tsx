import { Bell, CreditCard, Settings } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function QuickLinks() {
  const links = [
    {
      href: 'dashboard/account/settings',
      icon: Settings,
      text: 'Account Settings',
    },
    {
      href: 'dashboard/account/billing',
      icon: CreditCard,
      text: 'Billing & Plans',
    },
    { href: '/account/notifications', icon: Bell, text: 'Notifications' },
    // { href: '/account/security', icon: Shield, text: 'Security' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Links</CardTitle>
        <CardDescription>Manage your account preferences</CardDescription>
      </CardHeader>
      <CardContent className='grid gap-4'>
        {links.map((link) => (
          <Button
            key={link.href}
            variant='outline'
            asChild
            className='w-full justify-start'
          >
            <Link href={link.href}>
              <link.icon className='mr-2 h-4 w-4' />
              {link.text}
            </Link>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
