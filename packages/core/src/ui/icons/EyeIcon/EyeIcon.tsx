import type { FunctionComponent } from 'preact';

// types
import type { IconProps } from '@/ui/types';

const EyeIcon: FunctionComponent<IconProps> = ({
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
    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export default EyeIcon;
