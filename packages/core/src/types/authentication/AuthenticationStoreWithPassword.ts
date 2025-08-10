// decorators
import { PasswordStore } from '@/decorators';

// enums
import { AuthenticationMethodEnum } from '@/enums';

interface AuthenticationStoreWithPassword {
  __type: AuthenticationMethodEnum.Password;
  store: PasswordStore;
}

export default AuthenticationStoreWithPassword;
