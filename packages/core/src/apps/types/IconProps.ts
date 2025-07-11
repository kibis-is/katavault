import type { SVGProps } from 'preact/compat';

interface IIconProps {
  color?: string;
}

type IconProps = IIconProps & SVGProps<SVGSVGElement>;

export default IconProps;
