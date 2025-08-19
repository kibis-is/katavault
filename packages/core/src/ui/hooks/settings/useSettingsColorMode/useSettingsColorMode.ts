import { useCallback, useContext, useEffect, useState } from 'preact/hooks';

// contexts
import { SettingsContext, UserContext } from '@/ui/contexts';

// enums
import { EventEnum } from '@/enums';

// settings
import { SettingsUpdatedEvent } from '@/events';

// types
import type { ColorMode } from '@/types';

export default function useSettingsColorMode(): ColorMode {
  // contexts
  const store = useContext(SettingsContext);
  const username = useContext(UserContext);
  // states
  const [value, setValue] = useState<ColorMode>('light');
  // callbacks
  const fetchValue = useCallback(async () => {
    if (!store) {
      return;
    }

    const { colorMode } = await store.settings();

    setValue(colorMode);
  }, [setValue, store]);
  const listener = useCallback(
    async (event: SettingsUpdatedEvent) => {
      // if this event is not for this specific user, ignore it
      if (!username || username !== event.detail.username) {
        return;
      }

      await fetchValue();
    },
    [fetchValue, username]
  );

  useEffect(() => {
    (async () => await fetchValue())();
  }, []);
  useEffect(() => {
    window.addEventListener(EventEnum.SettingsUpdated, listener);

    return () => window.removeEventListener(EventEnum.SettingsUpdated, listener);
  }, [listener]);

  return value;
}
