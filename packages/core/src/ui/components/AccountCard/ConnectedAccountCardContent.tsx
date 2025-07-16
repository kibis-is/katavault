import clsx from 'clsx';
import type { FunctionComponent } from 'preact';

// components
import HStack from '@/ui/components/HStack';
import VStack from '@/ui/components/VStack';

// icons
import WalletIcon from '@/ui/icons/WalletIcon';

// styles
import styles from './styles.module.scss';

// types
import type { ConnectedAccountCardContentProps } from './types';
import dataURIToImageElement from '@/ui/utilities/dataURIToImageElement';

const ConnectedAccountCardContent: FunctionComponent<ConnectedAccountCardContentProps> = ({ account }) => {
  return (
    <VStack className={clsx(styles.footerContent)}>
      <HStack spacing="xs">
        {account.connectors.map((connector) => {
          const defaultIcon = (<WalletIcon className={clsx(styles.connectorIcon)} />);

          if (!connector.icon) {
            return defaultIcon;
          }

          return dataURIToImageElement({
            className: clsx(styles.connectorIcon),
            dataURI: connector.icon,
            title: connector.name,
          }) ?? defaultIcon;
        })}
      </HStack>
    </VStack>
  );
};

export default ConnectedAccountCardContent;
