/**
 * @property {string} name - [optional] A human-readable name for the account.
 * @property {string} seed - A hexadecimal-encoded private key or mnemonic (25-word) seed phrase.
 */
interface CreateProviderAccountSeedParameters {
  name?: string;
  seed: string;
}

export default CreateProviderAccountSeedParameters;
