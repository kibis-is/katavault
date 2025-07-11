import clsx from 'clsx';
import type { FunctionComponent } from 'preact';
import { useCallback } from 'preact/hooks';

// components
import Button from '@/ui/components/Button';
import Footer from '@/ui/components/Footer';
import Heading from '@/ui/components/Heading';
import HStack from '@/ui/components/HStack';
import IconButton from '@/ui/components/IconButton';
import Input from '@/ui/components/Input';
import Spacer from '@/ui/components/Spacer';
import VStack from '@/ui/components/VStack';

// constants
import { DEFAULT_PADDING } from '@/ui/constants';

// hooks
import useColorMode from '@/ui/hooks/useColorMode';
import useToggleColorMode from '@/ui/hooks/useToggleColorMode';
import useTranslate from '@/ui/hooks/useTranslate';

// icons
import ArrowRightIcon from '@/ui/icons/ArrowRightIcon';
import CloseIcon from '@/ui/icons/CloseIcon';
import MoonIcon from '@/ui/icons/MoonIcon';
import PasskeyIcon from '@/ui/icons/PasskeyIcon';
import SunnyIcon from '@/ui/icons/SunnyIcon';

// styles
import styles from './styles.module.scss';

// types
import type { RootProps } from './types';

const Root: FunctionComponent<RootProps> = ({ onClose }) => {
  // hooks
  const colorMode = useColorMode();
  const toggleColorMode = useToggleColorMode();
  const translate = useTranslate();
  // handlers
  const handleOnClose = useCallback(() => onClose(), [onClose]);
  const handleOnToggleColorModeClick = useCallback(() => toggleColorMode(), [toggleColorMode]);

  return (
    <div className={clsx(styles.modal)} data-color-mode={colorMode}>
      {/*overlay*/}
      <div className={clsx(styles.modalOverlay)}></div>

      {/*modal*/}
      <VStack align="center" className={clsx(styles.modalContainer)}>
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
        <VStack align="center" fullWidth={true} grow={true} justify="center" maxWidth={400} padding={DEFAULT_PADDING} spacing="md">
          <Heading colorMode={colorMode}>
            {translate('headings.signIn')}
          </Heading>

          {/*email/username input*/}
          <Input
            autocomplete="username email"
            colorMode={colorMode}
            placeholder={translate('placeholders.emailUsername')}
            type="text"
          />

          <Spacer />

          {/*cta buttons*/}
          <VStack align="center" fullWidth={true} justify="center" spacing="sm">
            <Button
              colorMode={colorMode}
              fullWidth={true}
              rightIcon={<ArrowRightIcon />}
            >
              {translate('buttons.continueWithAPassword')}
            </Button>

            <Button
              colorMode={colorMode}
              fullWidth={true}
              rightIcon={<PasskeyIcon />}
            >
              {translate('buttons.signInWithAPasskey')}
            </Button>
          </VStack>
        </VStack>

        {/*footer*/}
        <Footer colorMode={colorMode} />
      </VStack>
    </div>
  );
};

export default Root;
