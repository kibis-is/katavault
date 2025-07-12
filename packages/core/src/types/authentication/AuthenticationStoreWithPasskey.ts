// decorators
import { PasskeyStore } from '@/decorators';

// enums
import { AuthenticationMethodEnum } from '@/enums';

interface AuthenticationStoreWithPasskey {
  __type: AuthenticationMethodEnum.Passkey;
  store: PasskeyStore;
}

export default AuthenticationStoreWithPasskey;
