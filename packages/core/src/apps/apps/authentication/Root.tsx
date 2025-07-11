import clsx from 'clsx';
import type { FunctionComponent } from 'preact';
import { useCallback } from 'preact/hooks';

// components
import HStack from '@/apps/components/HStack';
import IconButton from '@/apps/components/IconButton';
import Spacer from '@/apps/components/Spacer';
import Text from '@/apps/components/Text';
import VStack from '@/apps/components/VStack';

// constants
import { DEFAULT_PADDING } from '@/apps/constants';

// hooks
import useColorMode from '@/apps/hooks/useColorMode';
import useToggleColorMode from '@/apps/hooks/useToggleColorMode';

// icons
import CloseIcon from '@/apps/icons/CloseIcon';
import MoonIcon from '@/apps/icons/MoonIcon';
import SunnyIcon from '@/apps/icons/SunnyIcon';

// styles
import styles from './styles.module.scss';

// types
import type { RootProps } from './types';

const Root: FunctionComponent<RootProps> = ({ onClose }) => {
  // hooks
  const colorMode = useColorMode();
  const toggleColorMode = useToggleColorMode();
  // handlers
  const handleOnClose = useCallback(() => onClose(), [onClose]);
  const handleOnToggleColorModeClick = useCallback(() => toggleColorMode(), [toggleColorMode]);

  return (
    <div className={clsx(styles.modal)} data-color-mode={colorMode}>
      {/*overlay*/}
      <div className={clsx(styles.modalOverlay)}></div>

      {/*modal*/}
      <VStack className={clsx(styles.modalContainer)} fullWidth={true}>
        {/*header*/}
        <HStack align="center" fullWidth={true} padding={DEFAULT_PADDING} spacing="xs">
          <Spacer />

          <HStack align="center" justify="center" spacing="xs">
            {/*toggle color mode button*/}
            <IconButton colorMode={colorMode} icon={colorMode === 'dark' ? <MoonIcon /> : <SunnyIcon />} onClick={handleOnToggleColorModeClick} />

            {/*close button*/}
            <IconButton colorMode={colorMode} icon={<CloseIcon />} onClick={handleOnClose} />
          </HStack>
        </HStack>

        {/*content*/}
        <VStack align="center" fullWidth={true} justify="center" padding={DEFAULT_PADDING} spacing="md">
          <Text colorMode={colorMode} size="lg" >
            Authenticate!!
          </Text>
        </VStack>

        <Spacer />

        {/*footer*/}
      </VStack>
    </div>
  );
};

export default Root;
