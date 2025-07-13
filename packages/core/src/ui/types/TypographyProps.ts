import type { JSX } from 'preact';

// types
import type Sizes from './Sizes';

interface TypographyProps {
  bold?: boolean;
  children: JSX.Element | string | JSX.Element[] | (JSX.Element | string)[];
  className?: string;
  color?: string;
  fullWidth?: boolean;
  italic?: boolean;
  height?: number | string;
  maxHeight?: number | string;
  maxWidth?: number | string;
  minHeight?: number | string;
  minWidth?: number | string;
  padding?: number | string;
  size?: Sizes;
  textAlign?: 'left' | 'center' | 'right';
  truncate?: boolean;
  width?: number | string;
}

export default TypographyProps;
