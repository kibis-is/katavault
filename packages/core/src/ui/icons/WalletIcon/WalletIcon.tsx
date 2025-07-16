import type { FunctionComponent } from 'preact';

// types
import type { IconProps } from '@/ui/types';

const WalletIcon: FunctionComponent<IconProps> = ({
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
    <rect width="18" height="18" x="3" y="3" rx="2"></rect>
    <path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2"></path>
    <path d="M3 11h3c.8 0 1.6.3 2.1.9l1.1.9c1.6 1.6 4.1 1.6 5.7 0l1.1-.9c.5-.5 1.3-.9 2.1-.9H21"></path>
  </svg>
);

export default WalletIcon;
