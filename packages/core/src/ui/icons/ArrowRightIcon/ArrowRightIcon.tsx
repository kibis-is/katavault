import type { FunctionComponent } from 'preact';

// types
import type { IconProps } from '@/ui/types';

const ArrowRightIcon: FunctionComponent<IconProps> = ({
  color,
  title,
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
    {title && <title>{title}</title>}
    <path
      d="M5 12h14"
    />
    <path
      d="m12 5 7 7-7 7"
    />
  </svg>
);

export default ArrowRightIcon;
