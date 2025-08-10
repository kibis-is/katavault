/**
 * @property {string} credentialID - The ID of the passkey credential encoded with base64.
 * @property {string} initializationVector - An initialization vector, encoded with base64, used in the derivation of
 * the encryption key.
 * @property {string} salt - The salt, encoded with base64, used in creation of the passkey.
 * @property {AuthenticatorTransport[]} transports - The transports of the passkey that were determined at creation.
 */
interface PasskeyStoreSchema {
  credentialID: string;
  initializationVector: string;
  salt: string;
  transports: AuthenticatorTransport[];
}

export default PasskeyStoreSchema;
