import clsx from 'clsx';
import { type FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';

// components
import HStack from '@/ui/components/HStack';
import IconButton from '@/ui/components/IconButton';
import Spacer from '@/ui/components/Spacer';
import Text from '@/ui/components/Text';
import VStack from '@/ui/components/VStack';

// hooks
import useSubTextColor from '@/ui/hooks/useSubTextColor';

// icons
import CopyIcon from '@/ui/icons/CopyIcon';

// styles
import styles from './styles.module.scss';

// types
import type { Props } from './types';

const AccountCard: FunctionComponent<Props> = ({ account, colorMode }) => {
  // hooks
  const subTextColor = useSubTextColor(colorMode);
  // memos
  const textWidth = useMemo(() => '12.5rem', []);

  return (
    <div className={clsx(styles.container)} data-color-mode={colorMode}>
      <VStack fullHeight={true} fullWidth={true} spacing="xs">
        <VStack fullWidth={true} spacing="xs">
          <Text bold={true} colorMode={colorMode} textAlign="left">
            {account.name ?? account.key}
          </Text>

          {account.name && (
            <HStack align="center" fullWidth={true} spacing="xs">
              <Text colorMode={colorMode} color={subTextColor} size="sm" textAlign="left" truncate={true} width={textWidth}>
                {account.key}
              </Text>

              <Spacer />

              <IconButton colorMode={colorMode} icon={<CopyIcon />} size="sm" />
            </HStack>
          )}
        </VStack>

        <Spacer />
      </VStack>
    </div>
  );
};

export default AccountCard;
