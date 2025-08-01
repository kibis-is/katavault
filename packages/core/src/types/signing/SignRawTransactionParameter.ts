/**
 * @property {string} accountID - The account ID that will be used for signing. This will be the base58 encoded public
 * key of the account.
 * @property {string} chainID - The CAIP-002 chain ID.
 * @property {Uint8Array} transaction - The raw transaction data. This will be different for different chains.
 */
interface SignRawTransactionParameter {
  accountID: string;
  chainID: string;
  transaction: Uint8Array;
}

export default SignRawTransactionParameter;
