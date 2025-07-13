import type { FunctionComponent } from 'preact';

// types
import type { IconProps } from '@/ui/types';

const ArrowLeftIcon: FunctionComponent<IconProps> = ({
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
      d="m12 19-7-7 7-7"
    />
    <path
      d="M19 12H5"
    />
  </svg>
);

export default ArrowLeftIcon;
