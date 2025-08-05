interface SendRawTransactionParameters {
  chainID: string;
  signature: Uint8Array;
  transaction: Uint8Array;
}

export default SendRawTransactionParameters;
