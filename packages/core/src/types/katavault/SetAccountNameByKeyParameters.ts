/**
 * @property {string} key - The public key, encoded with base58, of the account.
 * @property {string} name - The name to give the account.
 */
interface SetAccountNameByKeyParameters {
  key: string;
  name: string;
}

export default SetAccountNameByKeyParameters;
