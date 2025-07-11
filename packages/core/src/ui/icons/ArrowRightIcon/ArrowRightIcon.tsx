import type { FunctionComponent } from 'preact';

// types
import type { IconProps } from '@/ui/types';

const ArrowRightIcon: FunctionComponent<IconProps> = ({
  color,
  ...svgProps
}) => (
  <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" {...svgProps}>
    <path
      d="M268 112l144 144-144 144M392 256H100"
      fill="none"
      stroke={color || '#000000'}
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="48"
    />
  </svg>
);

export default ArrowRightIcon;
