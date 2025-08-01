import type { Chain } from '@kibisis/chains';

type WithChain<Item> = Item & Record<'chain', Chain>;

export default WithChain;
