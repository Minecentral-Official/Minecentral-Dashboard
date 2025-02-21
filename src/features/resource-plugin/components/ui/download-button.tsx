'use client';

import { useState } from 'react';

import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function DownloadButton({
  downloadUrl,
}: {
  downloadUrl: string;
}) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); // Prevent default navigation
    setIsDownloading(true);
    try {
      // Create a hidden iframe to trigger the download
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      iframe.src = downloadUrl;

      // Remove the iframe after a short delay
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 5000); // Adjust this timeout as needed

      // You can add additional logic here to track the download attempt
      //   console.log('Download initiated');
    } catch (error) {
      //   console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button className='w-full' disabled={isDownloading} asChild>
      <Link href={downloadUrl} onClick={handleDownload}>
        {isDownloading ? 'Downloading...' : 'Download'}
      </Link>
    </Button>
  );
}
