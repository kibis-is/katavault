import { hex, utf8 } from '@kibisis/encoding';

// constants
import { IDB_DB_NAME_PREFIX } from '@/constants';

/**
 * Generates the vault name from the username.
 *
 * The vault name is derived from `katavault_<hex(username)>`.
 *
 * @param {string} username - The username.
 * @returns {string} The vault name.
 */
export default function vaultName(username: string): string {
  return `${IDB_DB_NAME_PREFIX}_${hex.encode(utf8.decode(username))}`;
}
