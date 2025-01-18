'use client';

import { createContext, useContext } from 'react';

import {
  Archive,
  Box,
  Database,
  MemoryStick,
  SquareSplitVertical,
  Volleyball,
} from 'lucide-react';

import CopyToClipboard from '@/components/etc/copy-to-clipboard';
import {
  Card as ShadCard,
  CardFooter as ShadCardFooter,
  CardTitle as ShadCardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import ManageServerDropdown from '@/features/host/components/dropdown/manage-server.dropdown';
import IconWithDataDisplay from '@/features/host/components/etc/icon-with-data.display';

import type { PropsWithChildren } from 'react';

type CardContextType = {
  name: string;
  cpuThreads: number;
  ram: number;
  storage: number;
  databases: number;
  backups: number;
  splits: number;
  ip?: string;
  port?: number;
  id: number;
  uuid: string;
  plan: string;
};

type PterodactylServerCardProps = PropsWithChildren<CardContextType>;

const CardContext = createContext<CardContextType | null>(null);

function useCardContext() {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error(
      'Pterodactyl Card Components can only be used in its wrapper provider component',
    );
  }
  return context;
}

export default function PteroServerCard({
  children,
  ...serverData
}: PterodactylServerCardProps) {
  return (
    <CardContext.Provider value={serverData}>
      <ShadCard>{children}</ShadCard>
    </CardContext.Provider>
  );
}

export function PteroServerCardHeader({ children }: PropsWithChildren) {
  return <div className='flex justify-between'>{children}</div>;
}

export function PteroServerCardTitle() {
  const { name } = useCardContext();
  return <ShadCardTitle className='p-6 pb-1 pt-6'>{name}</ShadCardTitle>;
}

export function PteroServerCardDropdown() {
  const { id, uuid } = useCardContext();
  return (
    <div className='m-4 mb-0'>
      <ManageServerDropdown id={id} uuid={uuid} />
    </div>
  );
}

export function PteroServerCardDivider() {
  const { plan, ip, port } = useCardContext();
  return (
    <div className='mb-6 flex items-center gap-2'>
      <Separator className='w-4' />
      <span className='text-xs text-muted-foreground'>{plan}</span>

      <Separator className='flex-1' />
      <CopyToClipboard clipboardText={ip + ':' + port} asChild>
        <span className='cursor-pointer select-none rounded p-1 px-2 text-xs text-muted-foreground transition hover:bg-primary hover:text-primary-foreground'>
          {ip}:{port}
        </span>
      </CopyToClipboard>
      <Separator className='w-4' />
    </div>
  );
}

export function PteroServerCardFooter() {
  const { ram, cpuThreads, storage, databases, backups, splits } =
    useCardContext();
  return (
    <ShadCardFooter className='flex items-center justify-between'>
      <div className='flex gap-6'>
        <IconWithDataDisplay data={ram / 1024} icon={MemoryStick} name='RAM' />
        <IconWithDataDisplay
          data={cpuThreads / 100}
          icon={Volleyball}
          name='CPU Threads'
        />
        <IconWithDataDisplay data={storage / 1024} icon={Box} name='Storage' />
        <IconWithDataDisplay
          data={databases}
          icon={Database}
          name='Databases'
        />
        <IconWithDataDisplay data={backups} icon={Archive} name='Backups' />
        <IconWithDataDisplay
          data={splits}
          icon={SquareSplitVertical}
          name='Splits'
        />
      </div>
    </ShadCardFooter>
  );
}
