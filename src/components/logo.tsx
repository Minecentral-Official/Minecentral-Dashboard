import LogoMark from '@/components/logo-mark';

type LogoProps = {
  service: 'host' | 'plugins' | 'servers';
};

export default function Logo({ service }: LogoProps) {
  const display = service.toUpperCase();
  return (
    <div className='flex gap-2 items-center'>
      <LogoMark />
      <div className='flex flex-col -space-y-2'>
        <div className='-ml-1'>Minecentral</div>
        <div className='text-3xl font-black -ml-[5px]'>{display}</div>
      </div>
    </div>
  );
}
