// types
import type { BaseComponentProps } from '@/ui/types';

interface ComponentProps {
  subtitle?: string;
  title: string;
  value?: string | number;
}

type Props = BaseComponentProps & ComponentProps;

export default Props;
