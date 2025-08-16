import clsx from 'clsx';
import type { FunctionComponent } from 'preact';
import type { KeyboardEvent } from 'preact/compat';
import { useCallback, useMemo, useState } from 'preact/hooks';

// components
import Button from '@/ui/components/buttons/Button';
import CircularLoaderWithIcon from '@/ui/components/loaders/CircularLoaderWithIcon';
import ErrorMessage from '@/ui/components/notices/ErrorMessage';
import Footer from '@/ui/components/containers/Footer';
import Heading from '@/ui/components/typography/Heading';
import HStack from '@/ui/components/layouts/HStack';
import IconButton from '@/ui/components/buttons/IconButton';
import Input from '@/ui/components/inputs/Input';
import Modal from '@/ui/components/layouts/Modal';
import NewPasswordInput from '@/ui/components/inputs/NewPasswordInput';
import PasswordInput from '@/ui/components/inputs/PasswordInput';
import Spacer from '@/ui/components/layouts/Spacer';
import Text from '@/ui/components/typography/Text';
import VStack from '@/ui/components/layouts/VStack';

// constants
import { INVALID_PASSWORD_ERROR } from '@/constants';
import { DEFAULT_PADDING } from '@/ui/constants';

// decorators
import { PasskeyStore, PasswordStore, SettingsStore } from '@/decorators';

// enums
import { AuthenticationMethodEnum } from '@/enums';

// errors
import { BaseError } from '@/errors';

// hooks
import useClientInformation from '@/ui/hooks/client/useClientInformation';
import useDefaultTextColor from '@/ui/hooks/colors/useDefaultTextColor';
import useLogger from '@/ui/hooks/logging/useLogger';
import useInput from '@/ui/hooks/forms/useInput';
import useTranslate from '@/ui/hooks/i18n/useTranslate';

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
import type { SettingsStoreSchema, Vault } from '@/types';
import type { BaseAppProps } from '@/ui/types';
import type { AppProps, RootProps } from './types';

// utilities
import { authenticateWithPasskey, authenticateWithPassword, initializeVault, passwordScore } from '@/utilities';

