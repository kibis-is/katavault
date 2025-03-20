/**
 * @property {string} name - [optional] The human-readable name for the account.
 * @property {string} privateKey - [optional] The hexadecimal-encoded private key for the account.
 */
interface Account {
  name?: string;
  privateKey: string;
}

export default Account;
