import type { JSX, VNode } from 'preact';

// types
import type { BaseComponentProps, IconProps, Sizes } from '@/ui/types';

interface ComponentProps {
  icon: VNode<IconProps>;
  size?: Sizes;
}

type Props = Omit<JSX.HTMLAttributes<HTMLButtonElement>, 'icon'> & BaseComponentProps & ComponentProps;

export default Props;
