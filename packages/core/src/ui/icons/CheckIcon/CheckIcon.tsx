import type { FunctionComponent } from 'preact';

// types
import type { IconProps } from '@/ui/types';

const CheckIcon: FunctionComponent<IconProps> = ({
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
    <path d="M20 6 9 17l-5-5"></path>
  </svg>
);

export default CheckIcon;
