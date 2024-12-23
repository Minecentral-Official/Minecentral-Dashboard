import LogoMark from '@/components/logo-mark';
import { MinecentralServices } from '@/lib/types/services';

type LogoProps = {
  service: MinecentralServices;
};

export default function Logo({ service }: LogoProps) {
  const display = service.toUpperCase();
  return (
    <div className='flex items-center gap-2'>
      <LogoMark />
      <div className='flex flex-col -space-y-2'>
        <div className='-ml-1'>Minecentral</div>
        <div className='-ml-[5px] text-3xl font-black'>{display}</div>
      </div>
    </div>
  );
}
