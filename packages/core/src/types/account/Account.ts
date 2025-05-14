/**
 * @property {string} _id - A unique UUID v4 identifier. For internal use only.
 * @property {string} address - The address of the account.
 * @property {string} name - [optional] The name of the account.
 */
interface Account {
  _id: string;
  address: string;
  name?: string;
}

export default Account;
