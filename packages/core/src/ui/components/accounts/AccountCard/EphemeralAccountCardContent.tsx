import { Chain } from '@kibisis/chains';
import clsx from 'clsx';
import { type FunctionComponent } from 'preact';
import { useCallback } from 'preact/hooks';

// components
import CopyIconButton from '@/ui/components/buttons/CopyIconButton';
import HStack from '@/ui/components/layouts/HStack';
import Text from '@/ui/components/typography/Text';
import VStack from '@/ui/components/layouts/VStack';

// hooks
import useDefaultTextColor from '@/ui/hooks/colors/useDefaultTextColor';
import useSubTextColor from '@/ui/hooks/colors/useSubTextColor';
import useTranslate from '@/ui/hooks/i18n/useTranslate';

// styles
import styles from './styles.module.scss';

// types
import type { EphemeralAccountCardContentProps } from './types';

// utilities
import { addressFromChain, formatUnit, toStandardUnit } from '@/utilities';
import dataURIToImageElement from '@/ui/utilities/dataURIToImageElement';
import truncateText from '@/ui/utilities/truncateText';

const EphemeralAccountCardContent: FunctionComponent<EphemeralAccountCardContentProps> = ({ account, chains, colorMode }) => {
  // hooks
  const defaultTextColor = useDefaultTextColor(colorMode);
  const subTextColor = useSubTextColor(colorMode);
  const translate = useTranslate();
  // callbacks
  const chainElement = useCallback((chain: Chain) => {
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
  }, []);

  return (
    <VStack className={clsx(styles.footerContent)} spacing="sm">
      {chains.map((chain) => {
        const address = addressFromChain({
          account,
          chain,
        });
        const balance = account.balances[chain.chainID()].amount ?? BigInt(0);
        const balanceAsStandardUnit = toStandardUnit({
          decimals: chain.nativeCurrency().decimals,
          value: new BigNumber(balance),
        });

        return (
          <HStack align="center" fullWidth={true} key={``} spacing="xs">
            {/*icon*/}
            {chainElement(chain)}

            {/*address/balance*/}
            <VStack align="center" fullWidth={true} grow={true} spacing="xs">
              <Text colorMode={colorMode} color={defaultTextColor} size="xs" title={address}>
                {truncateText(address, {
                  end: 10,
                  start: 10,
                })}
              </Text>

              <Text colorMode={colorMode} color={subTextColor} size="xs" title={`${formatUnit(balanceAsStandardUnit, {
                decimals: chain.nativeCurrency().decimals,
                thousandSeparatedOnly: true,
              })} ${chain.nativeCurrency().symbol.toUpperCase()}`}>
                {formatUnit(balanceAsStandardUnit, {
                  decimals: balanceAsStandardUnit.gt(1) ? 2 : chain.nativeCurrency().decimals,
                })}
              </Text>
            </VStack>

            <CopyIconButton colorMode={colorMode} size="xs" text={address} title={translate('captions.copyAddress')} />
          </HStack>
        );
      })}
    </VStack>
  );
};

export default EphemeralAccountCardContent;
