import { randomString } from '@stablelib/random';
import clsx from 'clsx';
import type { ChangeEvent, FunctionComponent } from 'preact/compat';
import { useCallback, useMemo } from 'preact/hooks';

// styles
import styles from './styles.module.scss';

// types
import type { Props } from './types';

const Switch: FunctionComponent<Props> = ({ checked, colorMode, disabled = false, onChange, size = 'md' }) => {
  // memos
  const id = useMemo(() => randomString(8), []);
  const [containerSizeStyles, knobSizeStyles, knobCheckedSizeStyles] = useMemo(() => {
    switch (size) {
      case 'xs':
        return [styles.containerXs, styles.knobXs, styles.knobCheckedXs];
      case 'sm':
        return [styles.containerSm, styles.knobSm, styles.knobCheckedSm];
      case 'lg':
        return [styles.containerLg, styles.knobLg, styles.knobCheckedLg];
      case 'xl':
        return [styles.containerXl, styles.knobXl, styles.knobCheckedXl];
      case 'md':
      default:
        return [styles.containerMd, styles.knobMd, styles.knobCheckedMd];
    }
  }, [size]);
  // callbacks
  const handleOnChangeClick = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    if (disabled) {
      return;
    }

    onChange(event);
  }, [checked]);

  return (
    <label
      className={clsx(styles.label, disabled && styles.labelDisabled)}
      htmlFor={id}
    >
      <input
        checked={checked}
        className={clsx(styles.input)}
        disabled={disabled}
        id={id}
        onChange={handleOnChangeClick}
        type="checkbox"
      />

      <span
        className={clsx(styles.container, containerSizeStyles, checked && styles.containerChecked)}
        data-color-mode={colorMode}
      >
        <span
          className={clsx(styles.knob, knobSizeStyles, checked && knobCheckedSizeStyles)}
          data-color-mode={colorMode}
        />
      </span>
    </label>
  );
};

export default Switch;
