import clsx from 'clsx';
import type { FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';

// components
import VStack from '@/ui/components/VStack';

// styles
import styles from './styles.module.scss';

// types
import type { ConnectedAccountCardContentProps } from './types';

const ConnectedAccountCardContent: FunctionComponent<ConnectedAccountCardContentProps> = () => {
  return (
    <VStack className={clsx(styles.footerContent)}>

    </VStack>
  );
};

export default ConnectedAccountCardContent;
