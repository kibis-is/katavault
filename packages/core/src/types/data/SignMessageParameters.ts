// types
import type { Encoding } from '@/types';

/**
 * @property {string} accountKey - The base58 public key of the account that will be used for signing.
 * @property {string} chainID - The CAIP-002 chain ID.
 * @property {Encoding} [encoding] - The output encoding of the signature. If no encoding is specified, the signature
 * will be as raw bytes (Uint8Array).
 * @property {string | Uint8Array} message - A UTF-8 encoded message or raw bytes to sign.
 */
interface SignMessageParameters {
  accountKey: string;
  chainID: string;
  encoding?: Encoding;
  message: string | Uint8Array;
}

export default SignMessageParameters;
