import { notFound } from 'next/navigation';
import { CopyIcon, VoteIcon } from 'lucide-react';

import CopyToClipboard from '@/components/etc/copy-to-clipboard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ServerImage } from '@/features/serverlist/components/ui/server-image';
import { ServerVoteButton } from '@/features/serverlist/components/ui/server-vote-button';
import { serverGetBySlug } from '@/features/serverlist/queries/server-by-slug.get';
import compactNumber from '@/lib/utils/compact-number';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const server = await serverGetBySlug(slug, true);

  if (!server) notFound();

  return (
    <main className='mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8'>
      <section className='flex flex-col gap-4'>
        <ServerImage title={server.title} url={server.iconUrl} />
        <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
          <div>
            <h1 className='text-3xl font-semibold'>{server.title}</h1>
            <p className='mt-2 max-w-3xl text-muted-foreground'>
              {server.description}
            </p>
          </div>
          <div className='flex flex-wrap gap-2'>
            <Badge variant='secondary'>
              <VoteIcon className='mr-1 h-3 w-3' />
              {compactNumber(server.votes)} votes
            </Badge>
            <ServerVoteButton
              serverId={server.id}
              requiresUsername={server.votifier?.enabled === true}
            />
          </div>
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Connect</CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <code className='rounded-md bg-secondary px-3 py-2 text-sm'>
            {server.ip}:{server.port}
          </code>
          <CopyToClipboard clipboardText={`${server.ip}:${server.port}`} asChild>
            <Button variant='outline'>
              <CopyIcon className='h-4 w-4' />
              Copy address
            </Button>
          </CopyToClipboard>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Server info</CardTitle>
        </CardHeader>
        <CardContent className='grid gap-4 sm:grid-cols-2'>
          <div>
            <h2 className='text-sm font-semibold'>Game modes</h2>
            <div className='mt-2 flex flex-wrap gap-2'>
              {server.categories?.map((category) => (
                <Badge key={category} variant='outline'>
                  {category}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <h2 className='text-sm font-semibold'>Platforms</h2>
            <div className='mt-2 flex flex-wrap gap-2'>
              {server.platforms?.map((platform) => (
                <Badge key={platform} variant='outline'>
                  {platform}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <h2 className='text-sm font-semibold'>Owner</h2>
            <p className='mt-2 text-sm text-muted-foreground'>
              {server.author.name}
            </p>
          </div>
          {server.linkDiscord && (
            <div>
              <h2 className='text-sm font-semibold'>Discord</h2>
              <a
                href={server.linkDiscord}
                className='mt-2 block text-sm text-primary hover:underline'
              >
                Join Discord
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
