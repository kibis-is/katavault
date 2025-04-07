// types
import type { Encoding } from '@/types';

/**
 * @property {string} address - The address of the account to be used to sign the message.
 * @property {Encoding} encoding - [optional] The output encoding of the signature. If no encoding is specified, the
 * signature will be in raw bytes (Uint8Array).
 * @property {string | Uint8Array} message - A UTF-8 encoded message or raw bytes to sign.
 */
interface SignMessageParameters {
  address: string;
  encoding?: Encoding;
  message: string | Uint8Array;
}

export default SignMessageParameters;
