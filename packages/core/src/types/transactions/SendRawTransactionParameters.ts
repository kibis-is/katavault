/**
 * @property {string} chainID - The CAIP-002 chain ID.
 * @property {Uint8Array} signature - The signature of the signed transaction. This will be different for different
 * chains.
 * @property {Uint8Array} transaction - The raw transaction data. This will be different for different chains.
 */
interface SendRawTransactionParameters {
  chainID: string;
  signature: Uint8Array;
  transaction: Uint8Array;
}

export default SendRawTransactionParameters;
