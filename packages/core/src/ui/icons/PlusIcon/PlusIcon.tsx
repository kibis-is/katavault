import type { FunctionComponent } from 'preact';

// types
import type { IconProps } from '@/ui/types';

const PlusIcon: FunctionComponent<IconProps> = ({
  color = '#000000',
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
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

export default PlusIcon;
