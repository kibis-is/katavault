// types
import type StackAlign from './StackAlign';
import type StackJustify from './StackJustify';
import type Sizes from './Sizes';

interface StackProps {
  align?: StackAlign;
  className?: string;
  direction?: 'horizontal' | 'vertical';
  fullWidth?: boolean;
  grow?: boolean;
  height?: number | string;
  justify?: StackJustify;
  maxHeight?: number | string;
  maxWidth?: number | string;
  minHeight?: number | string;
  minWidth?: number | string;
  padding?: number | string;
  paddingBottom?: number | string;
  paddingLeft?: number | string;
  paddingRight?: number | string;
  paddingTop?: number | string;
  paddingX?: number | string;
  paddingY?: number | string;
  spacing?: Sizes;
  width?: number | string;
}

export default StackProps;
