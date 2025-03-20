// types
import type Account from './Account';

interface AccountWithPrivateKeyBytes extends Omit<Account, 'privateKey'> {
  privateKey: Uint8Array;
}

export default AccountWithPrivateKeyBytes;
