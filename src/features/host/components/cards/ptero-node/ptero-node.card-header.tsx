import type { PropsWithChildren } from 'react';

export default function PteroNodeCardHeader({ children }: PropsWithChildren) {
  return <div className='flex justify-between'>{children}</div>;
}
