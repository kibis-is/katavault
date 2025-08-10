// types
import type { EphemeralAccountStoreItem, EphemeralAccountStoreItemWithDecryptedKeyData } from '@/types';

interface AuthenticationStoreInterface {
  decryptBytes(encryptedBytes: Uint8Array): Promise<Uint8Array>;
  decryptEphemeralAccount(account: EphemeralAccountStoreItem): Promise<EphemeralAccountStoreItemWithDecryptedKeyData>;
  encryptBytes(bytes: Uint8Array): Promise<Uint8Array>;
}

export default AuthenticationStoreInterface;
