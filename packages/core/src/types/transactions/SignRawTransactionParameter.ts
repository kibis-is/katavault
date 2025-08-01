/**
 * @property {string} accountKey - The base58 public key of the account that will be used for signing.
 * @property {string} chainID - The CAIP-002 chain ID.
 * @property {Uint8Array} transaction - The raw transaction data. This will be different for different chains.
 */
interface SignRawTransactionParameter {
  accountKey: string;
  chainID: string;
  transaction: Uint8Array;
}

export default SignRawTransactionParameter;
