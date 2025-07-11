import type { FunctionComponent } from 'preact';

// types
import type { IconProps } from '@/apps/types';

const SunnyIcon: FunctionComponent<IconProps> = ({ color, ...svgProps }) => {
  const _color = color || '#000000';

  return (
    <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" {...svgProps}>
      <path
        d="M256 48v48M256 416v48M403.08 108.92l-33.94 33.94M142.86 369.14l-33.94 33.94M464 256h-48M96 256H48M403.08 403.08l-33.94-33.94M142.86 142.86l-33.94-33.94"
        fill="none"
        stroke={_color}
        stroke-linecap="round"
        stroke-miterlimit="10"
        stroke-width="32"
      />
      <circle
        fill="none"
        cx="256"
        cy="256"
        r="80"
        stroke={_color}
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-width="32"
      />
    </svg>
  );
};

export default SunnyIcon;
