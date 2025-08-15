import type { FunctionComponent } from 'preact';
import type { PropsWithChildren } from 'preact/compat';
import { useEffect, useState } from 'preact/hooks';

// contexts
import { SettingsContext } from '@/ui/contexts';

// decorators
import type { SettingsStore } from '@/decorators';

// types
import type { Props } from './types';

const SettingsProvider: FunctionComponent<PropsWithChildren<Props>> = ({ children, settingsStore }) => {
  // states
  const [value, setValue] = useState<SettingsStore>(settingsStore);

  useEffect(() => {
    setValue(settingsStore);
  }, [settingsStore]);

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;
