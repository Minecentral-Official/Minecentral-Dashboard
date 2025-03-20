import Image from 'next/image';

export function ServerImage({
  url,
  width = 468,
  height = 60,
}: {
  url: string | null;
  width?: number;
  height?: number;
}) {
  return (
    <Image
      width={width}
      height={height}
      alt='Resource Icon'
      src={url || '/placeholder.png'}
      className={`h-[${height}px] w-[${width}px] rounded-md bg-gray-500 object-cover`}
    />
  );
}
