// types
import type { AuthenticationStoreWithPasskey, AuthenticationStoreWithPassword } from '@/types';

type AuthenticationStore = AuthenticationStoreWithPasskey | AuthenticationStoreWithPassword;

export default AuthenticationStore;
