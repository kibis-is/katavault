import type { FunctionComponent } from 'react';

// types
import type { IconProps } from '@/ui/types';

const InfoIcon: FunctionComponent<IconProps> = ({
  color,
  ...svgProps
}) => (
  <svg
    fill="none"
    stroke={color || 'currentColor'}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...svgProps}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </svg>
);

export default InfoIcon;
