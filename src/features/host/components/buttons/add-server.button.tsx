import Link from 'next/link';

import { Button } from '@/components/ui/button';

import type { ComponentProps, PropsWithChildren } from 'react';

type AddServerButtonProps = PropsWithChildren<{
  buttonProps: Omit<ComponentProps<typeof Button>, 'asChild'> & {
    asChild?: true;
  };
  linkProps?: Omit<ComponentProps<typeof Link>, 'href'>;
}>;

export default function AddServerButton({
  children,
  buttonProps,
  linkProps,
}: AddServerButtonProps) {
  return (
    <Button asChild {...buttonProps} icon={undefined} iconPlacement={undefined}>
      <Link href='/dashboard/host/servers/add' {...linkProps}>
        {children}
      </Link>
    </Button>
  );
}
