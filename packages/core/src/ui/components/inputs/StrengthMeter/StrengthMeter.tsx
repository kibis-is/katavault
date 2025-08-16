import clsx from 'clsx';
import type { FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';

// styles
import styles from './styles.module.scss';

// types
import type { Props } from './types';

const StrengthMeter: FunctionComponent<Props> = ({ colorMode, score }) => {
  // memos
  const strengthTrackStyle = useMemo(() => {
    switch (score) {
      case 0:
        return styles.trackWeakPassword;
      case 1:
        return styles.trackNormalPassword;
      case 2:
        return styles.trackStrongPassword;
      case -1:
      default:
        return styles.trackNoPassword;
    }
  }, [score]);

  return (
    <div className={clsx(styles.container)} data-color-mode={colorMode}>
      <div className={clsx(styles.track, strengthTrackStyle)} data-color-mode={colorMode} />
    </div>
  );
};

export default StrengthMeter;
