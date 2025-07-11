import clsx from 'clsx';
import type { FunctionComponent, JSX } from 'preact';

// styles
import styles from './styles.module.scss';

// types
import type { BaseComponentProps } from '@/ui/types';
import type { Props } from './types';

const Input: FunctionComponent<JSX.InputHTMLAttributes & BaseComponentProps & Props> = ({
  colorMode,
  error,
  ...inputProps
}) => {
  return (
    <input
      {...inputProps}
      className={clsx(styles.input, error && styles.inputError)}
      data-color-mode={colorMode}
    />
  );
};

export default Input;
