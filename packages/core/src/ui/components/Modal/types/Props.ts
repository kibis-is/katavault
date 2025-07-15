import type { VNode } from 'preact';

// types
import type { BaseComponentProps } from '@/ui/types';

export interface ComponentProps {
  body: VNode;
  closeButton?: boolean;
  closeOnEscape?: boolean;
  closeOnInteractOutside?: boolean;
  footer?: VNode;
  header?: VNode;
  onClose: () => void;
  open: boolean;
}

type Props = BaseComponentProps & ComponentProps;

export default Props;
