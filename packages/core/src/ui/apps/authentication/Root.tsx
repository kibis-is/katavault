import clsx from 'clsx';
import type { FunctionComponent } from 'preact';
import { useCallback, useState } from 'preact/hooks';

// components
import Button from '@/ui/components/Button';
import CircularLoaderWithIcon from '@/ui/components/CircularLoaderWithIcon';
import ErrorMessage from '@/ui/components/ErrorMessage';
import Footer from '@/ui/components/Footer';
import Heading from '@/ui/components/Heading';
import HStack from '@/ui/components/HStack';
import IconButton from '@/ui/components/IconButton';
import Input from '@/ui/components/Input';
import Spacer from '@/ui/components/Spacer';
import Text from '@/ui/components/Text';
import VStack from '@/ui/components/VStack';

// constants
import { INVALID_PASSWORD_ERROR } from '@/constants';
import { DEFAULT_PADDING } from '@/ui/constants';

// decorators
import { PasskeyStore, PasswordStore } from '@/decorators';

// enums
import { AuthenticationMethod } from '@/enums';

// errors
import { BaseError } from '@/errors';

// hooks
import useClientInformation from '@/ui/hooks/useClientInformation';
import useColorMode from '@/ui/hooks/useColorMode';
import useDefaultTextColor from '@/ui/hooks/useDefaultTextColor';
import useLogger from '@/ui/hooks/useLogger';
import useInput from '@/ui/hooks/useInput';
import useToggleColorMode from '@/ui/hooks/useToggleColorMode';
import useTranslate from '@/ui/hooks/useTranslate';
import useVault from '@/ui/hooks/useVault';

// icons
import ArrowLeftIcon from '@/ui/icons/ArrowLeftIcon';
import ArrowRightIcon from '@/ui/icons/ArrowRightIcon';
import CloseIcon from '@/ui/icons/CloseIcon';
import MoonIcon from '@/ui/icons/MoonIcon';
import NoPasskeyIcon from '@/ui/icons/NoPasskeyIcon';
import PasskeyIcon from '@/ui/icons/PasskeyIcon';
import RotateIcon from '@/ui/icons/RotateIcon';
import SignInIcon from '@/ui/icons/SignInIcon';
import SunnyIcon from '@/ui/icons/SunnyIcon';

// styles
import styles from './styles.module.scss';

// types
import type { UserInformation } from '@/types';
import type { RootProps } from './types';

// utilities
import { authenticateWithPasskey, authenticateWithPassword } from '@/utilities';

