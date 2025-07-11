import clsx from 'clsx';
import type { FunctionComponent } from 'preact';
import { useCallback, useState } from 'preact/hooks';

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

// enums
import { AuthenticationMethod } from '@/enums';

// hooks
import useColorMode from '@/ui/hooks/useColorMode';
import useInput from '@/ui/hooks/useInput';
import useToggleColorMode from '@/ui/hooks/useToggleColorMode';
import useTranslate from '@/ui/hooks/useTranslate';

// icons
import ArrowLeftIcon from '@/ui/icons/ArrowLeftIcon';
import ArrowRightIcon from '@/ui/icons/ArrowRightIcon';
import CloseIcon from '@/ui/icons/CloseIcon';
import MoonIcon from '@/ui/icons/MoonIcon';
import PasskeyIcon from '@/ui/icons/PasskeyIcon';
import SignInIcon from '@/ui/icons/SignInIcon';
import SunnyIcon from '@/ui/icons/SunnyIcon';

// styles
import styles from './styles.module.scss';

// types
import type { RootProps } from './types';

const Root: FunctionComponent<RootProps> = ({ onClose }) => {
  // hooks
  const colorMode = useColorMode();
  const {
    validate: validateUsername,
    ...usernameInputProps
  } = useInput({
    name: 'username',
    required: true,
  });
  const toggleColorMode = useToggleColorMode();
  const translate = useTranslate();
  // states
  const [method, setMethod] = useState<AuthenticationMethod | null>(null);
  // callbacks
  const handleOnBackClick = useCallback(() => setMethod(null), [setMethod]);
  const handleOnCloseClick = useCallback(() => onClose(), [onClose]);
  const handleOnContinueWithPasswordClick = useCallback(() => {
    if (validateUsername(usernameInputProps.value)) {
      return;
    }

    setMethod(AuthenticationMethod.Password);
  }, [setMethod, translate, validateUsername, usernameInputProps.value]);
  const handleOnSignInWithPasskeyClick = useCallback(() => setMethod(AuthenticationMethod.Passkey), [setMethod]);
  const handleOnToggleColorModeClick = useCallback(() => toggleColorMode(), [toggleColorMode]);

  return (
    <div className={clsx(styles.container)} data-color-mode={colorMode}>
      {/*overlay*/}
      <div className={clsx(styles.overlay)}></div>

      {/*modal*/}
      <VStack align="center" className={clsx(styles.modal)}>
        {/*header*/}
        <HStack align="center" fullWidth={true} padding={DEFAULT_PADDING} spacing="xs">
          {method === AuthenticationMethod.Password && (
            <HStack align="center" justify="start" spacing="xs">
              {/*back button*/}
              <IconButton colorMode={colorMode} icon={<ArrowLeftIcon />} onClick={handleOnBackClick} />
            </HStack>
          )}

          <Spacer />

          <HStack align="center" justify="end" spacing="xs">
            {/*toggle color mode button*/}
            <IconButton
              colorMode={colorMode}
              icon={colorMode === 'dark' ? <MoonIcon /> : <SunnyIcon />}
              onClick={handleOnToggleColorModeClick}
            />

            {/*close button*/}
            <IconButton colorMode={colorMode} icon={<CloseIcon />} onClick={handleOnCloseClick} />
          </HStack>
        </HStack>

        {/*content*/}
        <VStack align="center" fullWidth={true} grow={true} justify="center" padding={DEFAULT_PADDING} spacing="md">
          {(() => {
            switch (method) {
              case AuthenticationMethod.Password:
                return (
                  <>
                    <Heading colorMode={colorMode}>{translate('headings.enterYourPassword')}</Heading>

                    <Input
                      {...usernameInputProps}
                      autocomplete="username email"
                      colorMode={colorMode}
                      placeholder={translate('placeholders.emailUsername')}
                      type="text"
                    />

                    <VStack align="center" fullWidth={true} justify="center" spacing="sm">
                      <Button colorMode={colorMode} fullWidth={true} rightIcon={<SignInIcon />}>
                        {translate('buttons.signInWithPassword')}
                      </Button>
                    </VStack>
                  </>
                );
              default:
                return (
                  <>
                    <Heading colorMode={colorMode}>{translate('headings.signIn')}</Heading>

                    <Input
                      {...usernameInputProps}
                      autocomplete="username email"
                      colorMode={colorMode}
                      placeholder={translate('placeholders.emailUsername')}
                      type="text"
                    />

                    <VStack align="center" fullWidth={true} justify="center" spacing="sm">
                      <Button
                        colorMode={colorMode}
                        fullWidth={true}
                        onClick={handleOnContinueWithPasswordClick}
                        rightIcon={<ArrowRightIcon />}
                      >
                        {translate('buttons.continueWithPassword')}
                      </Button>

                      <Button
                        colorMode={colorMode}
                        fullWidth={true}
                        onClick={handleOnSignInWithPasskeyClick}
                        rightIcon={<PasskeyIcon />}
                      >
                        {translate('buttons.signInWithPasskey')}
                      </Button>
                    </VStack>
                  </>
                );
            }
          })()}
        </VStack>

        {/*footer*/}
        <Footer colorMode={colorMode} />
      </VStack>
    </div>
  );
};

export default Root;
