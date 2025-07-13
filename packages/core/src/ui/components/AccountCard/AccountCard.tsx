import clsx from 'clsx';
import { type FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';

// components
import CopyIconButton from '@/ui/components/CopyIconButton';
import HStack from '@/ui/components/HStack';
import Spacer from '@/ui/components/Spacer';
import Text from '@/ui/components/Text';
import VStack from '@/ui/components/VStack';

// hooks
import useDefaultTextColor from '@/ui/hooks/useDefaultTextColor';
import useSubTextColor from '@/ui/hooks/useSubTextColor';

// icons
// styles
import styles from './styles.module.scss';

// types
import type { Props } from './types';
import { AccountTypeEnum, EphemeralAccountOriginEnum } from '@/enums';
import KeyIcon from '@/ui/icons/KeyIcon';

const AccountCard: FunctionComponent<Props> = ({ account, colorMode }) => {
  // hooks
  const defaultTextColor = useDefaultTextColor(colorMode);
  const subTextColor = useSubTextColor(colorMode);
  // memos
  const textWidth = useMemo(() => '12.5rem', []);

  return (
    <div className={clsx(styles.container)} data-color-mode={colorMode}>
      <VStack fullHeight={true} fullWidth={true} spacing="xs">
        <VStack fullWidth={true} spacing="xs">
          <HStack align="center" fullWidth={true} spacing="xs">
            {account.name && (
              <Text bold={true} colorMode={colorMode} textAlign="left" truncate={true} width={textWidth}>
                {account.name}
              </Text>
            )}

            <Spacer />

            {account.__type === AccountTypeEnum.Ephemeral && account.origin === EphemeralAccountOriginEnum.Credential && (
              <KeyIcon className={clsx(styles.originIcon)} color={defaultTextColor} title="Credential account" />
            )}
          </HStack>

          <HStack align="center" fullWidth={true} spacing="xs">
            <Text
              colorMode={colorMode}
              color={subTextColor}
              size="sm"
              textAlign="left"
              truncate={true}
              width={textWidth}
            >
              {account.key}
            </Text>

            <Spacer />

            <CopyIconButton colorMode={colorMode} size="xs" text={account.key} />
          </HStack>
        </VStack>

        <Spacer />
      </VStack>
    </div>
  );
};

export default AccountCard;
