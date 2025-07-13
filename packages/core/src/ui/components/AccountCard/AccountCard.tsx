import clsx from 'clsx';
import { type FunctionComponent } from 'preact';

// components
import HStack from '@/ui/components/HStack';
import Spacer from '@/ui/components/Spacer';
import Text from '@/ui/components/Text';
import VStack from '@/ui/components/VStack';

// hooks
import useSubTextColor from '@/ui/hooks/useSubTextColor';

// styles
import styles from './styles.module.scss';

// types
import type { Props } from './types';

const AccountCard: FunctionComponent<Props> = ({ account, colorMode }) => {
  // hooks
  const subTextColor = useSubTextColor(colorMode);

  return (
    <div className={clsx(styles.container)} data-color-mode={colorMode}>
      <VStack fullHeight={true} fullWidth={true} spacing="xs">
        <VStack fullWidth={true} spacing="xs">
          <Text bold={true} colorMode={colorMode} textAlign="left">
            {account.name ?? account.key}
          </Text>

          {account.name && (
            <HStack fullWidth={true} justify="center" spacing="xs">
              <Text colorMode={colorMode} color={subTextColor} size="sm" textAlign="left">
                {account.key}
              </Text>

              <Spacer />
            </HStack>
          )}
        </VStack>

        <Spacer />
      </VStack>
    </div>
  );
};

export default AccountCard;
