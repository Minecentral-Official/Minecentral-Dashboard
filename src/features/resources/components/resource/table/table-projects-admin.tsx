import { ClipboardCopyIcon, SettingsIcon } from 'lucide-react';
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
import ButtonTooltip from '@/components/ui/tooltip-button';
import { ResourceImage } from '@/features/resources/components/ui/resource-image';
import { T_DTOResource } from '@/features/resources/types/t-dto-resource.type';
import { getResourceUrl } from '@/features/resources/util/get-resource-url';

type PluginsTableResource = Pick<
  T_DTOResource,
  'id' | 'iconUrl' | 'title' | 'status' | 'type' | 'slug'
>;

export function TableProjectsAdmin({
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
              <Link href={`/${getResourceUrl(project.type)}/${project.slug}`}>
                <ResourceImage
                  url={project.iconUrl || '/placeholder.png'}
                  size={48}
                />
              </Link>
            </TableCell>
            <TableCell className='grow font-medium'>
              <Link href={`/${getResourceUrl(project.type)}/${project.slug}`}>
                {project.title}
              </Link>
            </TableCell>
            <TableCell>
              <CopyToClipboard clipboardText={`${project.id}`}>
                <Badge>
                  {project.id} <ClipboardCopyIcon className='ml-2 h-3 w-3' />
                </Badge>
              </CopyToClipboard>
            </TableCell>
            <TableCell>
              {project.type ?
                project.type.slice(0, 1).toUpperCase() + project.type.slice(1)
              : 'Project N/A'}
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  project.status === 'pending' ? 'destructive'
                  : project.status === 'accepted' ?
                    'default'
                  : 'secondary'
                }
              >
                {project.status.slice(0, 1).toUpperCase() +
                  project.status.slice(1)}
              </Badge>
            </TableCell>
            <TableCell className='shrink-0 text-right'>
              <Link href={`/dashboard/resources/${project.slug}`}>
                <ButtonTooltip Icon={SettingsIcon} tooltip='Settings' />
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
