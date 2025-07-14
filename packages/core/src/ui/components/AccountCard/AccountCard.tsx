import clsx from 'clsx';
import { type FunctionComponent } from 'preact';
import { useCallback, useMemo, useState } from 'preact/hooks';

// components
import Accordion from '@/ui/components/Accordion';
import CopyIconButton from '@/ui/components/CopyIconButton';
import HStack from '@/ui/components/HStack';
import Spacer from '@/ui/components/Spacer';
import Text from '@/ui/components/Text';
import VStack from '@/ui/components/VStack';

// enums
import { AccountTypeEnum, EphemeralAccountOriginEnum } from '@/enums';

// hooks
import useDefaultTextColor from '@/ui/hooks/useDefaultTextColor';
import useSubTextColor from '@/ui/hooks/useSubTextColor';
import useTranslate from '@/ui/hooks/useTranslate';

// icons
import KeyIcon from '@/ui/icons/KeyIcon';

// styles
import styles from './styles.module.scss';

// types
import type { Props } from './types';

const AccountCard: FunctionComponent<Props> = ({ account, colorMode }) => {
  // hooks
  const defaultTextColor = useDefaultTextColor(colorMode);
  const subTextColor = useSubTextColor(colorMode);
  const translate = useTranslate();
  // states
  const [isFooterOpen, setIsFooterOpen] = useState(false);
  // memos
  const textWidth = useMemo(() => '12.5rem', []);
  // callbacks
  const handleOnFooterClick = useCallback(() => setIsFooterOpen(!isFooterOpen), [isFooterOpen, setIsFooterOpen]);

  return (
    <div className={clsx(styles.container)} data-color-mode={colorMode}>
      <VStack className={clsx(styles.content)} fullWidth={true}>
        {/*header*/}
        <VStack className={clsx(styles.header)} fullWidth={true} spacing="xs">
          <HStack align="center" fullWidth={true} spacing="xs">
            {account.name && (
              <Text bold={true} colorMode={colorMode} maxWidth={textWidth} textAlign="left" truncate={true}>
                {account.name}
              </Text>
            )}

            <Spacer />

            {account.__type === AccountTypeEnum.Ephemeral && account.origin === EphemeralAccountOriginEnum.Credential && (
              <KeyIcon className={clsx(styles.originIcon)} color={defaultTextColor} title={translate('labels.credentialAccount')} />
            )}
          </HStack>

          <HStack align="center" fullWidth={true} spacing="xs">
            <Text
              colorMode={colorMode}
              color={subTextColor}
              maxWidth={textWidth}
              size="sm"
              textAlign="left"
              truncate={true}
            >
              {account.key}
            </Text>

            <Spacer />

            <CopyIconButton colorMode={colorMode} size="xs" text={account.key} title={translate('captions.copyAccountID')} />
          </HStack>
        </VStack>

        {/*footer*/}
        <Accordion
          buttonClassName={clsx(styles.footerButton, !isFooterOpen && styles.footerButtonClosed)}
          colorMode={colorMode}
          containerClassName={clsx(styles.footer)}
          content={(
            <div style={{ height: '100px' }}>
              <Text colorMode={colorMode} fullWidth={true} textAlign="left">
                {translate('headings.networks')}
              </Text>
            </div>
          )}
          onClick={handleOnFooterClick}
          open={isFooterOpen}
          title={(
            <Text colorMode={colorMode} fullWidth={true} textAlign="left">
              {translate('headings.networks')}
            </Text>
          )}
        />
      </VStack>
    </div>
  );
};

export default AccountCard;
