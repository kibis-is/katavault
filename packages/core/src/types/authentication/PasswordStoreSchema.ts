/**
 * @property {string} challenge - The encrypted challenge encoded with base64.
 * @property {string} lastUsedAt - A timestamp, in milliseconds, for when the password was last used.
 */
interface PasswordStoreSchema {
  challenge: string;
  lastUsedAt: string;
}

export default PasswordStoreSchema;
