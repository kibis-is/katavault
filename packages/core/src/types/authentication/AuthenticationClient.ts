// types
import type { AuthenticationClientWithPasskey, AuthenticationClientWithPassword } from '@/types';

type AuthenticationClient = AuthenticationClientWithPasskey | AuthenticationClientWithPassword;

export default AuthenticationClient;
