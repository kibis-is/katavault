import clsx from 'clsx';
import type { FunctionComponent } from 'preact';

// components
import HStack from '@/ui/components/layouts/HStack';
import VStack from '@/ui/components/layouts/VStack';

// icons
import WalletIcon from '@/ui/icons/WalletIcon';

// styles
import styles from './styles.module.scss';

// types
import type { ConnectedAccountCardContentProps } from './types';

// utilities
import dataURIToImageElement from '@/ui/utilities/dataURIToImageElement';

const ConnectedAccountCardContent: FunctionComponent<ConnectedAccountCardContentProps> = ({ account }) => {
  return (
    <VStack className={clsx(styles.footerContent)}>
      <HStack spacing="xs">
        {account.connections.map(({ wallet }) => {
          const defaultIcon = (<WalletIcon className={clsx(styles.connectorIcon)} />);

          if (!wallet.iconURI) {
            return defaultIcon;
          }

          return dataURIToImageElement({
            className: clsx(styles.connectorIcon),
            dataURI: wallet.iconURI,
            title: wallet.name,
          }) ?? defaultIcon;
        })}
      </HStack>
    </VStack>
  );
};

export default ConnectedAccountCardContent;
