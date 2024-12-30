'use client';

import { useState } from 'react';

import { Menu, MoveRight, X } from 'lucide-react';
import Link from 'next/link';

import { NavigationConfig } from '@/components/nav/nav-config.type';
import { Button } from '@/components/ui/button';

export default function NavMobile({ config }: { config: NavigationConfig }) {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <Button variant='ghost' size='icon' onClick={() => setOpen(!isOpen)}>
        {isOpen ?
          <X className='h-5 w-5' />
        : <Menu className='h-5 w-5' />}
      </Button>
      {isOpen && (
        <div className='container absolute right-0 top-20 flex w-full flex-col gap-8 border-t bg-background py-4 shadow-lg'>
          {config.map((item) => (
            <div key={item.title}>
              <div className='flex flex-col gap-2'>
                {item.href ?
                  <Link
                    href={item.href}
                    className='flex items-center justify-between'
                  >
                    <span className='text-lg'>{item.title}</span>
                    <MoveRight className='h-4 w-4 stroke-1 text-muted-foreground' />
                  </Link>
                : <p className='text-lg'>{item.title}</p>}
                {item.items &&
                  item.items.map((subItem) => (
                    <Link
                      key={subItem.title}
                      href={subItem.href}
                      className='flex items-center justify-between'
                    >
                      <span className='text-muted-foreground'>
                        {subItem.title}
                      </span>
                      <MoveRight className='h-4 w-4 stroke-1' />
                    </Link>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
