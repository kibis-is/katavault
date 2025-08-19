import { CAIP002Namespace, type Chain } from '@kibisis/chains';

// types
import type { EphemeralAccountStoreItem, WithOptionalDelay } from '@/types';

interface Parameters<Namespace = CAIP002Namespace> {
  account: EphemeralAccountStoreItem;
  chain: Chain<Namespace>;
}
type BalanceParameters<Namespace = CAIP002Namespace> = WithOptionalDelay<Parameters<Namespace>>;

export default BalanceParameters;
