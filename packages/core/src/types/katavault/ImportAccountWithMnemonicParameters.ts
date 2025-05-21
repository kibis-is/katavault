import type ImportAccountParameters from './ImportAccountParameters';

/**
 * @property {string} mnemonic - A whitespace or comma separated 25-word mnemonic seed phrase containing BIP-039 words.
 * @property {string} name - [optional] The name of the account.
 */
interface ImportAccountWithMnemonicParameters extends ImportAccountParameters {
  mnemonic: string;
}

export default ImportAccountWithMnemonicParameters;
