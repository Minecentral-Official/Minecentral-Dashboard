import {
  ChartArea,
  ChevronsUp,
  Cpu,
  Gamepad2,
  Settings,
  Shield,
  Volleyball,
  Wrench,
} from 'lucide-react';
import Image from 'next/image';

import SectionWrapper from '@/components/sections/primitives/section.wrapper';
import { Badge } from '@/components/ui/badge';

export default function PerformanceFeaturesGridSection() {
  return (
    <SectionWrapper>
      <div className='flex flex-col gap-10'>
        <div className='flex flex-col items-start gap-4'>
          <div>
            <Badge>Unmatched Speed</Badge>
          </div>
          <div className='flex flex-col gap-2'>
            <h2 className='font-regular max-w-xl text-left text-3xl tracking-tighter md:text-5xl'>
              Performance That Powers Your World
            </h2>
            <p className='max-w-xl text-left text-lg leading-relaxed tracking-tight text-muted-foreground lg:max-w-lg'>
              Explore the powerful specs behind our lag-free experience.
            </p>
          </div>
        </div>
        <div className='flex flex-col gap-8 sm:grid sm:grid-cols-2 lg:grid lg:grid-cols-3 xl:grid-cols-4'>
          <div className='relative flex aspect-square h-full w-full flex-col justify-between overflow-hidden rounded-md p-6 lg:col-span-2 lg:row-span-2'>
            <Cpu className='h-8 w-8 stroke-1 text-primary-foreground' />
            <div className='flex flex-col'>
              <h3 className='text-xl tracking-tight text-primary-foreground'>
                Powered by AMD Ryzen
              </h3>
              <p className='max-w-xs text-base text-muted-foreground'>
                Experience unmatched performance with our servers equipped with
                the cutting-edge AMD Ryzen 5950X, delivering the ultimate gaming
                and hosting experience.
              </p>
            </div>
            <Image
              src='/host/amd-cpu.jpg'
              fill={true}
              alt='Amd cpu installed in pc'
              className='-z-10'
            />
          </div>

          <div className='flex aspect-square h-full flex-col justify-between rounded-md bg-muted p-6'>
            <Settings className='h-8 w-8 stroke-1' />
            <div className='flex flex-col'>
              <h3 className='text-xl tracking-tight'>16 Cores of Power</h3>
              <p className='max-w-xs text-base text-muted-foreground'>
                Ensure smooth, lag-free Minecraft gameplay powered by 16 CPU
                cores
              </p>
            </div>
          </div>

          <div className='flex aspect-square h-full flex-col justify-between rounded-md bg-muted p-6'>
            <Volleyball className='h-8 w-8 stroke-1' />
            <div className='flex flex-col'>
              <h3 className='text-xl tracking-tight'>32 Threads</h3>
              <p className='max-w-xs text-base text-muted-foreground'>
                32 threads for peak server performance.
              </p>
            </div>
          </div>

          <div className='flex aspect-square h-full flex-col justify-between rounded-md bg-muted p-6'>
            <ChevronsUp className='h-8 w-8 stroke-1' />
            <div className='flex flex-col'>
              <h3 className='text-xl tracking-tight'>
                Boost Clock Speeds up to 4.9 GHz
              </h3>
              <p className='max-w-xs text-base text-muted-foreground'>
                Our servers ramp up with boost clock speeds of up to 4.9 GHz,
                delivering smooth, lag-free gameplay.
              </p>
            </div>
          </div>

          <div className='flex aspect-square h-full flex-col justify-between rounded-md bg-muted p-6'>
            <Shield className='h-8 w-8 stroke-1' />
            <div className='flex flex-col'>
              <h3 className='text-xl tracking-tight'>DDoS Protection</h3>
              <p className='max-w-xs text-base text-muted-foreground'>
                Safeguard your server from attacks with our industry-leading
                DDoS protection system.
              </p>
            </div>
          </div>

          <div className='flex aspect-square h-full flex-col justify-between rounded-md bg-muted p-6'>
            <Wrench className='h-8 w-8 stroke-1' />
            <div className='flex flex-col'>
              <h3 className='text-xl tracking-tight'>
                Optimized for Minecraft
              </h3>
              <p className='max-w-xs text-base text-muted-foreground'>
                Servers fine-tuned for the best Minecraft experience.
              </p>
            </div>
          </div>

          <div className='flex aspect-square h-full flex-col justify-between rounded-md bg-muted p-6'>
            <Gamepad2 className='h-8 w-8 stroke-1' />
            <div className='flex flex-col'>
              <h3 className='text-xl tracking-tight'>
                Customizable Server Specs
              </h3>
              <p className='max-w-xs text-base text-muted-foreground'>
                Fine-tune your server&apos;s RAM and storage to match your
                gameplay needs.
              </p>
            </div>
          </div>

          <div className='flex h-full flex-col justify-between rounded-md bg-muted p-6 lg:col-span-2'>
            <ChartArea className='h-8 w-8 stroke-1' />
            <div className='flex flex-col'>
              <h3 className='text-xl tracking-tight'>Real-Time Monitoring</h3>
              <p className='max-w-xs text-base text-muted-foreground'>
                Track server performance metrics, including CPU usage, RAM, and
                network speeds, all in real time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
