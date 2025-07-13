// types
import type { ConnectedAccount, EphemeralAccount } from '@/types';
import type { BaseComponentProps } from '@/ui/types';

interface ComponentProps {
  account: ConnectedAccount | EphemeralAccount;
}

type Props = BaseComponentProps & ComponentProps;

export default Props;
