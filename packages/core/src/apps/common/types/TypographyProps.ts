import type { JSX } from 'preact';

// types
import type BaseComponentProps from './BaseComponentProps';
import type Sizes from './Sizes';

interface TypographyProps extends BaseComponentProps {
  bold?: boolean;
  children: JSX.Element | string | JSX.Element[] | (JSX.Element | string)[];
  fullWidth?: boolean;
  textAlign?: 'left' | 'center' | 'right';
  size?: Sizes;
}

export default TypographyProps;
