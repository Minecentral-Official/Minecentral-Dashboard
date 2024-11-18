import { SVGProps } from 'react';

export default function LogoMark({
  width = 64,
  height = 64,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 100 100' // Set the viewBox for proper scaling
      width={width} // Use the width prop
      height={height} // Use the height prop
      fill='none'
      {...props}
    >
      <g clipPath='url(#a)'>
        <path
          fill='#000'
          fillRule='evenodd'
          d='M30 0C13.431 0 0 13.431 0 30v40c0 16.569 13.431 30 30 30h40c16.569 0 30-13.431 30-30V30c0-16.569-13.431-30-30-30H30Zm3.667 17C24.462 17 17 24.462 17 33.667v32.666C17 75.538 24.462 83 33.667 83A3.333 3.333 0 0 0 37 79.667V20.333A3.333 3.333 0 0 0 33.667 17ZM42 66.333A3.333 3.333 0 0 1 45.333 63h21C75.538 63 83 70.462 83 79.667A3.333 3.333 0 0 1 79.667 83h-21C49.462 83 42 75.538 42 66.333ZM62.5 58C73.822 58 83 48.822 83 37.5S73.822 17 62.5 17 42 26.178 42 37.5 51.178 58 62.5 58Z'
          clipRule='evenodd'
        />
      </g>
      <defs>
        <clipPath id='a'>
          <path fill='#fff' d='M0 0h100v100H0z' />
        </clipPath>
      </defs>
    </svg>
  );
}
