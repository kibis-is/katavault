import clsx from 'clsx';
import type { FunctionComponent } from 'preact';
import { useRef } from 'preact/hooks';

// hooks
import useDefaultTextColor from '@/ui/hooks/colors/useDefaultTextColor';

// icons
import ChevronDownIcon from '@/ui/icons/ChevronDownIcon';

// styles
import styles from './styles.module.scss';

// types
import type { Props } from './types';

const Accordion: FunctionComponent<Props> = ({
  buttonClassName,
  containerClassName,
  content,
  colorMode,
  onClick,
  open,
  title,
}) => {
  // refs
  const contentRef = useRef<HTMLDivElement>(null);
  // hooks
  const defaultTextColor = useDefaultTextColor(colorMode);

  return (
    <div className={clsx(styles.container, containerClassName)}>
      {/*header*/}
      <button
        className={clsx(styles.header, buttonClassName)}
        data-color-mode={colorMode}
        onClick={onClick}
      >
        {/*title*/}
        {title}

        {/*icon*/}
        <ChevronDownIcon
          className={clsx(
            styles.icon,
            open && styles.iconOpen
          )}
          color={defaultTextColor}
        />
      </button>

      {/*content*/}
      <div
        className={clsx(
          styles.content,
          open && styles.contentOpen
        )}
        style={{
          maxHeight:
            open && contentRef.current
              ? `${contentRef.current.scrollHeight}px`
              : '0px',
        }}
        ref={contentRef}
      >
        {content}
      </div>
    </div>
  );
};

export default Accordion;
