import clsx from 'clsx';
import { cloneElement, FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';

// hooks
import useDefaultTextColor from '@/ui/hooks/colors/useDefaultTextColor';

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
        return [styles.containerXs, styles.iconXs, styles.loaderXs];
      case 'sm':
        return [styles.containerSm, styles.iconSm, styles.loaderSm];
      case 'lg':
        return [styles.containerLg, styles.iconLg, styles.loaderLg];
      case 'xl':
        return [styles.containerXl, styles.iconXl, styles.loaderXl];
      case 'md':
      default:
        return [styles.containerMd, styles.iconMd, styles.loaderMd];
    }
  }, [size]);

  return (
    <div className={clsx(styles.container, containerSizeStyle)}>
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
        className: clsx(styles.icon, iconSizeStyle),
        color: defaultTextColor,
      })}
    </div>
  );
};

export default CircularLoaderWithIcon;
