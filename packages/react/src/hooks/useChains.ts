import type { Chain, ChainWithNetworkParameters } from '@kibisis/chains';
import { BaseError } from '@kibisis/katavault-core';
import { useCallback, useContext, useEffect, useState } from 'react';

// contexts
import { KatavaultContext } from '@/contexts';

// errors
import { NotInitializedError } from '@/errors';

// types
import type { HookFunction, UseChainsState } from '@/types';

/**
 * Hook for getting the chains.
 * @returns {UseChainsState} The supported chains and functions to add/remove chains.
 */
export default function useChains(): UseChainsState {
  const { katavault, onUpdate, timestamp } = useContext(KatavaultContext);
  const [chains, setChains] = useState<ChainWithNetworkParameters[]>([]);
  // callbacks
  const addChain = useCallback<HookFunction<Chain, ChainWithNetworkParameters, BaseError>>(
    (params, options) => {
      (async () => {
        let chain: ChainWithNetworkParameters;

        if (!katavault) {
          return options?.onError?.(new NotInitializedError('katavault not initialized'), params);
        }

        try {
          chain = await katavault.addChain(params);

          if (onUpdate) {
            onUpdate();
          }

          options?.onSuccess?.(chain, params);
        } catch (error) {
          return options?.onError?.(error, params);
        }
      })();
    },
    [katavault, onUpdate]
  );
  const removeChainByGenesisHash = useCallback<HookFunction<string, undefined, BaseError>>(
    (params, options) => {
      (async () => {
        if (!katavault) {
          return options?.onError?.(new NotInitializedError('katavault not initialized'), params);
        }

        try {
          katavault.removeChainByGenesisHash(params);

          if (onUpdate) {
            onUpdate();
          }

          options?.onSuccess?.(undefined, params);
        } catch (error) {
          return options?.onError?.(error, params);
        }
      })();
    },
    [katavault, onUpdate]
  );

  // on update, get the chains
  useEffect(() => {
    if (!katavault) {
      return;
    }

    setChains(katavault.chains());
  }, [timestamp]);

  return {
    addChain,
    chains,
    removeChainByGenesisHash,
  };
}