const Root: FunctionComponent<RootProps> = ({ onClose, onSuccess }) => {
  // hooks
  const clientInformation = useClientInformation();
  const colorMode = useColorMode();
  const defaultTextColor = useDefaultTextColor(colorMode);
  const {
    validate: validatePasswordInput,
    reset: resetPasswordInput,
    setError: setPasswordInputError,
    ...passwordInputProps
  } = useInput({
    name: 'password',
    required: true,
  });
  const { validate: validateUsernameInput, ...usernameInputProps } = useInput({
    name: 'username',
    required: true,
  });
  const logger = useLogger();
  const toggleColorMode = useToggleColorMode();
  const translate = useTranslate();
  const vault = useVault();
  // states
  const [method, setMethod] = useState<AuthenticationMethod | null>(null);
  const [passkeyError, setPasskeyError] = useState<BaseError | null>(null);
  const [passwordError, setPasswordError] = useState<BaseError | null>(null);
  // callbacks
  const handleOnBackClick = useCallback(() => {
    if (method) {
      resetPasswordInput();
    }

    setMethod(null);
  }, [method, setMethod]);
  const handleOnCloseClick = useCallback(() => onClose(), [onClose]);
  const handleOnContinueWithPasswordClick = useCallback(() => {
    if (validateUsernameInput()) {
      return;
    }

    setMethod(AuthenticationMethod.Password);
  }, [setMethod, validateUsernameInput]);
  const handleOnSignInWithPasskeyClick = useCallback(async () => {
    const __logPrefix= `${Root.displayName}#handleOnSignInWithPasskeyClick`;
    let store: PasskeyStore;
    let user: UserInformation;

    setPasskeyError(null);

    if (!clientInformation || !logger || !vault) {
      return;
    }

    if (validateUsernameInput()) {
      return;
    }

    setMethod(AuthenticationMethod.Passkey);

    try {
      user = {
        displayName: usernameInputProps.value,
        username: usernameInputProps.value,
      };
      store = await authenticateWithPasskey({
        clientInformation,
        logger,
        user,
        vault,
      });

      onSuccess({
        authenticationStore: {
          __type: AuthenticationMethod.Passkey,
          store,
        },
        user,
      });
    } catch (error) {
      logger.error(`${__logPrefix}:`, error);
      setPasskeyError(error);
    }
  }, [clientInformation, logger, setMethod, usernameInputProps.value, validateUsernameInput, vault]);
  const handleOnSignInWithPasswordClick = useCallback(async () => {
    const __logPrefix= `${Root.displayName}#handleOnSignInWithPasswordClick`;
    let store: PasswordStore;
    let user: UserInformation;

    setPasswordError(null);

    if (!logger || !vault) {
      return;
    }

    if (validatePasswordInput()) {
      return;
    }

    try {
      user = {
        displayName: usernameInputProps.value,
        username: usernameInputProps.value,
      };
      store = await authenticateWithPassword({
        logger,
        password: passwordInputProps.value,
        user,
        vault,
      });

      onSuccess({
        authenticationStore: {
          __type: AuthenticationMethod.Password,
          store,
        },
        user,
      });
    } catch (error) {
      logger.error(`${__logPrefix}:`, error);

      if ((error as BaseError).isKatavaultError && (error as BaseError).type === INVALID_PASSWORD_ERROR) {
        return setPasswordInputError(translate('errors.inputs.incorrectPassword'));
      }

      setPasswordError(error);
    }
  }, [logger, passwordInputProps.value, setPasswordInputError, setPasswordError, translate, validatePasswordInput, vault]);
  const handleOnToggleColorModeClick = useCallback(() => toggleColorMode(), [toggleColorMode]);

  return (
    <div className={clsx(styles.container)}>
      {/*overlay*/}
      <div className={clsx(styles.overlay)}></div>

      {/*modal*/}
      <div className={clsx(styles.modal)} data-color-mode={colorMode}>
        {/*header*/}
        <HStack align="center" fullWidth={true} padding={DEFAULT_PADDING} spacing="xs">
          {(method === AuthenticationMethod.Password || (method === AuthenticationMethod.Passkey && passkeyError)) && (
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
        <VStack align="center" fullWidth={true} grow={true} paddingX={DEFAULT_PADDING} spacing="md">
          {(() => {
            switch (method) {
              case AuthenticationMethod.Passkey:
                if (passkeyError) {
                  return (
                    <>
                      <NoPasskeyIcon className={clsx(styles.passkeyIcon)} color={defaultTextColor} />

                      <Text colorMode={colorMode} textAlign="center">
                        {translate('errors.descriptions.type', {
                          context: passkeyError.type,
                        })}
                      </Text>

                      <Spacer />

                      <Button
                        colorMode={colorMode}
                        fullWidth={true}
                        onClick={handleOnSignInWithPasskeyClick}
                        rightIcon={<RotateIcon />}
                      >
                        {translate('buttons.retry')}
                      </Button>
                    </>
                  );
                }

                return (
                  <>
                    <CircularLoaderWithIcon colorMode={colorMode} icon={<PasskeyIcon />} size="lg" />

                    <Text colorMode={colorMode} fullWidth={true} textAlign="center">
                      {translate('captions.verifyPasskey')}
                    </Text>
                  </>
                );
              case AuthenticationMethod.Password:
                return (
                  <>
                    <Heading colorMode={colorMode}>{translate('headings.enterYourPassword')}</Heading>

                    <Input
                      {...passwordInputProps}
                      autocomplete="current-password new-password"
                      colorMode={colorMode}
                      placeholder={translate('placeholders.password')}
                      type="password"
                    />

                    <Spacer />

                    {/*error message*/}
                    {passwordError && (
                      <ErrorMessage
                        colorMode={colorMode}
                        message={translate('errors.descriptions.type', {
                          context: passwordError.type,
                        })}
                      />
                    )}

                    {/*cta buttons*/}
                    <VStack align="center" fullWidth={true} justify="center" spacing="sm">
                      <Button
                        colorMode={colorMode}
                        fullWidth={true}
                        onClick={handleOnSignInWithPasswordClick}
                        rightIcon={<SignInIcon />}
                      >
                        {translate('buttons.signIn')}
                      </Button>
                    </VStack>
                  </>
                );
              default:
                return (
                  <>
                    <Heading colorMode={colorMode}>{translate('headings.loginOrSignUp')}</Heading>

                    <Input
                      {...usernameInputProps}
                      autocomplete="username email"
                      colorMode={colorMode}
                      placeholder={translate('placeholders.usernameEmail')}
                      type="text"
                    />

                    <Spacer />

                    <VStack align="center" fullWidth={true} justify="center" spacing="sm">
                      <Button
                        colorMode={colorMode}
                        fullWidth={true}
                        onClick={handleOnContinueWithPasswordClick}
                        rightIcon={<ArrowRightIcon />}
                      >
                        {translate('buttons.continueWithPassword')}
                      </Button>

                      {PasskeyStore.isSupported() && (
                        <Button
                          colorMode={colorMode}
                          fullWidth={true}
                          onClick={handleOnSignInWithPasskeyClick}
                          rightIcon={<PasskeyIcon />}
                        >
                          {translate('buttons.signInWithPasskey')}
                        </Button>
                      )}
                    </VStack>
                  </>
                );
            }
          })()}
        </VStack>

        {/*footer*/}
        <Footer colorMode={colorMode} />
      </div>
    </div>
  );
};

Root.displayName = 'Root';

export default Root;
