import { chainID } from '@kibisis/chains';
import clsx from 'clsx';
import { type FunctionComponent } from 'preact';

// components
import HStack from '@/ui/components/HStack';
import Text from '@/ui/components/Text';
import VStack from '@/ui/components/VStack';

// hooks
import useTranslate from '@/ui/hooks/i18n/useTranslate';

// styles
import styles from './styles.module.scss';

// types
import type { EphemeralAccountCardContentProps } from './types';

// utilities
import dataURIToImageElement from '@/ui/utilities/dataURIToImageElement';

const EphemeralAccountCardContent: FunctionComponent<EphemeralAccountCardContentProps> = ({ chains, colorMode }) => {
  // hooks
  const translate = useTranslate();

  return (
    <VStack className={clsx(styles.footerContent)} spacing="sm">
      <HStack align="center" spacing="sm">
        <Text colorMode={colorMode} size="sm">
          {`${translate('labels.avm')}:`}
        </Text>

        {/*chains*/}
        <HStack spacing="xs">
          {chains.map((chain) => {
            const element = dataURIToImageElement({
              className: clsx(styles.chainIcon),
              dataURI: chain.iconURI,
              key: chainID(chain),
              title: chain.displayName,
            });

            if (!element) {
              return null;
            }

            return element;
          })}
        </HStack>
      </HStack>
    </VStack>
  );
};

export default EphemeralAccountCardContent;
