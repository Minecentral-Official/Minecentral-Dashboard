'use client';

import { useEffect, useState } from 'react';

import { Loader2 } from 'lucide-react';
import Link from 'next/link';

import Logo from '@/components/logos/logo';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function NotFound() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className='flex min-h-screen items-center justify-center bg-background p-4'>
      <Card className='w-full max-w-2xl'>
        <CardHeader>
          <CardTitle className='mb-4 text-center text-4xl font-bold'>
            404 - Page Not Found
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='flex justify-center'>
            <div className='relative h-32 w-32'>
              {isLoading ?
                <Loader2 className='h-32 w-32 animate-spin text-primary' />
              : <div className='absolute inset-0 flex items-center justify-center'>
                  <span className='text-3xl'>
                    <Logo />
                  </span>
                </div>
              }
            </div>
          </div>
          <p className='text-center text-xl'>
            {"Oops! It seems like this chunk doesn't exist"}
          </p>
        </CardContent>
        <CardFooter className='flex justify-center space-x-4'>
          <Link href='/'>
            <Button variant='outline'>Home</Button>
          </Link>
          <Link href='/dashboard'>
            <Button variant='outline'>Dashboard</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
