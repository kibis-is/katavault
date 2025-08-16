import { type VNode } from 'preact';

// types
import type { BaseComponentProps } from '@/ui/types';

interface ComponentProps {
  item: VNode;
  subtitle?: string;
  title: string;
}

type Props = BaseComponentProps & ComponentProps;

export default Props;
