import { useContext, useEffect, useState } from 'preact/hooks';

// contexts
import { SettingsContext } from '@/ui/contexts';

// types
import type { ColorMode } from '@/types';

export default function useSettingsColorMode(): ColorMode {
  const { state, timestamp } = useContext(SettingsContext);
  const [colorMode, setColorMode] = useState<ColorMode>('light');

  useEffect(() => {
    if (!state) {
      return;
    }

    (async () => {
      setColorMode((await state.settings()).colorMode);
    })();
  }, [timestamp]);

  return colorMode;
}
