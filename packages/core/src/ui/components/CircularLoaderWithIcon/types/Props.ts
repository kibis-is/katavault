import type { VNode } from 'preact';

// types
import type { IconProps, Sizes } from '@/ui/types';

interface Props {
  color?: string;
  icon: VNode<IconProps>;
  size?: Sizes;
  trackColor?: string;
}

export default Props;
