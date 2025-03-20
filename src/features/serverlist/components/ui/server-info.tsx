'use client';

import { useState } from 'react';

import { Check, Copy, Users } from 'lucide-react';
import Image from 'next/image';
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
import { T_DTOServer } from '@/features/serverlist/types/t-dto-server.type';

export function ServerInfo({
  title,
  slug,
  iconUrl,
  ip,
  port,
}: Pick<T_DTOServer, 'title' | 'slug' | 'ip' | 'port' | 'iconUrl'>) {
  const [copied, setCopied] = useState(false);
  // const [isEditing, setIsEditing] = useState(false)
  // const [serverData, setServerData] = useState({
  //   title,
  //   bannerUrl,
  //   maxPlayers,
  //   ip,
  //   port,
  // })

  const copyServerAddress = () => {
    navigator.clipboard.writeText(`${ip}:${port}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // const handleSaveChanges = () => {
  //   // Here you would typically save changes to your backend
  //   console.log("Saving changes:", serverData)
  //   setIsEditing(false)
  // }

  return (
    <Card className='mx-auto w-full max-w-md overflow-hidden'>
      {/* Server Banner */}

      <Link href={`/serverlist/${slug}`}>
        <div className='relative h-[60px] w-full overflow-hidden'>
          <Image
            src={iconUrl || '/placeholder.png'}
            alt={`${title} banner`}
            className='h-full w-full object-cover'
            width={468}
            height={60}
          />

          {/* Player Count Badge */}
          <Badge
            variant={'default'}
            className='absolute right-2 top-2 flex items-center gap-1 py-1'
          >
            <Users size={14} />
            <span>
              {0}/{0}
            </span>
          </Badge>
        </div>
      </Link>

      <CardContent className='p-4'>
        <h3 className='mb-2 text-xl font-bold'>{title}</h3>

        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <span className='text-sm font-medium text-accent-foreground/60'>
              {ip}
              {port && <>{`:${port}`}</>}
            </span>
          </div>

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
      </CardContent>

      {/* {isAdmin && (
        <CardFooter className='border-t border-gray-200 bg-gray-50 p-2'>
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button
                variant='outline'
                size='sm'
                className='ml-auto flex items-center gap-1 border-gray-300'
              >
                <Edit size={14} />
                <span>Edit Server</span>
              </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-md'>
              <DialogHeader>
                <DialogTitle>Edit Server</DialogTitle>
              </DialogHeader>
              <div className='grid gap-4 py-4'>
                <div className='grid gap-2'>
                  <Label htmlFor='title'>Server Name</Label>
                  <Input
                    id='title'
                    value={serverData.title}
                    onChange={(e) =>
                      setServerData({ ...serverData, title: e.target.value })
                    }
                  />
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor='banner'>Banner URL</Label>
                  <Input
                    id='banner'
                    value={serverData.bannerUrl}
                    onChange={(e) =>
                      setServerData({
                        ...serverData,
                        bannerUrl: e.target.value,
                      })
                    }
                  />
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='grid gap-2'>
                    <Label htmlFor='ip'>IP Address</Label>
                    <Input
                      id='ip'
                      value={serverData.ip}
                      onChange={(e) =>
                        setServerData({ ...serverData, ip: e.target.value })
                      }
                    />
                  </div>
                  <div className='grid gap-2'>
                    <Label htmlFor='port'>Port</Label>
                    <Input
                      id='port'
                      type='number'
                      value={serverData.port}
                      onChange={(e) =>
                        setServerData({
                          ...serverData,
                          port: Number.parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor='maxPlayers'>Max Players</Label>
                  <Input
                    id='maxPlayers'
                    type='number'
                    value={serverData.maxPlayers}
                    onChange={(e) =>
                      setServerData({
                        ...serverData,
                        maxPlayers: Number.parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <div className='flex justify-end'>
                <Button onClick={handleSaveChanges}>Save Changes</Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardFooter>
      )} */}
    </Card>
  );
}
