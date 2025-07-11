// enums
import { AuthenticationMethod } from '@/enums';

// types
import type { PasskeyStoreSchema, UserInformation } from '@/types';

/**
 * @property {Uint8Array<ArrayBufferLike>} keyMaterial - The key material from the passkey used in encryption.
 * @property {PasskeyStoreSchema} passkey - Information regarding the passkey used.
 * @property {UserInformation} user - The user information.
 */
interface AuthenticateWithPasskeyResult {
  __type: AuthenticationMethod.Passkey;
  keyMaterial: Uint8Array<ArrayBufferLike>;
  passkey: PasskeyStoreSchema;
  user: UserInformation;
}

export default AuthenticateWithPasskeyResult;
