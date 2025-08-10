// types
import type { WalletConnection } from '@/types';
import type { BaseComponentProps } from '@/ui/types';

interface ComponentProps {
  connection: WalletConnection;
  onClick: () => void;
}

type Props = BaseComponentProps & ComponentProps;

export default Props;
