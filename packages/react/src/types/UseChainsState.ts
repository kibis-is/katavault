import type { Chain, ChainWithNetworkParameters } from '@kibisis/chains';
import { BaseError } from '@kibisis/katavault-core';

// types
import type HookFunction from './HookFunction';

interface UseChainsState {
  addChain: HookFunction<Chain, ChainWithNetworkParameters, BaseError>;
  chains: ChainWithNetworkParameters[];
  removeChainByGenesisHash: HookFunction<string, undefined, BaseError>;
}

export default UseChainsState;
