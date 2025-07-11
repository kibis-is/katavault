import clsx from 'clsx';
import type { FunctionComponent, JSX } from 'preact';

// styles
import styles from './styles.module.scss';

// types
import type { BaseComponentProps } from '@/ui/types';
import type { Props } from './types';
import VStack from '@/ui/components/VStack';

const Input: FunctionComponent<JSX.InputHTMLAttributes & BaseComponentProps & Props> = ({
  colorMode,
  error,
  hint,
  ...inputProps
}) => {
  return (
    <VStack align="center" fullWidth={true} justify="center" spacing="xs">
      <input
        {...inputProps}
        className={clsx(styles.input, error && styles.inputError)}
        data-color-mode={colorMode}
      />

      {error && (
        <span className={clsx(styles.errorText)}>
          {error}
        </span>
      )}

      {hint && (
        <span className={clsx(styles.hintText)}>
          {hint}
        </span>
      )}
    </VStack>
  );
};

export default Input;
