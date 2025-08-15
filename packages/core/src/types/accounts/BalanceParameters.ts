import { Chain } from '@kibisis/chains';

// types
import type { EphemeralAccountStoreItem, WithOptionalDelay } from '@/types';

interface Parameters {
  account: EphemeralAccountStoreItem;
  chain: Chain;
}
type BalanceParameters = WithOptionalDelay<Parameters>;

export default BalanceParameters;
