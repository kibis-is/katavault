import type { FunctionComponent } from 'preact';

// types
import type { IconProps } from '@/ui/types';

const RotateIcon: FunctionComponent<IconProps> = ({ color, ...svgProps }) => (
  <svg
    fill="none"
    stroke={color || '#000000'}
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...svgProps}
  >
    <path
      d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"
    />
    <path
      d="M21 3v5h-5"
    />
  </svg>
);

export default RotateIcon;
