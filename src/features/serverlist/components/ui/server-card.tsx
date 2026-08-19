'use client';

import { useState } from 'react';

import { Check, Copy, ExternalLinkIcon, VoteIcon } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ServerImage } from '@/features/serverlist/components/ui/server-image';
import { ServerVoteButton } from '@/features/serverlist/components/ui/server-vote-button';
import { T_DTOServer } from '@/features/serverlist/types/t-dto-server.type';
import compactNumber from '@/lib/utils/compact-number';

export function ServerCard({
  id,
  title,
  slug,
  iconUrl,
  ip,
  port,
  description,
  categories,
  platforms,
  votes,
  votifier,
  showVote = true,
}: Pick<
  T_DTOServer,
  | 'id'
  | 'title'
  | 'slug'
  | 'ip'
  | 'port'
  | 'iconUrl'
  | 'description'
  | 'categories'
  | 'platforms'
> & {
  votes?: number;
  votifier?: { enabled: boolean };
  showVote?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const copyServerAddress = () => {
    navigator.clipboard.writeText(`${ip}:${port}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className='w-full overflow-hidden rounded-md'>
      <CardContent className='grid gap-4 p-4 md:grid-cols-[220px_1fr_auto] md:items-center'>
        <Link href={`/serverlist/${slug}`} className='block'>
          <ServerImage title={title} url={iconUrl || '/placeholder.png'} />
        </Link>
        <div className='min-w-0 space-y-2'>
          <div className='flex flex-wrap items-center gap-2'>
            <Link
              href={`/serverlist/${slug}`}
              className='text-lg font-semibold hover:text-primary'
            >
              {title}
            </Link>
            <Badge variant='secondary'>
              <VoteIcon className='mr-1 h-3 w-3' />
              {compactNumber(votes ?? 0)}
            </Badge>
          </div>
          {description && (
            <p className='line-clamp-2 text-sm text-muted-foreground'>
              {description}
            </p>
          )}
          <div className='flex flex-wrap gap-1'>
            {[...(categories ?? []), ...(platforms ?? [])]
              .slice(0, 8)
              .map((tag) => (
                <Badge key={tag} variant='outline' className='capitalize'>
                  {tag}
                </Badge>
              ))}
          </div>
          <div className='flex items-center gap-2 text-sm font-medium text-accent-foreground/70'>
            <span className='truncate'>
              {ip}
              {port && <>{`:${port}`}</>}
            </span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='outline'
                    size='sm'
                    className='h-8 px-2'
                    onClick={copyServerAddress}
                  >
                    {copied ?
                      <Check size={16} />
                    : <Copy size={16} />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{copied ? 'Copied!' : 'Copy IP address'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className='flex flex-row gap-2 md:flex-col'>
          {showVote && (
            <ServerVoteButton
              serverId={id}
              requiresUsername={votifier?.enabled === true}
            />
          )}
          <Button variant='outline' size='sm' asChild>
            <Link href={`/serverlist/${slug}`}>
              <ExternalLinkIcon className='h-4 w-4' />
              Details
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
