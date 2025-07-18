import clsx from 'clsx';
import type { FunctionComponent, JSX } from 'preact';

// components
import VStack from '@/ui/components/layouts/VStack';

// styles
import styles from './styles.module.scss';

// types
import type { BaseComponentProps } from '@/ui/types';
import type { Props } from './types';

const Input: FunctionComponent<JSX.InputHTMLAttributes & BaseComponentProps & Props> = ({
  colorMode,
  error,
  hint,
  label,
  ...inputProps
}) => {
  return (
    <VStack align="center" fullWidth={true} justify="center" spacing="xs">
      {label && (
        <span className={clsx(styles.label)} data-color-mode={colorMode}>
          {label}{inputProps.required && <span className={clsx(styles.label, styles.labelAsterisk)} data-color-mode={colorMode}> *</span>}
        </span>
      )}

      <input
        {...inputProps}
        className={clsx(styles.input, error && styles.inputError)}
        data-color-mode={colorMode}
      />

      {hint && (
        <span className={clsx(styles.hintText)} data-color-mode={colorMode}>
          {hint}
        </span>
      )}

      {error && (
        <span className={clsx(styles.errorText)} data-color-mode={colorMode}>
          {error}
        </span>
      )}
    </VStack>
  );
};

export default Input;
