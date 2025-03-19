/**
 * @property {boolean} debug - [optional] Whether to log debug messages. Defaults to `false`.
 * @property {string[]} seeds - [optional] A set of hexadecimal-encoded private keys or mnemonic (25-word) seed phrases
 * to initialize the wallet with. If any of the seeds are invalid, they are omitted. If this parameter is omitted, the
 * wallet is initialized with a randomly generated account.
 */
interface CreateProviderParameters {
  debug?: boolean;
  seeds?: string[];
}

export default CreateProviderParameters;
