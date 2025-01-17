import { List, PlugIcon as Plugin, Server, Settings } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function AccountQuickaccess() {
  // const router = useRouter();

  const quickLinks = [
    { icon: Server, label: 'Manage Servers', href: '/dashboard/host' },
    { icon: List, label: 'Worlds List', href: '/dashboard/worlds' },
    { icon: Plugin, label: 'Plugin Manager', href: '/dashboard/plugins' },
    { icon: Settings, label: 'Account Settings', href: '/dashboard/account' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Access</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-2 gap-4'>
          {quickLinks.map(({ href, icon: Icon, label }, index) => (
            <Button
              key={index}
              variant='outline'
              className='flex h-20 flex-col items-center justify-center'
              // onClick={() => router.push(link.href)}
              asChild
            >
              <Link href={href}>
                <Icon className='mb-2 h-6 w-6' />
                {label}
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
