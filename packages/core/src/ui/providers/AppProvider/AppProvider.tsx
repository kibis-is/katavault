import type { FunctionComponent } from 'preact';
import type { PropsWithChildren } from 'preact/compat';
import { useCallback, useEffect, useState } from 'preact/hooks';

// contexts
import { AppContext } from '@/ui/contexts';

// types
import type { AppContextState } from '@/ui/types';

const AppProvider: FunctionComponent<PropsWithChildren<AppContextState>> = ({ children, clientInformation, i18n, logger }) => {
  // states
  const [timestamp, setTimestamp] = useState<number>(0);
  const [state, setState] = useState<AppContextState>({
    clientInformation,
    i18n,
    logger,
  });
  // callbacks
  const onUpdate = useCallback(() => setTimestamp(Date.now()), [setTimestamp]);

  useEffect(() => {
    setState({
      clientInformation,
      i18n,
      logger,
    });
    onUpdate();
  }, [clientInformation, i18n, logger]);

  return (
    <AppContext.Provider
      value={{
        onUpdate,
        state,
        timestamp,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
