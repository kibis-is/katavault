// decorators
import { PasswordVaultDecorator } from '@/decorators';

// enums
import { AuthenticationMethod } from '@/enums';

interface AuthenticationClientWithPassword {
  __type: AuthenticationMethod.Password;
  vault: PasswordVaultDecorator;
}

export default AuthenticationClientWithPassword;
