import clsx from 'clsx';
import type { FunctionComponent } from 'preact';
import { useCallback, useMemo } from 'preact/hooks';

// components
import Heading from '@/ui/components/typography/Heading';
import Stack from '@/ui/components/layouts/Stack';
import Text from '@/ui/components/typography/Text';
import VStack from '@/ui/components/layouts/VStack';

// hooks
import useSubTextColor from '@/ui/hooks/colors/useSubTextColor';
import useTabletAndUp from '@/ui/hooks/screens/useTabletAndUp';

// icons
import WalletIcon from '@/ui/icons/WalletIcon';

// styles
import styles from './styles.module.scss';

// types
import type { Props } from './types';

// utilities
import dataURIToImageElement from '@/ui/utilities/dataURIToImageElement';

const ConnectorButton: FunctionComponent<Props> = ({ colorMode, connector, onClick }) => {
  // hooks
  const subTextColor = useSubTextColor(colorMode);
  const tabletAndUp = useTabletAndUp();
  // memos
  const icon = useMemo(() => {
    const defaultIcon = (<WalletIcon className={clsx(styles.icon)} />);

    if (!connector.icon) {
      return defaultIcon;
    }

    return dataURIToImageElement({
      className: clsx(styles.icon),
      dataURI: connector.icon,
      title: connector.name,
    }) ?? defaultIcon;
  }, [connector.icon, connector.name]);
  // callbacks
  const handleOnClick = useCallback(() => onClick(), [onClick]);

  return (
    <button
      className={clsx(styles.button)}
      data-color-mode={colorMode}
      onClick={handleOnClick}
    >
      <Stack
        align="center"
        className={clsx(styles.content)}
        direction={tabletAndUp ? 'vertical' : 'horizontal'}
        fullWidth={true}
        justify="center"
        spacing="sm"
      >
        {icon}

        <VStack
          align={tabletAndUp ? 'start' : 'center'}
          fullWidth={true}
          justify="evenly"
        >
          <Heading colorMode={colorMode} fullWidth={true} size="sm" textAlign={tabletAndUp ? 'center' : 'left'}>
            {connector.name}
          </Heading>

          {connector.host && (
            <Text className={clsx(styles.host)} colorMode={colorMode} fullWidth={true} color={subTextColor} size="xs" truncate={true} textAlign={tabletAndUp ? 'center' : 'left'}>
              {connector.host}
            </Text>
          )}
        </VStack>
      </Stack>
    </button>
  );
};

export default ConnectorButton;
