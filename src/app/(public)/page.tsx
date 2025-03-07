import { CheckIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Minecentral - Home',
  description:
    'Host your server, advertise to players, and discover resources - all in one place.',
};

// This is the root of our project, our 'landing page'
export default function LandingPage() {
  // return (
  //   <>
  //     <Header service='services' config={baseNavigationConfig()} />
  //     <ServiceSelectionSection />
  //   </>
  // );
  return (
    <div className='flex min-h-screen flex-col'>
      <main className='flex-1'>
        {/* Hero Section */}
        <section className='w-full py-12 md:py-16 lg:py-24 xl:py-32'>
          <div className='container px-4 md:px-6'>
            <div className='grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]'>
              <div className='flex flex-col justify-center space-y-4'>
                <div className='space-y-2'>
                  <Badge className='inline-flex'>New Features Available</Badge>
                  <h1 className='text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none'>
                    Your Complete Minecraft Solution
                  </h1>
                  <p className='max-w-[600px] text-muted-foreground md:text-xl'>
                    Host your server, advertise to players, and discover
                    resources - all in one place.
                  </p>
                </div>
                <div className='flex flex-col gap-2 min-[400px]:flex-row'>
                  <Button asChild size='lg'>
                    <Link href={'/plugins'}>Download Plugins</Link>
                  </Button>
                  <Button asChild size='lg' variant='outline'>
                    <Link href={'/hosting'}>Start Hosting</Link>
                  </Button>
                  <Button asChild size='lg' variant='outline'>
                    <Link href={'/server-list'}>Explore Servers</Link>
                  </Button>
                </div>
              </div>
              <div className='flex items-center justify-center'>
                <Image
                  src='/host/splash.png?height=550&width=350'
                  width={550}
                  height={350}
                  alt='Hero Image'
                  className='rounded-lg object-cover'
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section
          id='hosting'
          className='w-full bg-muted/50 py-12 md:py-24 lg:py-32'
        >
          <div className='container px-4 md:px-6'>
            <div className='flex flex-col items-center justify-center space-y-4 text-center'>
              <div className='space-y-2'>
                <h2 className='text-3xl font-bold tracking-tighter sm:text-5xl'>
                  Minecraft Server Hosting
                </h2>
                <p className='max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
                  Reliable, high-performance servers with easy setup and
                  management.
                </p>
              </div>
            </div>
            <div className='mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12'>
              <Image
                src='/host/panel-console.png?height=400&width=400'
                width={400}
                height={400}
                alt='Server Hosting'
                className='mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last'
              />
              <div className='flex flex-col justify-center space-y-4'>
                <ul className='grid gap-3'>
                  <li className='flex items-center gap-2'>
                    <div className='flex h-7 w-7 items-center justify-center rounded-full bg-primary/10'>
                      <CheckIcon className='h-4 w-4' />
                    </div>
                    <span>One-click server deployment</span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <div className='flex h-7 w-7 items-center justify-center rounded-full bg-primary/10'>
                      <CheckIcon className='h-4 w-4' />
                    </div>
                    <span>DDoS protection included</span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <div className='flex h-7 w-7 items-center justify-center rounded-full bg-primary/10'>
                      <CheckIcon className='h-4 w-4' />
                    </div>
                    <span>24/7 technical support</span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <div className='flex h-7 w-7 items-center justify-center rounded-full bg-primary/10'>
                      <CheckIcon className='h-4 w-4' />
                    </div>
                    <span>Automatic backups</span>
                  </li>
                </ul>
                <div className='flex flex-col gap-2 min-[400px]:flex-row'>
                  <Button asChild>
                    <Link href={'/hosting/pricing'}>View Hosting Plans</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Server List Section */}
        <section id='servers' className='w-full py-12 md:py-24 lg:py-32'>
          <div className='container px-4 md:px-6'>
            <div className='flex flex-col items-center justify-center space-y-4 text-center'>
              <div className='space-y-2'>
                <h2 className='text-3xl font-bold tracking-tighter sm:text-5xl'>
                  Server List
                </h2>
                <p className='max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
                  Advertise your server or find new worlds to explore.
                </p>
              </div>
            </div>
            <div className='grid gap-6 py-8 sm:grid-cols-2 lg:grid-cols-3'>
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className='overflow-hidden'>
                  <CardHeader className='p-0'>
                    <Image
                      src={`/placeholder.png?height=200&width=400&text=Server+${i + 1}`}
                      width={400}
                      height={200}
                      alt={`Server ${i + 1}`}
                      className='w-full object-cover'
                    />
                  </CardHeader>
                  <CardContent className='p-6'>
                    <CardTitle>Survival Paradise {i + 1}</CardTitle>
                    <CardDescription className='mt-2'>
                      A unique survival experience with custom plugins and
                      friendly community.
                    </CardDescription>
                    <div className='mt-4 flex flex-wrap gap-2'>
                      <Badge variant='secondary'>Survival</Badge>
                      <Badge variant='secondary'>PvE</Badge>
                      <Badge variant='secondary'>Economy</Badge>
                    </div>
                  </CardContent>
                  <CardFooter className='flex justify-between'>
                    <div className='text-sm text-muted-foreground'>
                      Players: 42/100
                    </div>
                    <Button variant='outline' size='sm'>
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            <div className='mt-8 flex justify-center'>
              <Button asChild variant='outline'>
                <Link href='/server-list'>Browse All Servers</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Resources Section */}
        <section
          id='resources'
          className='w-full bg-muted/50 py-12 md:py-24 lg:py-32'
        >
          <div className='container px-4 md:px-6'>
            <div className='flex flex-col items-center justify-center space-y-4 text-center'>
              <div className='space-y-2'>
                <h2 className='text-3xl font-bold tracking-tighter sm:text-5xl'>
                  Resources
                </h2>
                <p className='max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
                  Discover and share plugins, mods, and shaders for your
                  Minecraft experience.
                </p>
              </div>
            </div>
            <div className='grid gap-6 py-8 sm:grid-cols-2 lg:grid-cols-3'>
              <Card>
                <CardHeader>
                  <CardTitle>Plugins</CardTitle>
                  <CardDescription>
                    Enhance your server with custom functionality
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Image
                    src='/placeholder.png?height=150&width=350&text=Plugins'
                    width={350}
                    height={150}
                    alt='Plugins'
                    className='w-full rounded-lg object-cover'
                  />
                </CardContent>
                <CardFooter>
                  <Button className='w-full' asChild>
                    <Link href={'/plugins'}>Browse Plugins</Link>
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Mods</CardTitle>
                  <CardDescription>
                    Transform your gameplay experience
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Image
                    src='/placeholder.png?height=150&width=350&text=Mods'
                    width={350}
                    height={150}
                    alt='Mods'
                    className='w-full rounded-lg object-cover'
                  />
                </CardContent>
                <CardFooter>
                  <Button className='w-full' asChild>
                    <Link href={'/mods'}>Browse Mods</Link>
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Shaders</CardTitle>
                  <CardDescription>
                    Enhance your visual experience
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Image
                    src='/placeholder.png?height=150&width=350&text=Shaders'
                    width={350}
                    height={150}
                    alt='Shaders'
                    className='w-full rounded-lg object-cover'
                  />
                </CardContent>
                <CardFooter>
                  <Button className='w-full' asChild>
                    <Link href={'/shaders'}>Browse Shaders</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
            <div className='mt-12 flex flex-col items-center justify-center space-y-4 text-center'>
              <div className='space-y-2'>
                <h3 className='text-2xl font-bold'>Upload Your Resources</h3>
                <p className='text-muted-foreground'>
                  Share your creations with the Minecraft community
                </p>
              </div>
              <Button asChild size='lg'>
                <Link href={'/dashboard/resources'}>Upload a Resource</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className='w-full border-t py-12 md:py-24 lg:py-32'>
          <div className='container px-4 md:px-6'>
            <div className='flex flex-col items-center justify-center space-y-4 text-center'>
              <div className='space-y-2'>
                <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
                  Ready to Get Started?
                </h2>
                <p className='max-w-[600px] text-muted-foreground md:text-xl'>
                  Join thousands of Minecraft enthusiasts on our platform today.
                </p>
              </div>
              <div className='flex flex-col gap-2 min-[400px]:flex-row'>
                <Button size='lg'>Create Account</Button>
                <Button variant='outline' size='lg'>
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
