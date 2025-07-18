import clsx from 'clsx';
import { cloneElement, type FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';

// hooks
import useDefaultTextColor from '@/ui/hooks/colors/useDefaultTextColor';

// styles
import styles from './styles.module.scss';

// types
import type { Props } from './types';

const IconButton: FunctionComponent<Props> = ({
  className,
  colorMode,
  icon,
  iconColor,
  size = 'md',
  ...buttonProps
}) => {
  // hooks
  const defaultTextColor = useDefaultTextColor(colorMode);
  // memos
  const [buttonSizeStyle, iconSizeStyle] = useMemo(() => {
    switch (size) {
      case 'xs':
        return [styles.buttonXs, styles.iconXs];
      case 'sm':
        return [styles.buttonSm, styles.iconSm];
      case 'lg':
        return [styles.buttonLg, styles.iconLg];
      case 'xl':
        return [styles.buttonXl, styles.iconXl];
      case 'md':
      default:
        return [styles.buttonMd, styles.iconMd];
    }
  }, [size]);

  return (
    <button {...buttonProps} className={clsx(styles.button, buttonSizeStyle, className)} data-color-mode={colorMode}>
      {cloneElement(icon, {
        ...icon.props,
        className: clsx(styles.icon, iconSizeStyle),
        color: iconColor ?? defaultTextColor,
      })}
    </button>
  );
};

export default IconButton;
