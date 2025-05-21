/**
 * @property {Uint8Array} hostname - The hostname of the client i.e., example.com.
 * @property {string} password - A high-entropy password (ideally 128-bits - 7 UTF-8 characters) used to derive the
 * private key.
 * @property {string} username - A globally unique identifier for the user. This could be, for example, an email address.
 */
interface PrivateKeyFromPasswordCredentialsParameters {
  hostname: string;
  password: string;
  username: string;
}

export default PrivateKeyFromPasswordCredentialsParameters;
