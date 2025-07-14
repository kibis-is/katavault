// types
import type { ConnectedAccountStoreItem } from '@/types';
import type { BaseComponentProps } from '@/ui/types';

interface ComponentProps {
  account: ConnectedAccountStoreItem;
}

type ConnectedAccountCardContentProps = BaseComponentProps & ComponentProps;

export default ConnectedAccountCardContentProps;
