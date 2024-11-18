import LogoMark from '@/components/logo-mark';

export default function Logo() {
  return (
    <div className='flex gap-2 items-center'>
      <LogoMark />
      <div className='flex flex-col -mt-1 -space-y-2'>
        <div className='text-lg'>Minecentral</div>
        <div className='text-4xl font-black'>HOST</div>
      </div>
    </div>
  );
}
