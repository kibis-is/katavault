import clsx from 'clsx';
import { cloneElement, FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';

// hooks
import useDefaultTextColor from '@/ui/hooks/useDefaultTextColor';

// styles
import styles from './styles.module.scss';

// types
import type { BaseComponentProps } from '@/ui/types';
import type { Props } from './types';

const CircularLoaderWithIcon: FunctionComponent<BaseComponentProps & Props> = ({ color, colorMode, icon, size = 'md', trackColor }) => {
  // hooks
  const defaultTextColor = useDefaultTextColor(colorMode);
  // memos
  const [containerSizeStyle, iconSizeStyle, loaderSizeStyle] = useMemo(() => {
    switch (size) {
      case 'xs':
        return [styles.loaderContainerXs, styles.loaderIconXs, styles.loaderXs];
      case 'sm':
        return [styles.loaderContainerSm, styles.loaderIconSm, styles.loaderSm];
      case 'lg':
        return [styles.loaderContainerLg, styles.loaderIconLg, styles.loaderLg];
      case 'xl':
        return [styles.loaderContainerXl, styles.loaderIconXl, styles.loaderXl];
      case 'md':
      default:
        return [styles.loaderContainerMd, styles.loaderIconMd, styles.loaderMd];
    }
  }, [size]);

  return (
    <div className={clsx(styles.loaderContainer, containerSizeStyle)}>
      <span
        className={clsx(styles.loader, loaderSizeStyle)}
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

      {cloneElement(icon, {
        ...icon.props,
        className: clsx(styles.loaderIcon, iconSizeStyle),
        color: defaultTextColor,
      })}
    </div>
  );
};

export default CircularLoaderWithIcon;
