'use client';

import { Download, Github, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { PlateViewer } from '@/components/editor/plate-view';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { usePluginContext } from '@/features/resource-plugin/context/plugin.context';

export default function ResourcePageView() {
  const { title, subtitle, downloads, linkSource, linkSupport, description } =
    usePluginContext();
  return (
    <div className='min-h-screen bg-background'>
      <div className='container mx-auto px-4 py-8'>
        <div className='flex flex-col lg:flex-row lg:space-x-8'>
          {/* Main content area */}
          <main className='order-2 flex-1 lg:order-1'>
            <PlateViewer content={JSON.parse(description)} />
          </main>

          {/* Right column (former sidebar) */}
          <aside className='order-1 mb-8 w-full lg:order-2 lg:mb-0 lg:w-80'>
            <div className='space-y-6 lg:sticky lg:top-8'>
              <div className='text-center'>
                <Image
                  src={'/placeholder.png'}
                  alt='Plugin Icon'
                  width={200}
                  height={200}
                  className='mx-auto mb-4 rounded-lg'
                />
                <h1 className='text-2xl font-bold'>{title}</h1>
                <p className='text-sm text-muted-foreground'>{subtitle}</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Stats</CardTitle>
                </CardHeader>
                <CardContent className='space-y-2'>
                  <div className='flex justify-between'>
                    <span>Downloads:</span>
                    <span className='font-semibold'>{downloads || 0}</span>
                  </div>
                  {/* <div className='flex justify-between'>
                    <span>Reviews:</span>
                    <span className='font-semibold'>4.8 / 5 (156 reviews)</span>
                  </div> */}
                </CardContent>
              </Card>

              {/* <Card>
                <CardHeader>
                  <CardTitle>Review this plugin</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='mb-2 flex items-center space-x-1'>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className='h-5 w-5 text-yellow-400' />
                    ))}
                  </div>
                  <Input placeholder='Write your review...' />
                  <Button className='mt-2 w-full'>Submit Review</Button>
                </CardContent>
              </Card> */}

              <Button className='w-full'>
                <Download className='mr-2 h-4 w-4' /> Download
              </Button>

              <Separator />

              <div className='space-y-2'>
                {linkSupport && (
                  <Button variant='outline' className='w-full' asChild>
                    <Link href={linkSupport}>
                      <MessageSquare className='mr-2 h-4 w-4' /> Support
                    </Link>
                  </Button>
                )}
                {linkSource && (
                  <Button variant='outline' className='w-full'>
                    <Link href={linkSource}>
                      <Github className='mr-2 h-4 w-4' /> Source Code
                    </Link>
                  </Button>
                )}
                {/* <Button variant='outline' className='w-full'>
                  <HeartHandshake className='mr-2 h-4 w-4' /> Donate
                </Button> */}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
