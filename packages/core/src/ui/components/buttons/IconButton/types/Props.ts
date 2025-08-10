import type { JSX, VNode } from 'preact';

// types
import type { BaseComponentProps, IconProps, Sizes } from '@/ui/types';

interface ComponentProps {
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  iconColor?: string;
  icon: VNode<IconProps>;
  size?: Sizes;
}

type Props = Omit<JSX.ButtonHTMLAttributes, 'icon'> & BaseComponentProps & ComponentProps;

export default Props;
