import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type WrapperAvatarProps = {
  imageUrl?: string | null;
  name: string;
};

export default function WrapperAvatar({
  imageUrl: image,
  name,
}: WrapperAvatarProps) {
  return (
    <Avatar className='cursor-pointer'>
      <AvatarImage src={image ?? undefined} />
      <AvatarFallback>{`${name.charAt(0).toUpperCase()}${name.charAt(1).toUpperCase()}`}</AvatarFallback>
    </Avatar>
  );
}
