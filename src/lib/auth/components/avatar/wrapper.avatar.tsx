import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type WrapperAvatarProps = {
  image?: string;
  name: string;
};

export default function WrapperAvatar({ image, name }: WrapperAvatarProps) {
  return (
    <Avatar className='cursor-pointer'>
      <AvatarImage src={image} />
      <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
    </Avatar>
  );
}
