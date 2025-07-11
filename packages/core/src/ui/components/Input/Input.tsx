import clsx from 'clsx';
import type { FunctionComponent, JSX } from 'preact';

// components
import VStack from '@/ui/components/VStack';

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
        <span className={clsx(styles.label)}>
          {label}{inputProps.required && <span className={clsx(styles.label, styles.labelAsterisk)}> *</span>}
        </span>
      )}

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
