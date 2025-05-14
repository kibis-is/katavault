// decorators
import { PasswordStore } from '@/decorators';

// enums
import { AuthenticationMethod } from '@/enums';

interface AuthenticationStoreWithPassword {
  __type: AuthenticationMethod.Password;
  store: PasswordStore;
}

export default AuthenticationStoreWithPassword;
