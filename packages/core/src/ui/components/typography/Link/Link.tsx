import clsx from 'clsx';
import type { FunctionComponent, JSX } from 'preact';

// styles
import styles from './styles.module.scss';

// types
import type { BaseComponentProps } from '@/ui/types';
import type { Props } from './types';

const Link: FunctionComponent<JSX.AnchorHTMLAttributes & BaseComponentProps & Props> = ({
  children,
  colorMode,
  isExternal = false,
  ...anchorProps
}) => {
  return (
    <a
      {...anchorProps}
      className={clsx(styles.link)}
      data-color-mode={colorMode}
      {...(isExternal && {
        target: '_blank',
      })}
    >
      {children}
    </a>
  );
};

export default Link;
