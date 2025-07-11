import clsx from 'clsx';
import { cloneElement, type FunctionComponent, type JSX } from 'preact';
import { useMemo } from 'preact/hooks';

// components
import HStack from '@/ui/components/HStack';

// hooks
import useButtonTextColor from '@/ui/hooks/useButtonTextColor';

// styles
import styles from './styles.module.scss';

// types
import type { BaseComponentProps } from '@/ui/types';
import type { Props } from './types';

const Button: FunctionComponent<Omit<JSX.HTMLAttributes<HTMLButtonElement>, 'children'> & BaseComponentProps & Props> = ({
  children,
  colorMode,
  fullWidth = false,
  leftIcon,
  rightIcon,
  ...buttonProps
}) => {
  // hooks
  const buttonTextColor = useButtonTextColor(colorMode);
  // memos
  const iconSize = useMemo(() => '1.5rem', []);

  return (
    <button
      {...buttonProps}
      className={clsx(styles.button, fullWidth && styles.buttonFullWidth)}
      data-color-mode={colorMode}
    >
      {leftIcon || rightIcon ? (
        <HStack align="center" fullWidth={true} justify="center" spacing="xs">
          {leftIcon &&
            cloneElement(leftIcon, {
              color: buttonTextColor,
              height: iconSize,
              width: iconSize,
            })}

          {children}

          {rightIcon &&
            cloneElement(rightIcon, {
              color: buttonTextColor,
              height: iconSize,
              width: iconSize,
            })}
        </HStack>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
