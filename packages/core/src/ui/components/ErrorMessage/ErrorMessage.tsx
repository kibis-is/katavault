import clsx from 'clsx';
import type { FunctionComponent } from 'preact';

// components
import HStack from '@/ui/components/HStack';
import Text from '@/ui/components/Text';

// hooks
import useDefaultTextColor from '@/ui/hooks/colors/useDefaultTextColor';

// icons
import CircleXIcon from '@/ui/icons/CircleXIcon';

// styles
import styles from './styles.module.scss';

// types
import type { BaseComponentProps } from '@/ui/types';
import type { Props } from './types';

const ErrorMessage: FunctionComponent<BaseComponentProps & Props> = ({ colorMode, message }) => {
  // hooks
  const defaultTextColor = useDefaultTextColor("dark");

  return (
    <div className={clsx(styles.container)} data-color-mode={colorMode}>
      <HStack align="center" fullWidth={true} padding="0.75rem" spacing="sm">
        <CircleXIcon className={styles.icon} color={defaultTextColor} />

        <Text colorMode={colorMode} color={defaultTextColor} fullWidth={true} size="sm" textAlign="left">
          {message}
        </Text>
      </HStack>
    </div>
  );
};

export default ErrorMessage;
