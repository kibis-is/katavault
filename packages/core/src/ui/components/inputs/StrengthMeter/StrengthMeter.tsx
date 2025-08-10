import clsx from 'clsx';
import type { FunctionComponent } from 'preact';
import type { CSSProperties } from 'preact/compat';
import { useMemo } from 'preact/hooks';

// styles
import styles from './styles.module.scss';

// types
import type { Props } from './types';

const StrengthMeter: FunctionComponent<Props> = ({ colorMode, score }) => {
  // memos
  const strengthProperties = useMemo<CSSProperties>(() => {
    if (score < 0) {
      return {
        width: '0',
      };
    }

    if (score <= 0) {
      return {
        background: 'darkred',
        width: '20%',
      };
    }

    if (score <= 1) {
      return {
        background: 'orangered',
        width: '40%',
      };
    }

    if (score <= 2) {
      return {
        background: 'orange',
        width: '60%',
      };
    }

    if (score <= 3) {
      return {
        background: 'yellowgreen',
        width: '80%',
      };
    }

    // 4+
    return {
      background: 'green',
      width: '100%',
    };
  }, [score]);

  return (
    <div className={clsx(styles.container)} data-color-mode={colorMode}>
      <div className={clsx(styles.track)} style={strengthProperties} />
    </div>
  );
};

export default StrengthMeter;
