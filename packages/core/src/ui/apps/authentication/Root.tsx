import clsx from 'clsx';
import type { FunctionComponent } from 'preact';
import { useCallback } from 'preact/hooks';

// components
import Footer from '@/ui/components/Footer';
import HStack from '@/ui/components/HStack';
import IconButton from '@/ui/components/IconButton';
import Spacer from '@/ui/components/Spacer';
import Text from '@/ui/components/Text';
import VStack from '@/ui/components/VStack';

// constants
import { DEFAULT_PADDING } from '@/ui/constants';

// hooks
import useColorMode from '@/ui/hooks/useColorMode';
import useToggleColorMode from '@/ui/hooks/useToggleColorMode';

// icons
import CloseIcon from '@/ui/icons/CloseIcon';
import MoonIcon from '@/ui/icons/MoonIcon';
import SunnyIcon from '@/ui/icons/SunnyIcon';

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
        <Footer colorMode={colorMode} />
      </VStack>
    </div>
  );
};

export default Root;
