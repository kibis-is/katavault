import type { FunctionComponent } from 'preact';
import type { PropsWithChildren } from 'preact/compat';
import { useCallback, useEffect, useState } from 'preact/hooks';

// contexts
import { AppContext } from '@/ui/contexts';

// decorators
import { ConfigStore } from '@/decorators';

// types
import type { AppState } from '@/ui/types';
import type { Props } from './types';

const AppProvider: FunctionComponent<PropsWithChildren<Props>> = ({ children, i18n, logger, vault }) => {// states
  const [timestamp, setTimestamp] = useState<number>(0);
  const [state, setState] = useState<AppState | null>(null);// callbacks
  const onUpdate = useCallback(() => setTimestamp(Date.now()), [setTimestamp]);

  useEffect(() => {
    (async () => {
      setState({
        configStore: new ConfigStore({
          logger,
          vault,
        }),
        i18n,
        logger,
      });
      setTimestamp(Date.now());
    })();
  }, [i18n, logger, vault]);

  return (
    <AppContext.Provider value={{
      onUpdate,
      state,
      timestamp,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
