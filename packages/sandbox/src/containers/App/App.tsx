import type { ColorMode } from '@chakra-ui/color-mode';
import { Voi } from '@kibisis/chains';
import { CreateKatavaultParameters } from '@kibisis/katavault-core';
import { KatavaultProvider } from '@kibisis/katavault-react';
import { KibisisAppProvider } from '@kibisis/react';
import { type FC, useCallback, useMemo, useState } from 'react';

// containers
import Root from '@/containers/Root';

// contexts
import { LoggerContext } from '@/contexts';

// types
import type { Props } from './types';

const App: FC<Props> = ({ logger }) => {
  // states
  const [colorMode, setColorMode] = useState<ColorMode>('light');
  // memos
  const config = useMemo<CreateKatavaultParameters>(
    () => ({
      chains: [Voi],
      debug: true,
    }),
    []
  );
  // callbacks
  const handleOnToggleColorMode = useCallback(
    () => setColorMode(colorMode === 'light' ? 'dark' : 'light'),
    [colorMode, setColorMode]
  );

  return (
    <LoggerContext.Provider value={logger}>
      <KibisisAppProvider colorMode={colorMode} debug={true} logger={logger}>
        <KatavaultProvider config={config}>
          <Root onToggleColorMode={handleOnToggleColorMode} />
        </KatavaultProvider>
      </KibisisAppProvider>
    </LoggerContext.Provider>
  );
};

export default App;
