import type { Chain } from '@kibisis/chains';

// types
import type { ConnectedAccountStoreItem, EphemeralAccountStoreItem } from '@/types';
import type { BaseComponentProps } from '@/ui/types';

interface ComponentProps {
  account: ConnectedAccountStoreItem | EphemeralAccountStoreItem;
  chains: Chain[];
}

type Props = BaseComponentProps & ComponentProps;

export default Props;
