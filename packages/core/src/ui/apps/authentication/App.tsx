import type { FunctionComponent } from 'preact';
import { useCallback, useState } from 'preact/hooks';

// containers
import Root from './Root';

// providers
import AppProvider from '@/ui/providers/AppProvider';

// types
import type { ColorMode } from '@/types';
import type { BaseAppProps } from '@/ui/types';
import type { AppProps } from './types';

const App: FunctionComponent<BaseAppProps & AppProps> = ({ clientInformation, i18n, logger, ...otherProps }) => {
  // states
  const [colorMode, setColorMode] = useState<ColorMode>('light');
  // callbacks
  const onSetColorMode = useCallback((value: ColorMode) => setColorMode(value), [setColorMode]);

  return (
    <AppProvider
      clientInformation={clientInformation}
      i18n={i18n}
      logger={logger}
    >
      <Root
        colorMode={colorMode}
        onSetColorMode={onSetColorMode}
        {...otherProps}
      />
    </AppProvider>
  );
};

export default App;
