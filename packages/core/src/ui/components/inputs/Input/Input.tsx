import clsx from 'clsx';
import { cloneElement, FunctionComponent } from 'preact';

// components
import VStack from '@/ui/components/layouts/VStack';

// styles
import styles from './styles.module.scss';

// types
import type { Props } from './types';

const Input: FunctionComponent<Props> = ({
  colorMode,
  error,
  hint,
  label,
  rightButton,
  ...inputProps
}) => {
  return (
    <VStack align="center" fullWidth={true} justify="center" spacing="xs">
      {label && (
        <span className={clsx(styles.label)} data-color-mode={colorMode}>
          {label}{inputProps.required && <span className={clsx(styles.label, styles.labelAsterisk)} data-color-mode={colorMode}> *</span>}
        </span>
      )}

      <div className={clsx(styles.container, error && styles.containerError)} data-color-mode={colorMode}>
        <input
          {...inputProps}
          className={clsx(styles.input)}
          data-color-mode={colorMode}
        />

        {rightButton && (cloneElement(rightButton, {
          className: clsx(styles.button),
        }))}
      </div>

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
