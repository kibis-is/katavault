import { ed25519 } from '@noble/curves/ed25519';

/**
 * Generates an Ed21559 private key.
 *
 * @returns {Uint8Array} A Ed21559 private key.
 */
export default function generatePrivateKey(): Uint8Array {
  return ed25519.utils.randomPrivateKey();
}
