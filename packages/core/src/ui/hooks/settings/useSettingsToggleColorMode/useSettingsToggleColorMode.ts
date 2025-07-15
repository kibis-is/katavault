import { useContext } from 'preact/hooks';

// contexts
import { SettingsContext } from '@/ui/contexts';

// types
import type { ColorMode } from '@/types';

export default function useSettingsToggleColorMode(): () => void {
  // contexts
  const { onUpdate, state } = useContext(SettingsContext);

  return () => {
    (async () => {
      let _colorMode: ColorMode;

      if (!state) {
        return;
      }

      _colorMode = (await state.settings()).colorMode;

      await state.setSettings({
        colorMode: _colorMode === 'light' ? 'dark' : 'light',
      });

      if (onUpdate) {
        onUpdate();
      }
    })();
  };
}
