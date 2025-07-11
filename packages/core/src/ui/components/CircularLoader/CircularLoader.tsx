import clsx from 'clsx';
import type { FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';

// styles
import styles from './styles.module.scss';

// types
import type { BaseComponentProps } from '@/ui/types';
import type { Props } from './types';

const CircularLoader: FunctionComponent<BaseComponentProps & Props> = ({ color, colorMode, trackColor, size = 'md' }) => {
  // memos
  const sizeStyle = useMemo(() => {
    switch (size) {
      case 'xs':
        return styles.loaderXs;
      case 'sm':
        return styles.loaderSm;
      case 'lg':
        return styles.loaderLg;
      case 'xl':
        return styles.loaderXl;
      case 'md':
      default:
        return styles.loaderMd;
    }
  }, [size]);

  return (
    <span
      className={clsx(styles.loader, sizeStyle)}
      data-color-mode={colorMode}
      style={{
        ...(color && {
          borderColor: color,
        }),
        ...(trackColor && {
          borderBottomColor: trackColor,
        })
      }}
    />
  );
};

export default CircularLoader;
