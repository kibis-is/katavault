import {
  type AuthenticateWithPasskeyParameters,
  type AuthenticateWithPasswordParameters,
  BaseError,
  EventEnum,
} from '@kibisis/katavault-core';
import { useCallback, useContext, useEffect, useState } from 'react';

// contexts
import { KatavaultContext } from '@/contexts';

// errors
import { NotInitializedError } from '@/errors';

// types
import type { HookFunction, HookFunctionWithoutParams, UseAuthenticateState } from '@/types';

/**
 * Hook to manage authentication.
 *
 * @returns {UseAuthenticateState} Authentication methods and authentication state.
 */
export default function useAuthenticate(): UseAuthenticateState {
  // contexts
  const { onUpdate, katavault } = useContext(KatavaultContext);
  // states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  // callbacks
  const authenticate = useCallback<HookFunctionWithoutParams<undefined, BaseError>>(
    (options) => {
      (async () => {
        if (!katavault) {
          return options?.onError?.(new NotInitializedError('katavault not initialized'), undefined);
        }

        setIsAuthenticating(true);

        try {
          await katavault.authenticate();

          onUpdate?.();
          setIsAuthenticated(katavault.isAuthenticated());
          options?.onSuccess?.(undefined, undefined);
        } catch (error) {
          return options?.onError?.(error, undefined);
        } finally {
          setIsAuthenticating(false);
        }
      })();
    },
    [katavault, setIsAuthenticated, setIsAuthenticating]
  );
  const authenticateWithPasskey = useCallback<HookFunction<AuthenticateWithPasskeyParameters, undefined, BaseError>>(
    (params, options) => {
      (async () => {
        if (!katavault) {
          return options?.onError?.(new NotInitializedError('katavault not initialized'), params);
        }

        setIsAuthenticating(true);

        try {
          await katavault.authenticateWithPasskey(params);

          onUpdate?.();
          setIsAuthenticated(katavault.isAuthenticated());
          options?.onSuccess?.(undefined, params);
        } catch (error) {
          return options?.onError?.(error, params);
        } finally {
          setIsAuthenticating(false);
        }
      })();
    },
    [katavault, setIsAuthenticated, setIsAuthenticating]
  );
  const authenticateWithPassword = useCallback<HookFunction<AuthenticateWithPasswordParameters, undefined, BaseError>>(
    (params, options) => {
      (async () => {
        if (!katavault) {
          return options?.onError?.(new NotInitializedError('katavault not initialized'), params);
        }

        setIsAuthenticating(true);

        try {
          await katavault.authenticateWithPassword(params);

          onUpdate?.();
          setIsAuthenticated(katavault.isAuthenticated());
          options?.onSuccess?.(undefined, params);
        } catch (error) {
          return options?.onError?.(error, params);
        } finally {
          setIsAuthenticating(false);
        }
      })();
    },
    [katavault, setIsAuthenticated, setIsAuthenticating]
  );
  const logoutListener = useCallback(() => {
    if (!katavault) {
      return;
    }

    setIsAuthenticated(katavault.isAuthenticated());
  }, [katavault, setIsAuthenticated]);

  // listen to any logout events
  useEffect(() => {
    window.addEventListener(EventEnum.Logout, logoutListener);

    return () => window.removeEventListener(EventEnum.Logout, logoutListener);
  }, [logoutListener]);

  return {
    authenticate,
    authenticateWithPasskey,
    authenticateWithPassword,
    isAuthenticated,
    isAuthenticating,
  };
}
