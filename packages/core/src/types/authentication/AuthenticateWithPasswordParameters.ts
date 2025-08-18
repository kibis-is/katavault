/**
 * @property {string} password - The password used to encrypt the account private keys.
 * @property {string} username - A globally unique identifier for the user. This could be, for example, an email address.
 */
interface AuthenticateWithPasswordParameters {
  password: string;
  username: string;
}

export default AuthenticateWithPasswordParameters;
