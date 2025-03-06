'use client';

import { PropsWithChildren, useState } from 'react';

import { Menu, X } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function NavMobile_Toggle({ children }: PropsWithChildren) {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <Button variant='ghost' size='icon' onClick={() => setOpen(!isOpen)}>
        {isOpen ?
          <X className='h-5 w-5' />
        : <Menu className='h-5 w-5' />}
      </Button>
      {isOpen && children}
    </>
  );
}
