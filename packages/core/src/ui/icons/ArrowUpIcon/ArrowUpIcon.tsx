import type { FunctionComponent } from 'preact';

// types
import type { IconProps } from '@/ui/types';

const ArrowUpIcon: FunctionComponent<IconProps> = ({
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
      d="m5 12 7-7 7 7"
    />
    <path
      d="M12 19V5"
    />
  </svg>
);

export default ArrowUpIcon;
