import Image from 'next/image';

export function ResourceImage({
  url,
  size = 100,
}: {
  url: string;
  size?: number;
}) {
  return (
    <Image
      width={size}
      height={size}
      alt='Resource Icon'
      src={url || '/placeholder.png'}
      className={`h-[${size}px] w-[${size}px] rounded-md bg-gray-500 object-cover`}
    />
  );
}
