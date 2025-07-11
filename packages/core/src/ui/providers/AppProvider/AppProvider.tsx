import type { FunctionComponent } from 'preact';
import type { PropsWithChildren } from 'preact/compat';
import { useCallback, useEffect, useState } from 'preact/hooks';

// contexts
import { AppContext } from '@/ui/contexts';

// types
import type { AppState } from '@/ui/types';
import type { Props } from './types';

const AppProvider: FunctionComponent<PropsWithChildren<Props>> = ({ children, clientInformation, i18n, logger, vault }) => {
  // states
  const [timestamp, setTimestamp] = useState<number>(0);
  const [state, setState] = useState<AppState>({
    clientInformation,
    i18n,
    logger,
    vault,
  });
  // callbacks
  const onUpdate = useCallback(() => setTimestamp(Date.now()), [setTimestamp]);

  useEffect(() => {
    setState({
      clientInformation,
      i18n,
      logger,
      vault,
    });
    onUpdate();
  }, [clientInformation, i18n, logger, vault]);

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
