import { useContext } from 'preact/hooks';

// contexts
import { SettingsContext, UserContext } from '@/ui/contexts';

// events
import { SettingsUpdatedEvent } from '@/events';

export default function useSettingsToggleColorMode(): () => void {
  // contexts
  const store = useContext(SettingsContext);
  const username = useContext(UserContext);

  return () => {
    (async () => {
      if (!store || !username) {
        return;
      }

      const { colorMode } = await store.settings();

      await store.setSettings({
        colorMode: colorMode === 'light' ? 'dark' : 'light',
      });

      // emit an event for this user
      window.dispatchEvent(new SettingsUpdatedEvent(username));
    })();
  };
}
