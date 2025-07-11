import type { FunctionComponent } from 'preact';

// types
import type { IconProps } from '@/apps/types';

const CloseIcon: FunctionComponent<IconProps> = ({ color, ...svgProps }) => (
  <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" {...svgProps}>
    <path
      d="M368 368L144 144M368 144L144 368"
      fill="none"
      stroke={color || '#000000'}
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="32"
    />
  </svg>
);

export default CloseIcon;
