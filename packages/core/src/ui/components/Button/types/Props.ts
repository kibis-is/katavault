import type { JSX, VNode } from 'preact';

// types
import type { BaseComponentProps, IconProps, Sizes, Variants } from '@/ui/types';

interface ComponentProps {
  children: string;
  className?: string;
  fullWidth?: boolean;
  leftIcon?: VNode<IconProps>;
  rightIcon?: VNode<IconProps>;
  size?: Sizes;
  variant?: Variants;
}

type Props = Omit<JSX.HTMLAttributes<HTMLButtonElement>, 'children'> & BaseComponentProps & ComponentProps;

export default Props;
