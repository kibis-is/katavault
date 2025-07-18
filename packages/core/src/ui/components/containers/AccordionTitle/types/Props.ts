import type { VNode } from 'preact';

// types
import type { BaseComponentProps, IconProps } from '@/ui/types';

interface ComponentProps {
  icon?: VNode<IconProps>;
  title: string;
}

type Props = BaseComponentProps & ComponentProps;

export default Props;
