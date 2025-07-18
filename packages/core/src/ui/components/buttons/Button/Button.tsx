import clsx from 'clsx';
import { cloneElement, type FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';

// components
import HStack from '@/ui/components/layouts/HStack';

// hooks
import useButtonTextColor from '@/ui/hooks/colors/useButtonTextColor';
import usePrimaryColor from '@/ui/hooks/colors/usePrimaryColor';

// styles
import styles from './styles.module.scss';

// types
import type { Props } from './types';

const Button: FunctionComponent<Props> = ({
  children,
  className,
  colorMode,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  size = 'md',
  variant = 'primary',
  ...buttonProps
}) => {
  // hooks
  const buttonTextColor = useButtonTextColor(colorMode);
  const primaryColor = usePrimaryColor(colorMode);
  // memos
  const [buttonVariantStyle, iconColor] = useMemo(() => {
    if (variant === 'secondary') {
      return [styles.buttonSecondary, primaryColor];
    }

    return [styles.buttonPrimary, buttonTextColor];
  }, [buttonTextColor, primaryColor, variant]);
  const [buttonSizeStyle, iconSizeStyle] = useMemo(() => {
    switch (size) {
      case 'xs':
        return [styles.buttonXs, styles.iconXs];
      case 'sm':
        return [styles.buttonSm, styles.iconXs];
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
    <button
      {...buttonProps}
      className={clsx(styles.button, buttonSizeStyle, buttonVariantStyle, disabled && styles.buttonDisabled, fullWidth && styles.buttonFullWidth, className)}
      data-color-mode={colorMode}
    >
      {leftIcon || rightIcon ? (
        <HStack align="center" fullWidth={true} justify="center" spacing="xs">
          {leftIcon &&
            cloneElement(leftIcon, {
              className: clsx(styles.icon, iconSizeStyle),
              color: iconColor,
            })}

          {children}

          {rightIcon &&
            cloneElement(rightIcon, {
              className: clsx(styles.icon, iconSizeStyle),
              color: iconColor,
            })}
        </HStack>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
