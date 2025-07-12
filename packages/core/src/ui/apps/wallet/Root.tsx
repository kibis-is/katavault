import clsx from 'clsx';
import type { FunctionComponent } from 'preact';
import { useCallback, useMemo } from 'preact/hooks';

// components
import Heading from '@/ui/components/Heading';
import HStack from '@/ui/components/HStack';
import IconButton from '@/ui/components/IconButton';
import Spacer from '@/ui/components/Spacer';
import Text from '@/ui/components/Text';
import VStack from '@/ui/components/VStack';

// constants
import { DEFAULT_PADDING } from '@/ui/constants';

// hooks
import useSubTextColor from '@/ui/hooks/useSubTextColor';
import useSettingsColorMode from '@/ui/hooks/useSettingsColorMode';
import useSettingsToggleColorMode from '@/ui/hooks/useSettingsToggleColorMode';
import useTranslate from '@/ui/hooks/useTranslate';

// icons
import MoonIcon from '@/ui/icons/MoonIcon';
import SunnyIcon from '@/ui/icons/SunnyIcon';
import CloseIcon from '@/ui/icons/CloseIcon';

// styles
import styles from './styles.module.scss';

// types
import type { BaseAppProps } from '@/ui/types';
import type { AppProps } from './types';

// utilities
import { usernameFromVault } from '@/utilities';

const Root: FunctionComponent<Pick<BaseAppProps, 'onClose'> & AppProps> = ({ onClose, vault }) => {
  // hooks
  const colorMode = useSettingsColorMode();
  const subTextColor = useSubTextColor(colorMode);
  const translate = useTranslate();
  const toggleColorMode = useSettingsToggleColorMode();
  // memos
  const username = useMemo(() => usernameFromVault(vault), [vault]);
  // callbacks
  const handleOnCloseClick = useCallback(() => onClose(), [onClose]);
  const handleOnToggleColorModeClick = useCallback(() => toggleColorMode(), [toggleColorMode]);

  return (
    <div className={clsx(styles.container)}>
      {/*overlay*/}
      <div className={clsx(styles.overlay)}></div>

      {/*modal*/}
      <div className={clsx(styles.modal)} data-color-mode={colorMode}>
        {/*header*/}
        <HStack align="center" fullWidth={true} paddingBottom={DEFAULT_PADDING} paddingX={DEFAULT_PADDING} spacing="xs">
          <VStack fullHeight={true} justify="evenly" spacing="xs">
            {/*username*/}
            <Text bold={true} colorMode={colorMode} textAlign="left">
              {username}
            </Text>
          </VStack>

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

        <VStack fullWidth={true} grow={true} padding={DEFAULT_PADDING} spacing="sm">
          {/*ephemeral accounts*/}
          <VStack fullWidth={true} justify="center" spacing="xs">
            <Heading colorMode={colorMode} size="sm" textAlign="left">
              {translate('headings.ephemeralAccounts')}
            </Heading>
          </VStack>

          {/*connected accounts*/}
          <VStack fullWidth={true} justify="center" spacing="xs">
            <Heading colorMode={colorMode} size="sm" textAlign="left">
              {translate('headings.connectedAccounts')}
            </Heading>
          </VStack>
        </VStack>
      </div>
    </div>
  );
};

export default Root;
