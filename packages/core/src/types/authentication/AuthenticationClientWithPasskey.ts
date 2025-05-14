// decorators
import { PasskeyVaultDecorator } from '@/decorators';

// enums
import { AuthenticationMethod } from '@/enums';

interface AuthenticationClientWithPasskey {
  __type: AuthenticationMethod.Passkey;
  vault: PasskeyVaultDecorator;
}

export default AuthenticationClientWithPasskey;
