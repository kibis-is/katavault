import type { JSX } from 'preact';

// types
import type Sizes from './Sizes';

interface TypographyProps {
  bold?: boolean;
  color?: string;
  italic?: boolean;
  children: JSX.Element | string | JSX.Element[] | (JSX.Element | string)[];
  fullWidth?: boolean;
  textAlign?: 'left' | 'center' | 'right';
  size?: Sizes;
}

export default TypographyProps;
