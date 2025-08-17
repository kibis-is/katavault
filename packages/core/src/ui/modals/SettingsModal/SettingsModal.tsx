import type { FunctionComponent } from 'preact';
import { useCallback, useMemo } from 'preact/hooks';

// components
import Footer from '@/ui/components/containers/Footer';
import Heading from '@/ui/components/typography/Heading';
import HStack from '@/ui/components/layouts/HStack';
import IconButton from '@/ui/components/buttons/IconButton';
import Modal from '@/ui/components/layouts/Modal';
import SettingsItemCard from '@/ui/components/settings/SettingsItemCard';
import SettingsSubHeading from '@/ui/components/settings/SettingsSubHeading';
import Spacer from '@/ui/components/layouts/Spacer';
import Switch from '@/ui/components/inputs/Switch';
import Text from '@/ui/components/typography/Text';
import VStack from '@/ui/components/layouts/VStack';

// constants
import { DEFAULT_PADDING } from '@/ui/constants';

// hooks
import useDefaultTextColor from '@/ui/hooks/colors/useDefaultTextColor';
import useSettingsColorMode from '@/ui/hooks/settings/useSettingsColorMode';
import useSettingsToggleColorMode from '@/ui/hooks/settings/useSettingsToggleColorMode';
import useTranslate from '@/ui/hooks/i18n/useTranslate';

// icons
import CloseIcon from '@/ui/icons/CloseIcon';
import InfoIcon from '@/ui/icons/InfoIcon';
import PaletteIcon from '@/ui/icons/PaletteIcon';

// types
import type { Props } from './types';

const SettingsModal: FunctionComponent<Props> = ({
  onClose,
  open,
}) => {
  // hooks
  const colorMode = useSettingsColorMode();
  const defaultTextColor = useDefaultTextColor(colorMode);
  const toggleColorMode = useSettingsToggleColorMode();
  const translate = useTranslate();
  // memos
  const maxWidth = useMemo(() => 380, []);
  // callbacks
  const handleOnToggleColorModeClick = useCallback(() => toggleColorMode(), [toggleColorMode]);

  return (
    <Modal
      closeOnEscape={true}
      closeOnInteractOutside={true}
      colorMode={colorMode}
      body={(
        <VStack align="center" fullWidth={true} grow={true} paddingBottom={DEFAULT_PADDING} paddingX={DEFAULT_PADDING} spacing="md">
          {/*appearance*/}
          <VStack align="center" fullWidth={true} maxWidth={maxWidth} spacing="sm">
            <SettingsSubHeading colorMode={colorMode} icon={<PaletteIcon />}>
              {translate('headings.appearance')}
            </SettingsSubHeading>

            <VStack align="center" fullWidth={true} spacing="xs">
              {/*color mode*/}
              <SettingsItemCard
                colorMode={colorMode}
                item={(
                  <Switch colorMode={colorMode} checked={colorMode === 'dark'} onChange={handleOnToggleColorModeClick} />
                )}
                title={translate('labels.darkMode')}
              />
            </VStack>
          </VStack>

          {/*about*/}
          <VStack align="center" fullWidth={true} maxWidth={maxWidth} spacing="sm">
            <SettingsSubHeading colorMode={colorMode} icon={<InfoIcon />}>
              {translate('headings.about')}
            </SettingsSubHeading>

            <VStack align="center" fullWidth={true} spacing="xs">
              {/*version*/}
              <SettingsItemCard
                colorMode={colorMode}
                item={(
                  <Text color={defaultTextColor} colorMode={colorMode} fullWidth={true} size="sm" textAlign="right">
                    {__VERSION__}
                  </Text>
                )}
                title={translate('labels.version')}
              />
            </VStack>
          </VStack>
        </VStack>
      )}
      footer={(
        <Footer colorMode={colorMode} />
      )}
      header={(
        <HStack  align="center" fullWidth={true} padding={DEFAULT_PADDING} spacing="xs">
          {/*title*/}
          <Heading colorMode={colorMode} textAlign="left">
            {translate('headings.settings')}
          </Heading>

          <Spacer />

          {/*close button*/}
          <IconButton colorMode={colorMode} icon={<CloseIcon />} onClick={onClose} />
        </HStack>
      )}
      onClose={onClose}
      open={open}
    />
  );
};

export default SettingsModal;
