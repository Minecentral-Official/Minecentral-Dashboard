import { ClipboardCopyIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import CopyToClipboard from '@/components/etc/copy-to-clipboard';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TResourcePlugin } from '@/features/resource-plugin/types/plugin-all-data.type';

type PluginsTableResource = Pick<TResourcePlugin, 'id' | 'iconUrl' | 'title'>;

export function PluginsTable({ plugins }: { plugins: PluginsTableResource[] }) {
  return (
    <Table className='w-full'>
      <TableCaption>A list of your resources.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className='w-[100px]'>Icon</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Id</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {plugins.map((plugin) => (
          <TableRow key={plugin.id}>
            <TableCell className='font-medium'>
              <Link href={`/resources/${plugin.id}`}>
                <Image
                  src={plugin.iconUrl || '/placeholder.png'}
                  alt='Resource Icon'
                  width={48}
                  height={48}
                  className='h-12 w-12 object-cover'
                />
              </Link>
            </TableCell>
            <TableCell className='font-medium'>
              <Link href={`/resources/${plugin.id}`}> {plugin.title}</Link>
            </TableCell>
            <TableCell>
              <CopyToClipboard clipboardText={`${plugin.id}`}>
                <Badge>
                  {plugin.id} <ClipboardCopyIcon className='ml-2 h-3 w-3' />
                </Badge>
              </CopyToClipboard>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
