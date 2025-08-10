import type { FunctionComponent } from 'preact';
import type { PropsWithChildren } from 'preact/compat';
import { useCallback, useEffect, useState } from 'preact/hooks';

// contexts
import { SettingsContext } from '@/ui/contexts';

// decorators
import type { SettingsStore } from '@/decorators';

// types
import type { Props } from './types';

const SettingsProvider: FunctionComponent<PropsWithChildren<Props>> = ({ children, settingsStore }) => {
  // states
  const [timestamp, setTimestamp] = useState<number>(0);
  const [state, setState] = useState<SettingsStore>(settingsStore);
  // callbacks
  const onUpdate = useCallback(() => setTimestamp(Date.now()), [setTimestamp]);

  useEffect(() => {
    setState(settingsStore);
    onUpdate();
  }, [settingsStore]);

  return (
    <SettingsContext.Provider
      value={{
        onUpdate,
        state,
        timestamp,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;
