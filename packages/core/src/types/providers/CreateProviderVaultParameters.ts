/**
 * @property {string} nonce - [optional] A random nonce that will be used to verify credentials.
 * @property {string} password - The main vault password. This will be used to unlock the vault.
 * @property {string} timeout - [optional] The timeout, in seconds to lock the vault. Defaults to 120 seconds (2 minutes).
 */
interface CreateProviderVaultParameters {
  nonce?: string;
  password: string;
  timeout?: number;
}

export default CreateProviderVaultParameters;
