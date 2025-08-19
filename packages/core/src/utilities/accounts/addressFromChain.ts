import { CAIP002Namespace } from '@kibisis/chains';
import { base58 } from '@kibisis/encoding';

// decorators
import { AVMAddress } from '@/decorators';

// errors
import { ChainNotSupportedError } from '@/errors';

// types
import type { Account, WithChain } from '@/types';

/**
 * Converts an account's public key to the specified chain's specific address.
 *
 * @param {WithChain<Record<'account', Account>>} params - The input parameters.
 * @param {Chain} params.chain - The chain.
 * @param {Account} params.account - The account to parse.
 * @returns {string} The address of the account for the specified chain.
 * @throws {ChainNotSupportedError} If the chain is not supported.
 */
export default function addressFromChain({ account, chain }: WithChain<Record<'account', Account>>): string {
  switch (chain.namespace()) {
    case CAIP002Namespace.Algorand:
    case CAIP002Namespace.AVM:
      return AVMAddress.fromPublicKey(base58.decode(account.key)).address();
    default:
      throw new ChainNotSupportedError(`namespace "${chain.namespace()}" not supported`);
  }
}
