import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function HostServersPage() {
  return (
    <div>
      This is the host servers page
      <Button>
        <Link href='/dashboard/host/servers/add'>Add Server</Link>
      </Button>
    </div>
  );
}
