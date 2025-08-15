import clsx from 'clsx';
import { type FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';

// hooks
import useDefaultTextColor from '@/ui/hooks/colors/useDefaultTextColor';

// styles
import styles from './styles.module.scss';

// types
import type { Props } from './types';

// utilities
import dataURIToImageElement from '@/ui/utilities/dataURIToImageElement';

const CurrencyIcon: FunctionComponent<Props> = ({
  chain,
  className,
  colorMode,
  color,
  key,
  size = 'md',
}) => {
  // hooks
  const defaultTextColor = useDefaultTextColor(colorMode);
  // memos
  const iconSizeStyle = useMemo(() => {
    switch (size) {
      case 'xs':
        return styles.iconXs;
      case 'sm':
        return styles.iconSm;
      case 'lg':
        return styles.iconLg;
      case 'xl':
        return styles.iconXl;
      case 'md':
      default:
        return styles.iconMd;
    }
  }, [size]);
  const iconURI = useMemo(() => chain.nativeCurrency().iconURI ?? null, [chain]);

  if (!iconURI) {
    return null;
  }

  return dataURIToImageElement({
    className: clsx(styles.icon, iconSizeStyle, className),
    color: color ?? defaultTextColor,
    dataURI: iconURI,
    key,
    title: chain.displayName(),
  });
};

export default CurrencyIcon;
