import { BookmarkIcon, HeartIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import DownloadButton from '@/features/resource-plugin/components/ui/download-button';
import { TResourcePlugin } from '@/features/resource-plugin/types/plugin-all-data.type';

export default function ResourceHotButtons({
  release,
}: Pick<TResourcePlugin, 'title' | 'downloads' | 'release'>) {
  return (
    <div className='flex flex-row gap-4'>
      <DownloadButton
        downloadUrl={`/api/download/plugin?rId=${release?.downloadId}`}
      />
      <Button>
        <HeartIcon className='h-5 w-5' />
      </Button>
      <Button>
        <BookmarkIcon className='h-5 w-5' />
      </Button>
    </div>
  );
}
