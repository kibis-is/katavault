import { hex, utf8 } from '@kibisis/encoding';

// constants
import { IDB_DB_NAME_PREFIX } from '@/constants';

// types
import type { Vault } from '@/types';

/**
 * Extracts and decodes a username from the given vault object.
 * @param {Vault} vault The vault object containing the encoded username.
 * @return {string} The decoded username.
 */
export default function usernameFromVault(vault: Vault): string {
  return utf8.encode(hex.decode(vault.name.replace(`${IDB_DB_NAME_PREFIX}_`, '')));
}
