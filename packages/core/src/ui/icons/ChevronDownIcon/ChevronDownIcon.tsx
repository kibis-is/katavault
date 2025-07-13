import type { FunctionComponent } from 'preact';

// types
import type { IconProps } from '@/ui/types';

const ChevronDownIcon: FunctionComponent<IconProps> = ({
  color = '#000000',
  title,
  ...svgProps
}) => (
  <svg
    fill="none"
    stroke={color}
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...svgProps}
  >
    {title && <title>{title}</title>}
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export default ChevronDownIcon;
