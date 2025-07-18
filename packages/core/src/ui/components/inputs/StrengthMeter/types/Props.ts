// types
import type { BaseComponentProps } from '@/ui/types';

interface ComponentProps {
  score: number;
}

type Props = BaseComponentProps & ComponentProps;

export default Props;
