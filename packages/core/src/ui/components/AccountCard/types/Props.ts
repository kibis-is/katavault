// types
import type { ConnectedAccountStoreItem, EphemeralAccountStoreItem } from '@/types';
import type { BaseComponentProps } from '@/ui/types';

interface ComponentProps {
  account: ConnectedAccountStoreItem | EphemeralAccountStoreItem;
}

type Props = BaseComponentProps & ComponentProps;

export default Props;
