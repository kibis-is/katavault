import type { VNode } from 'preact';

// types
import type { IconProps } from '@/ui/types';

interface Props {
  children: string;
  fullWidth?: boolean;
  leftIcon?: VNode<IconProps>;
  rightIcon?: VNode<IconProps>;
}

export default Props;
