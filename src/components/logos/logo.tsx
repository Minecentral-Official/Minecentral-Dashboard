import LogoMark from '@/components/logos/logo-mark';
import { MinecentralServices } from '@/lib/types/minecentral-services.type';

type LogoProps = {
  service?: MinecentralServices | 'services';
};

export default function Logo({ service }: LogoProps) {
  const serviceDisplay = service?.toUpperCase();

  return (
    <div className='flex items-center gap-2'>
      <LogoMark />
      <div className='flex flex-col -space-y-2'>
        <div className='-ml-1 text-2xl'>Minecentral</div>
        <div className='-ml-[5px] text-2xl font-black'>{serviceDisplay}</div>
      </div>
    </div>
  );
}
