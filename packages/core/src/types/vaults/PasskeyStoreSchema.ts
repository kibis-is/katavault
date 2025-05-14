/**
 * @property {string} credentialID - The hexadecimal encoded ID of the passkey credential.
 * @property {string} initializationVector - A hexadecimal encoded initialization vector used in the derivation of the
 * encryption key.
 * @property {string} salt - The hexadecimal encoded salt used in creation of the passkey.
 * @property {AuthenticatorTransport[]} transports - The transports of the passkey that were determined at creation.
 */
interface PasskeyStoreSchema {
  credentialID: string;
  initializationVector: string;
  salt: string;
  transports: AuthenticatorTransport[];
}

export default PasskeyStoreSchema;
