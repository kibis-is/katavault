/**
 * @property {string} challenge - The hex encoded encrypted challenge.
 * @property {string} lastUsedAt - A timestamp, in milliseconds, for when the password was last used.
 */
interface PasswordStoreSchema {
  challenge: string;
  lastUsedAt: string;
}

export default PasswordStoreSchema;
