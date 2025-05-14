// decorators
import { PasskeyStore } from '@/decorators';

// enums
import { AuthenticationMethod } from '@/enums';

interface AuthenticationStoreWithPasskey {
  __type: AuthenticationMethod.Passkey;
  store: PasskeyStore;
}

export default AuthenticationStoreWithPasskey;
