import type { Chain } from '@kibisis/chains';

// types
import type { EphemeralAccountStoreItem } from '@/types';
import type { BaseComponentProps } from '@/ui/types';

interface ComponentProps {
  account: EphemeralAccountStoreItem;
  chains: Chain[];
}

type EphemeralAccountCardContentProps = BaseComponentProps & ComponentProps;

export default EphemeralAccountCardContentProps;
