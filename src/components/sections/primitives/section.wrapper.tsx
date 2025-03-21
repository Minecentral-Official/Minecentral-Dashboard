import { PropsWithChildren } from 'react';

export default function SectionWrapper({ children }: PropsWithChildren) {
  return (
    <div className='w-full py-20 lg:py-32'>
      <div className='container mx-auto'>{children}</div>
    </div>
  );
}
