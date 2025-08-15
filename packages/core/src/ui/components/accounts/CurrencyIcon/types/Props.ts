import type { Chain } from '@kibisis/chains';

// types
import type { BaseComponentProps, Sizes } from '@/ui/types';

interface ComponentProps {
  className?: string;
  chain: Chain;
  color?: string;
  size?: Sizes;
}

type Props = BaseComponentProps & ComponentProps;

export default Props;
