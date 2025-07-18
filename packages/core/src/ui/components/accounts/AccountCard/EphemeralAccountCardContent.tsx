import { CAIP002Namespace, type Chain } from '@kibisis/chains';
import { base58 } from '@kibisis/encoding';
import clsx from 'clsx';
import { type FunctionComponent } from 'preact';
import { useCallback, useMemo } from 'preact/hooks';

// components
import CopyIconButton from '@/ui/components/buttons/CopyIconButton';
import HStack from '@/ui/components/layouts/HStack';
import Spacer from '@/ui/components/layouts/Spacer';
import Text from '@/ui/components/typography/Text';
import VStack from '@/ui/components/layouts/VStack';

// decorators
import AVMAddress from '@/decorators/avm/AVMAddress';

// hooks
import useSubTextColor from '@/ui/hooks/colors/useSubTextColor';
import useTranslate from '@/ui/hooks/i18n/useTranslate';

// styles
import styles from './styles.module.scss';

// types
import type { EphemeralAccountCardContentProps } from './types';

// utilities
import dataURIToImageElement from '@/ui/utilities/dataURIToImageElement';
import truncateText from '@/ui/utilities/truncateText';

const EphemeralAccountCardContent: FunctionComponent<EphemeralAccountCardContentProps> = ({ account, chains, colorMode }) => {
  // hooks
  const subTextColor = useSubTextColor(colorMode);
  const translate = useTranslate();
  // memos
  const avmAddress = useMemo(() => AVMAddress.fromPublicKey(base58.decode(account.key)), [account]);
  const avmChains = useMemo(() => chains.filter((avmChain) => avmChain.namespace() === CAIP002Namespace.Algorand || avmChain.namespace() === CAIP002Namespace.AVM), [chains]);
  // callbacks
  const chainElements = useCallback((_chains: Chain[]) => (
    <HStack spacing="xs">
      {_chains.map((chain) => {
        const element = dataURIToImageElement({
          className: clsx(styles.chainIcon),
          dataURI: chain.iconURI(),
          key: chain.chainID(),
          title: chain.displayName(),
        });

        if (!element) {
          return null;
        }

        return element;
      })}
    </HStack>
  ), []);

  return (
    <VStack className={clsx(styles.footerContent)} spacing="sm">
      {/*avm chains*/}
      {avmChains.length > 0 && (
        <VStack fullWidth={true} spacing="sm">
          <HStack align="center" fullWidth={true} spacing="xs">
            <VStack>
              <Text colorMode={colorMode} size="sm">
                {translate('labels.avm')}
              </Text>

              <Text colorMode={colorMode} color={subTextColor} size="xs" title={avmAddress.address()}>
                {truncateText(avmAddress.address(), {
                  end: 15,
                  start: 15,
                })}
              </Text>
            </VStack>

            <Spacer />

            <CopyIconButton colorMode={colorMode} size="xs" text={avmAddress.address()} title={translate('captions.copyAVMAddress')} />
          </HStack>

          {/*chains*/}
          {chainElements(avmChains)}
        </VStack>
      )}
    </VStack>
  );
};

export default EphemeralAccountCardContent;
