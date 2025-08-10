import type { JSX, VNode } from 'preact';

// components
import { Props as IconButtonProps } from '@/ui/components/buttons/IconButton';

// types
import type { BaseComponentProps } from '@/ui/types';

interface ComponentsProps {
  error?: string;
  hint?: string;
  label?: string;
  rightButton?: VNode<IconButtonProps>;
}

type Props = JSX.InputHTMLAttributes & BaseComponentProps & ComponentsProps;

export default Props;
