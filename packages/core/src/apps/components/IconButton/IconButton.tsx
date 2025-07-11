import clsx from 'clsx';
import { cloneElement, type FunctionComponent, type JSX } from 'preact';

// hooks
import useDefaultTextColor from '@/apps/hooks/useDefaultTextColor';

// styles
import styles from './styles.module.scss';

// types
import type { BaseComponentProps } from '@/apps/types';
import type { Props } from './types';

const IconButton: FunctionComponent<Omit<JSX.HTMLAttributes<HTMLButtonElement>, 'icon'> & BaseComponentProps & Props> = ({
  colorMode,
  icon,
  ...buttonProps
}) => {
  // hooks
  const defaultTextColor = useDefaultTextColor(colorMode);

  return (
    <button {...buttonProps} className={clsx(styles.iconButton)} data-color-mode={colorMode}>
      {cloneElement(icon, {
        ...icon.props,
        className: clsx(styles.iconButtonIcon),
        color: defaultTextColor,
      })}
    </button>
  );
};

export default IconButton;
