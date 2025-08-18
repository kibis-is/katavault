import {
  type AuthenticateWithPasskeyParameters,
  type AuthenticateWithPasswordParameters,
  BaseError,
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
  const { onUpdate, katavault, timestamp } = useContext(KatavaultContext);
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

  // on updates, check if authenticated
  useEffect(() => {
    if (!katavault) {
      return;
    }

    setIsAuthenticated(katavault.isAuthenticated());
  }, [katavault, timestamp]);

  return {
    authenticate,
    authenticateWithPasskey,
    authenticateWithPassword,
    isAuthenticated,
    isAuthenticating,
  };
}
