import { PhoneCall } from 'lucide-react';

import SectionWrapper from '@/components/sections/primitives/section.wrapper';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const PricingFaqSection = () => (
  <SectionWrapper>
    <div className='grid gap-10 lg:grid-cols-2'>
      <div className='flex flex-col gap-10'>
        <div className='flex flex-col gap-4'>
          <div>
            <Badge variant='outline'>FAQ</Badge>
          </div>
          <div className='flex flex-col gap-2'>
            <h4 className='font-regular max-w-xl text-left text-3xl tracking-tighter md:text-5xl'>
              This is the start of something new
            </h4>
            <p className='max-w-xl text-left text-lg leading-relaxed tracking-tight text-muted-foreground lg:max-w-lg'>
              Managing a small business today is already tough. Avoid further
              complications by ditching outdated, tedious trade methods. Our
              goal is to streamline SMB trade, making it easier and faster than
              ever.
            </p>
          </div>
          <div className=''>
            <Button className='gap-4' variant='outline'>
              Any questions? Reach out <PhoneCall className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </div>
      <Accordion type='single' collapsible className='w-full'>
        {Array.from({ length: 8 }).map((_, index) => (
          <AccordionItem key={index} value={'index-' + index}>
            <AccordionTrigger>
              This is the start of something new
            </AccordionTrigger>
            <AccordionContent>
              Managing a small business today is already tough. Avoid further
              complications by ditching outdated, tedious trade methods. Our
              goal is to streamline SMB trade, making it easier and faster than
              ever.
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </SectionWrapper>
);
