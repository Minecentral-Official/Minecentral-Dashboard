import Image from 'next/image';
import Link from 'next/link';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import ResourceToggleLikeButton from '@/features/resources/components/resource/resource-toggle-like-button';
import { T_DTOResource } from '@/features/resources/types/t-dto-resource.type';

type PluginsTableResource = Pick<
  T_DTOResource,
  'id' | 'iconUrl' | 'title' | 'type' | 'slug'
>;

export function TableProjectsLiked({
  plugins: projects,
}: {
  plugins: PluginsTableResource[];
}) {
  return (
    <Table className='w-full'>
      <TableCaption>List of your liked resources.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className='w-[100px]'>Icon</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map((project) => (
          <TableRow key={project.id}>
            <TableCell className='font-medium'>
              <Link href={`/resources/${project.slug}`}>
                <Image
                  src={project.iconUrl || '/placeholder.png'}
                  alt='Resource Icon'
                  width={48}
                  height={48}
                  className='h-12 w-12 object-cover'
                />
              </Link>
            </TableCell>
            <TableCell className='grow font-medium'>
              <Link href={`/plugins/${project.slug}`}> {project.title}</Link>
            </TableCell>
            <TableCell>
              {project.type ?
                project.type.slice(0, 1).toUpperCase() + project.type.slice(1)
              : 'Project N/A'}
            </TableCell>
            <TableCell className='shrink-0 text-right'>
              <ResourceToggleLikeButton liked={true} resourceId={project.id} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
