import { type Chain } from '@kibisis/chains';
import BigNumber from 'bignumber.js';
import clsx from 'clsx';
import { type FunctionComponent } from 'preact';
import { useCallback } from 'preact/hooks';

// components
import CopyIconButton from '@/ui/components/buttons/CopyIconButton';
import CurrencyIcon from '@/ui/components/accounts/CurrencyIcon';
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
      className: clsx(styles.circularIcon),
      dataURI: chain.iconURI(),
      key: `chain-icon-${chain.chainID()}`,
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
        const decimals = chain.nativeCurrency().decimals;
        const balanceAsStandardUnit = toStandardUnit({
          decimals,
          value: new BigNumber(balance),
        });

        return (
          <HStack align="center" fullWidth={true} key={``} spacing="sm">
            {/*chain icon*/}
            {chainElement(chain)}

            <VStack fullWidth={true} grow={true} justify="evenly">
              {/*address*/}
              <HStack align="center" fullWidth={true} justify="end">
                <Text bold={true} colorMode={colorMode} color={defaultTextColor} size="md" title={address}>
                  {`${chain.shortName()}:`}
                </Text>

                <Text colorMode={colorMode} color={subTextColor} size="md" title={address}>
                  {truncateText(address, {
                    end: 4,
                    start: 6,
                  })}
                </Text>
              </HStack>

              {/*balance*/}
              <HStack align="center" fullWidth={true} justify="end" spacing="xs">
                <Text bold={true} colorMode={colorMode} color={subTextColor} title={`${formatUnit(balanceAsStandardUnit, {
                  decimals,
                  thousandSeparatedOnly: true,
                })} ${chain.nativeCurrency().symbol.toUpperCase()}`}>
                  {formatUnit(balanceAsStandardUnit, {
                    decimals: balanceAsStandardUnit.gt(1) ? 2 : decimals,
                  })}
                </Text>

                <CurrencyIcon
                  color={subTextColor}
                  colorMode={colorMode}
                  chain={chain}
                  size="xs"
                />
              </HStack>
            </VStack>

            <CopyIconButton colorMode={colorMode} size="xs" text={address} title={translate('captions.copyAddress')} />
          </HStack>
        );
      })}
    </VStack>
  );
};

export default EphemeralAccountCardContent;
