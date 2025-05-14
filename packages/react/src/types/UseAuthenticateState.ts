import {
  type AuthenticateWithPasskeyParameters,
  type AuthenticateWithPasswordParameters,
  BaseError,
} from '@kibisis/katavault-core';

// types
import HookFunction from './HookFunction';

interface UseAuthenticateState {
  authenticateWithPasskey: HookFunction<AuthenticateWithPasskeyParameters, undefined, BaseError>;
  authenticateWithPassword: HookFunction<AuthenticateWithPasswordParameters, undefined, BaseError>;
  isAuthenticated: boolean;
  isAuthenticating: boolean;
}

export default UseAuthenticateState;