const Root: FunctionComponent<Pick<BaseAppProps, 'onClose'> & AppProps & RootProps> = ({ colorMode, onClose, onSetColorMode, onSuccess }) => {
  // hooks
  const clientInformation = useClientInformation();
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
  const translate = useTranslate();
  // states
  const [hasPasskeyInVault, setHasPasskeyInVault] = useState<boolean>(false);
  const [hasPasswordInVault, setHasPasswordInVault] = useState<boolean>(false);
  const [isUsingPasskey, setIsUsingPasskey] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(true);
  const [passkeyError, setPasskeyError] = useState<BaseError | null>(null);
  const [passwordError, setPasswordError] = useState<BaseError | null>(null);
  const [vault, setVault] = useState<Vault | null>(null);
  // memos
  const isSignUp = useMemo(() => !hasPasskeyInVault && !hasPasswordInVault, [hasPasskeyInVault, hasPasswordInVault]);
  // callbacks
  const handleClose = useCallback(() => setOpen(false), [setOpen]);
  const handleOnAuthenticateWithPasskeyClick = useCallback(async () => {
    const __logPrefix= `${Root.displayName}#handleOnAuthenticateWithPasskeyClick`;
    let store: PasskeyStore;

    setPasskeyError(null);

    if (!clientInformation || !logger || !vault) {
      return;
    }

    setIsUsingPasskey(true);

    try {
      store = await authenticateWithPasskey({
        clientInformation,
        logger,
        user: {
          displayName: usernameInputProps.value,
          username: usernameInputProps.value,
        },
        vault,
      });

      await new SettingsStore({
        logger,
        vault,
      }).setSettings({
        colorMode,
      });

      onSuccess({
        authenticationStore: {
          __type: AuthenticationMethodEnum.Passkey,
          store,
        },
        vault,
      });
      handleClose();
    } catch (error) {
      logger.error(`${__logPrefix}:`, error);
      setPasskeyError(error);
    }
  }, [
    clientInformation,
    colorMode,
    handleClose,
    logger,
    onSuccess,
    setIsUsingPasskey,
    setPasskeyError,
    usernameInputProps.value,
    vault,
  ]);
  const handleOnAuthenticateWithPasswordClick = useCallback(async () => {
    const __logPrefix= `${Root.displayName}#handleOnAuthenticateWithPasswordClick`;
    let store: PasswordStore;

    setPasswordError(null);

    if (!logger || !vault || !clientInformation) {
      return;
    }

    // if the password fails validation or this is a sign-up and the password does not have enough entropy, ignore
    if (validatePasswordInput() || (isSignUp && passwordScore(passwordInputProps.value).score <= 0)) {
      return;
    }

    try {
      store = await authenticateWithPassword({
        clientInformation,
        logger,
        password: passwordInputProps.value,
        user: {
          displayName: usernameInputProps.value,
          username: usernameInputProps.value,
        },
        vault,
      });

      await new SettingsStore({
        logger,
        vault,
      }).setSettings({
        colorMode,
      });

      onSuccess({
        authenticationStore: {
          __type: AuthenticationMethodEnum.Password,
          store,
        },
        vault,
      });
      handleClose();
    } catch (error) {
      logger.error(`${__logPrefix}:`, error);

      if ((error as BaseError).isKatavaultError && (error as BaseError).type === INVALID_PASSWORD_ERROR) {
        return setPasswordInputError(translate('errors.inputs.incorrectPassword'));
      }

      setPasswordError(error);
    }
  }, [
    clientInformation,
    colorMode,
    handleClose,
    isSignUp,
    logger,
    onSuccess,
    passwordInputProps.value,
    setPasswordInputError,
    setPasswordError,
    translate,
    validatePasswordInput,
    vault,
  ]);
  const handleOnBackClick = useCallback(() => {
    // if on the passkey page
    if (isUsingPasskey) {
      setPasskeyError(null);
      setIsUsingPasskey(false);

      return;
    }

    // ... otherwise, we are coming from the sign in/signup page
    resetPasswordInput();
    setPasswordError(null);
    setHasPasskeyInVault(false);
    setHasPasswordInVault(false);
    setVault(null);
  }, [isUsingPasskey, setIsUsingPasskey, resetPasswordInput, setVault, vault]);
  const handleOnContinueClick = useCallback(async () => {
    let _hasPasskeyInVault: boolean;
    let _hasPasswordInVault: boolean;
    let _settings: SettingsStoreSchema;
    let _vault: Vault;

    if (!clientInformation || !logger || validateUsernameInput()) {
      return;
    }

    _vault = await initializeVault({
      logger,
      username: usernameInputProps.value,
    });
    _hasPasskeyInVault = !!(await new PasskeyStore({
      hostname: clientInformation.hostname,
      logger,
      username: usernameInputProps.value,
      vault: _vault,
    }).passkey());
    _hasPasswordInVault = !!(await new PasswordStore({
      hostname: clientInformation.hostname,
      logger,
      username: usernameInputProps.value,
      vault: _vault,
    }).challenge());

    setVault(_vault);
    setHasPasskeyInVault(_hasPasskeyInVault);
    setHasPasswordInVault(_hasPasswordInVault);

    // if there was a previous login, set the saved color mode
    if (_hasPasskeyInVault || _hasPasswordInVault) {
      _settings = await new SettingsStore({
        logger,
        vault: _vault,
      }).settings();

      onSetColorMode(_settings.colorMode);
    }
  }, [
    clientInformation,
    logger,
    onSetColorMode,
    setHasPasskeyInVault,
    setHasPasswordInVault,
    setVault,
    usernameInputProps.value,
    validateUsernameInput,
  ]);
  const handleOnPasswordKeyUp = useCallback(async (event: KeyboardEvent<HTMLInputElement>) => event.key === 'Enter' && await handleOnAuthenticateWithPasswordClick(), [handleOnAuthenticateWithPasswordClick]);
  const handleOnToggleColorModeClick = useCallback(() => onSetColorMode(colorMode === 'light' ? 'dark' : 'light'), [colorMode, onSetColorMode]);
  const handleOnUsernameKeyUp = useCallback(async (event: KeyboardEvent<HTMLInputElement>) => event.key === 'Enter' && await handleOnContinueClick(), [handleOnContinueClick]);

  return (
    <Modal
      closeOnEscape={true}
      closeOnInteractOutside={true}
      colorMode={colorMode}
      body={(
        <VStack align="center" fullWidth={true} grow={true} minHeight={250} paddingX={DEFAULT_PADDING} spacing="md">
          {(() => {
            // if the vault has been initialized, it is time to login or signup
            if (vault) {
              // if the passkey authentication is in process
              if (isUsingPasskey) {
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
                        onClick={handleOnAuthenticateWithPasskeyClick}
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
              }

              // if there is either a password or passkey in the vault, it is a login
              if (hasPasskeyInVault || hasPasswordInVault) {
                return (
                  <>
                    <Heading colorMode={colorMode}>{translate('headings.welcomeBack')}</Heading>

                    {hasPasswordInVault && (
                      <>
                        <PasswordInput
                          {...passwordInputProps}
                          colorMode={colorMode}
                          onKeyUp={handleOnPasswordKeyUp}
                          placeholder={translate('placeholders.password')}
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

                        <Button
                          colorMode={colorMode}
                          fullWidth={true}
                          onClick={handleOnAuthenticateWithPasswordClick}
                          rightIcon={<SignInIcon />}
                          type="submit"
                        >
                          {translate('buttons.signInWithPassword')}
                        </Button>
                      </>
                    )}

                    {hasPasskeyInVault && hasPasswordInVault && (
                      <HStack align="center" fullWidth={true} justify="center" spacing="sm">
                        <div className={clsx(styles.divider)} />

                        <Text colorMode={colorMode} size="lg">
                          {translate('captions.or')}
                        </Text>

                        <div className={clsx(styles.divider)} />
                      </HStack>
                    )}

                    {hasPasskeyInVault && PasskeyStore.isSupported() && (
                      <Button
                        colorMode={colorMode}
                        fullWidth={true}
                        onClick={handleOnAuthenticateWithPasskeyClick}
                        rightIcon={<PasskeyIcon />}
                      >
                        {translate('buttons.signupWithPasskey')}
                      </Button>
                    )}
                  </>
                );
              }

              // ... otherwise, it is a fresh signup
              return (
                <>
                  <Heading colorMode={colorMode}>{translate('headings.finishCreatingANewAccount')}</Heading>

                  <NewPasswordInput
                    {...passwordInputProps}
                    colorMode={colorMode}
                    onKeyUp={handleOnPasswordKeyUp}
                    placeholder={translate('placeholders.password')}
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

                  <Button
                    colorMode={colorMode}
                    fullWidth={true}
                    onClick={handleOnAuthenticateWithPasswordClick}
                    rightIcon={<SignInIcon />}
                    type="submit"
                  >
                    {translate('buttons.signupWithPassword')}
                  </Button>

                  {PasskeyStore.isSupported() && (
                    <>
                      <HStack align="center" fullWidth={true} justify="center" spacing="sm">
                        <div className={clsx(styles.divider)} />

                        <Text colorMode={colorMode} size="lg">
                          {translate('captions.or')}
                        </Text>

                        <div className={clsx(styles.divider)} />
                      </HStack>

                      <Button
                        colorMode={colorMode}
                        fullWidth={true}
                        onClick={handleOnAuthenticateWithPasskeyClick}
                        rightIcon={<PasskeyIcon />}
                      >
                        {translate('buttons.signupWithPasskey')}
                      </Button>
                    </>
                  )}
                </>
              );
            }

            // ... otherwise, it is username selection
            return (
              <>
                <Heading colorMode={colorMode}>{translate('headings.signInOrCreateANewAccount')}</Heading>

                <Input
                  {...usernameInputProps}
                  autocomplete="username email"
                  colorMode={colorMode}
                  onKeyUp={handleOnUsernameKeyUp}
                  placeholder={translate('placeholders.usernameEmail')}
                  type="text"
                />

                <Spacer />

                <VStack align="center" fullWidth={true} justify="center" spacing="sm">
                  <Button
                    colorMode={colorMode}
                    fullWidth={true}
                    onClick={handleOnContinueClick}
                    rightIcon={<ArrowRightIcon />}
                  >
                    {translate('buttons.continue')}
                  </Button>
                </VStack>
              </>
            );
          })()}
        </VStack>
      )}
      footer={(
        <Footer colorMode={colorMode} />
      )}
      header={(
        <HStack align="center" fullWidth={true} padding={DEFAULT_PADDING} spacing="xs">
          {vault && (
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
            <IconButton colorMode={colorMode} icon={<CloseIcon />} onClick={handleClose} />
          </HStack>
        </HStack>
      )}
      onClose={handleClose}
      onCloseAnimationEnd={onClose}
      open={open}
    />
  );
};

Root.displayName = 'Root';

export default Root;
