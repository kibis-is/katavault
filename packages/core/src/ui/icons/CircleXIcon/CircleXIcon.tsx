import type { FunctionComponent } from 'preact';

// types
import type { IconProps } from '@/ui/types';

const CircleXIcon: FunctionComponent<IconProps> = ({
  color,
  ...svgProps
}) => (
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
    <circle cx="12" cy="12" r="10"/>
    <path d="m15 9-6 6"/>
    <path d="m9 9 6 6"/>
  </svg>
);

export default CircleXIcon;
