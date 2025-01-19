import type { PropsWithChildren } from 'react';

export default function PteroServerCardHeader({ children }: PropsWithChildren) {
  return <div className='flex justify-between'>{children}</div>;
}
