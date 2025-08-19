import clsx from 'clsx';
import type { FunctionComponent } from 'preact';

// styles
import styles from './styles.module.scss';

// types
import type { Props } from './types';

const Divider: FunctionComponent<Props> = ({ colorMode }) => (
  <div className={clsx(styles.divider)} data-color-mode={colorMode}></div>
);

export default Divider;
