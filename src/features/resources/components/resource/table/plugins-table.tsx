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
import { TResourcePlugin } from '@/features/resources/types/t-dto-resource-with-releases.type';

type PluginsTableResource = Pick<
  TResourcePlugin,
  'id' | 'iconUrl' | 'title' | 'status'
>;

export function ProjectsUserTable({
  plugins: projects,
}: {
  plugins: PluginsTableResource[];
}) {
  return (
    <Table className='w-full'>
      <TableCaption>A list of your resources.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className='w-[100px]'>Icon</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Id</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map((project) => (
          <TableRow key={project.id}>
            <TableCell className='font-medium'>
              <Link href={`/resources/${project.id}`}>
                <Image
                  src={project.iconUrl || '/placeholder.png'}
                  alt='Resource Icon'
                  width={48}
                  height={48}
                  className='h-12 w-12 object-cover'
                />
              </Link>
            </TableCell>
            <TableCell className='font-medium'>
              <Link href={`/resources/${project.id}`}> {project.title}</Link>
            </TableCell>
            <TableCell>
              <CopyToClipboard clipboardText={`${project.id}`}>
                <Badge>
                  {project.id} <ClipboardCopyIcon className='ml-2 h-3 w-3' />
                </Badge>
              </CopyToClipboard>
            </TableCell>
            <TableCell>
              {project. ?
                project.status.slice(0, 1).toUpperCase() +
                project.status.slice(1)
              : 'Draft'}
            </TableCell>
            <TableCell>
              {project.status ?
                project.status.slice(0, 1).toUpperCase() +
                project.status.slice(1)
              : 'Draft'}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
