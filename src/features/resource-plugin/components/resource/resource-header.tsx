import DownloadButton from '@/features/resource-plugin/components/ui/download-button';
import { TResourcePlugin } from '@/features/resource-plugin/types/plugin-all-data.type';

export default function ResourceHeader({
  release,
}: Pick<TResourcePlugin, 'downloads' | 'release'>) {
  return (
    <DownloadButton
      downloadUrl={`/api/download/plugin?rId=${release?.downloadId}`}
    />
  );
}
