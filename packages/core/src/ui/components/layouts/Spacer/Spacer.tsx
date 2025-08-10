import clsx from 'clsx';
import type { FunctionComponent } from 'preact';

// styles
import styles from './styles.module.scss';

const Spacer: FunctionComponent = () => (
  <div className={clsx(styles.spacer)}></div>
);

export default Spacer;
