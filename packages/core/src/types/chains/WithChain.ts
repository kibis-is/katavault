import type { Chain } from '@kibisis/chains';

type WithChain<Item, ChainType = Chain> = Item & Record<'chain', ChainType>;

export default WithChain;
