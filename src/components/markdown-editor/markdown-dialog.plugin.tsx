import { Dispatch, SetStateAction, useState } from 'react';

import { ICommand } from '@uiw/react-markdown-editor';
import { ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

import { useMarkdown } from '@/components/markdown-editor/context/markdown.context';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

export function markdownCommandAddImage({
  setOpen,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
}): ICommand {
  return {
    name: 'Image',
    keyCommand: 'image',
    button: { 'aria-label': 'Insert Image' },
    icon: <ImageIcon className='h-4 w-4' />,
    execute: ({ state }) => {
      if (!state) return;
      setOpen(true);
    },
  };
}

const imageSchema = z.string().url();

export function MarkdownAddImageDialog() {
  const { setMarkdown, openImage, setOpenImage } = useMarkdown();
  const [url, setUrl] = useState('');
  return (
    <Dialog open={openImage} onOpenChange={setOpenImage}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Insert Image</DialogTitle>
        </DialogHeader>
        <Input
          type='text'
          placeholder='Paste image URL here'
          // value={imageUrl}
          onChange={(e) => setUrl(e.target.value)}
        />
        <DialogFooter>
          <Button
            onClick={() => {
              const parse = imageSchema.safeParse(url);
              if (parse.success) {
                setMarkdown((prev) => prev + `\n\n![Image](${url})\n\n`);
                setOpenImage(false);
              } else {
                toast.error('Invalid url, please paste a link', {
                  id: 'url_error',
                });
              }
            }}
          >
            Insert Image
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
