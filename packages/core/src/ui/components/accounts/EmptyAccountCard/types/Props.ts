import type { VNode } from 'preact';

// types
import type { BaseComponentProps, IconProps } from '@/ui/types';

interface ComponentProps {
  icon?: VNode<IconProps>;
  onClick?: () => void;
  text: string;
}

type Props = BaseComponentProps & ComponentProps;

export default Props;
