import LogoMark from '@/components/logos/logo-mark';

export default function Logo() {
  return (
    <div className='flex items-center gap-2'>
      <LogoMark />
      <div className='-ml-1 text-3xl font-black'>Minecentral</div>
    </div>
  );
}
