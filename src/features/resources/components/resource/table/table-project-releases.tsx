import { DownloadIcon } from 'lucide-react';
import Link from 'next/link';

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
import pluginGroupVersions from '@/features/resources/util/version-group.plugin';
import { resourceReleaseTable } from '@/lib/db/schema';

type ResourceReleasesTable = Pick<
  typeof resourceReleaseTable.$inferSelect,
  | 'title'
  | 'compatibleVersions'
  | 'createdAt'
  | 'downloads'
  | 'id'
  | 'fileUrl'
  | 'version'
>[];

export function TableProjectReleases({
  releases,
}: {
  releases: ResourceReleasesTable;
}) {
  return (
    <Table className='w-full'>
      <TableCaption>List of your liked resources.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Support Versions</TableHead>
          <TableHead>Published</TableHead>
          <TableHead>Downloads</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {releases.map((release) => (
          <TableRow key={release.id}>
            <TableCell className='font-medium'>{release.title}</TableCell>
            <TableCell className='grow font-medium'>
              {pluginGroupVersions(release.compatibleVersions).map(
                (version) => (
                  <Badge key={version}>{version}</Badge>
                ),
              )}
            </TableCell>
            <TableCell>{release.createdAt.toDateString()}</TableCell>
            <TableCell className='shrink-0 text-right'>
              {release.downloads}
            </TableCell>
            <TableCell className='shrink-0 text-right'>
              <Link href={`/api/download?rId=${release.id}`}>
                <DownloadIcon className='h-4 w-4' />
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
