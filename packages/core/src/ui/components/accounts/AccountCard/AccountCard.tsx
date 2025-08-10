import clsx from 'clsx';
import { type FunctionComponent } from 'preact';
import { useCallback, useMemo, useState } from 'preact/hooks';

// components
import Accordion from '@/ui/components/containers/Accordion';
import ConnectedAccountCardContent from './ConnectedAccountCardContent';
import CopyIconButton from '@/ui/components/buttons/CopyIconButton';
import EphemeralAccountCardContent from './EphemeralAccountCardContent';
import HStack from '@/ui/components/layouts/HStack';
import Spacer from '@/ui/components/layouts/Spacer';
import Text from '@/ui/components/typography/Text';
import VStack from '@/ui/components/layouts/VStack';

// enums
import { AccountTypeEnum } from '@/enums';

// hooks
import useSubTextColor from '@/ui/hooks/colors/useSubTextColor';
import useTranslate from '@/ui/hooks/i18n/useTranslate';

// styles
import styles from './styles.module.scss';

// types
import type { Props } from './types';

const AccountCard: FunctionComponent<Props> = ({ account, chains, colorMode }) => {
  // hooks
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
          {/*account name*/}
          <HStack align="center" fullWidth={true} spacing="xs">
            {account.name && (
              <Text
                bold={true}
                colorMode={colorMode}
                maxWidth={textWidth}
                textAlign="left"
                title={translate('labels.name')}
                truncate={true}
              >
                {account.name}
              </Text>
            )}
          </HStack>

          {/*account id*/}
          <HStack align="center" fullWidth={true} spacing="xs">
            <Text
              colorMode={colorMode}
              color={subTextColor}
              maxWidth={textWidth}
              size="sm"
              textAlign="left"
              title={`${translate('labels.accountID')}: ${account.key}`}
              truncate={true}
            >
              {account.key}
            </Text>

            <Spacer />

            {/*copy account id button*/}
            <CopyIconButton colorMode={colorMode} size="xs" text={account.key} title={translate('captions.copyAccountID')} />
          </HStack>
        </VStack>

        {/*footer*/}
        <Accordion
          buttonClassName={clsx(styles.footerButton, !isFooterOpen && styles.footerButtonClosed)}
          colorMode={colorMode}
          containerClassName={clsx(styles.footer)}
          content={account.__type === AccountTypeEnum.Ephemeral ? (
            <EphemeralAccountCardContent
              account={account}
              chains={chains}
              colorMode={colorMode}
            />
          ) : (
            <ConnectedAccountCardContent account={account} colorMode={colorMode} />
          )}
          onClick={handleOnFooterClick}
          open={isFooterOpen}
          title={(
            <Text colorMode={colorMode} fullWidth={true} textAlign="left">
              {account.__type === AccountTypeEnum.Ephemeral ? translate('headings.networks') : translate('headings.connections', {
                count: account.connections.length,
              })}
            </Text>
          )}
        />
      </VStack>
    </div>
  );
};

export default AccountCard;
