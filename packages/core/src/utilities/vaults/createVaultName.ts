// constants
import { IDB_DB_NAME_PREFIX } from '@/constants';

// utilities
import { bytesToHex, utf8ToBytes } from '@/utilities';

/**
 * Creates a vault name based on the username.
 *
 * Example:
 *  - "katavault_[hex(username)]"
 * @param {string} username - The username.
 * @returns {string} The username specific vault name.
 */
export default function createVaultName(username: string): string {
  return `${IDB_DB_NAME_PREFIX}_${bytesToHex(utf8ToBytes(username))}`;
}
