import clsx from 'clsx';
import type { FC } from 'react';

// styles
import styles from './styles.module.scss';

const SectionBreak: FC = () => (<div className={clsx(styles['section-break'])} id="huh"/>);

export default SectionBreak;
