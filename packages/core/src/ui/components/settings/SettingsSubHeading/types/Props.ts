import { type JSX, type VNode } from 'preact';

// types
import type { BaseComponentProps, IconProps } from '@/ui/types';

interface ComponentProps {
  children: JSX.Element | string | JSX.Element[] | (JSX.Element | string)[];
  color?: string;
  icon?: VNode<IconProps>;
}

type Props = BaseComponentProps & ComponentProps;

export default Props;
