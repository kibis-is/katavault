import clsx from 'clsx';
import type { FunctionComponent } from 'preact';
import { useCallback, useEffect, useState } from 'preact/hooks';

// components
import Spacer from '@/apps/common/components/Spacer';
import Text from '@/apps/common/components/Text';
import VStack from '@/apps/common/components/VStack';

// constants
import { DEFAULT_PADDING } from '@/apps/common/constants';

// styles
import styles from './styles.module.scss';

// types
import type { BaseAppProps } from '@/apps/common/types';
import type { ColorMode } from '@/types';
import type { Props } from './types';

const App: FunctionComponent<BaseAppProps & Props> = ({ colorMode }) => {
  // states
  const [_colorMode, setColorMode] = useState<ColorMode>(colorMode);
  // handlers
  // const handleOnClose = useCallback(() => onClose(), [onClose]);
  const handleOnSystemThemeChangeEvent = ({ matches }: MediaQueryListEvent) => setColorMode(matches ? 'dark' : 'light');
  // const handleOnToggleColorModeClick = () => setColorMode(_colorMode === 'dark' ? 'light' : 'dark');

  useEffect(() => {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', handleOnSystemThemeChangeEvent);

    return () => {
      window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', handleOnSystemThemeChangeEvent);
    };
  }, []);
  useEffect(() => setColorMode(colorMode), [colorMode]);

  return (
    <div className={clsx(styles.modal)} data-theme={_colorMode}>
      {/*overlay*/}
      <div className={clsx(styles.modalOverlay)}></div>

      {/*modal*/}
      <VStack className={clsx(styles.modalContainer)} fullWidth={true}>
        {/*header*/}

        {/*content*/}
        <VStack align="center" fullWidth={true} justify="center" padding={DEFAULT_PADDING} spacing="md">
          <Text colorMode={_colorMode} size="lg" >
            Authenticate!!
          </Text>
        </VStack>

        <Spacer />

        {/*footer*/}
      </VStack>
    </div>
  );
};

export default App;
