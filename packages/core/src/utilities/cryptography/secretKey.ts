import { ed25519 } from '@noble/curves/ed25519';

/**
 * The secret key is the concatenation of a private key (32 byte) + the (uncompressed) public key.
 * @returns {Uint8Array} The secret key.
 */
export default function secretKey(privateKey: Uint8Array): Uint8Array {
  const publicKey = ed25519.getPublicKey(privateKey);
  const secretKey = new Uint8Array(privateKey.length + publicKey.length);

  secretKey.set(privateKey);
  secretKey.set(publicKey, privateKey.length);

  return secretKey;
}
