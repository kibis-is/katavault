import clsx from 'clsx';
import type { FunctionComponent } from 'preact';
import { useRef } from 'preact/hooks';

// hooks
import useDefaultTextColor from '@/ui/hooks/useDefaultTextColor';

// icons
import ChevronDownIcon from '@/ui/icons/ChevronDownIcon';

// styles
import styles from './styles.module.scss';

// types
import type { Props } from './types';

const Accordion: FunctionComponent<Props> = ({
  content,
  colorMode,
  onClick,
  open,
  padding,
  paddingBottom,
  paddingLeft,
  paddingRight,
  paddingTop,
  paddingX,
  paddingY,
  title,
}) => {
  // refs
  const contentRef = useRef<HTMLDivElement>(null);
  // hooks
  const defaultTextColor = useDefaultTextColor(colorMode);

  return (
    <div className={clsx(styles.container)}>
      {/*header*/}
      <button
        className={clsx(styles.header)}
        data-color-mode={colorMode}
        onClick={onClick}
        style={{
          ...(padding && {
            padding:
              typeof padding === 'number'
                ? `${padding}px ${padding}px ${padding}px ${padding}px`
                : `${padding} ${padding} ${padding} ${padding}`,
          }),
          ...(paddingBottom && {
            paddingBottom:
              typeof paddingBottom === 'number'
                ? `${paddingBottom}px`
                : paddingBottom,
          }),
          ...(paddingLeft && {
            paddingLeft:
              typeof paddingLeft === 'number' ? `${paddingLeft}px` : paddingLeft,
          }),
          ...(paddingRight && {
            paddingRight:
              typeof paddingRight === 'number'
                ? `${paddingRight}px`
                : paddingRight,
          }),
          ...(paddingTop && {
            paddingTop:
              typeof paddingTop === 'number' ? `${paddingTop}px` : paddingTop,
          }),
          ...(paddingX && {
            paddingLeft:
              typeof paddingX === 'number' ? `${paddingX}px` : paddingX,
            paddingRight:
              typeof paddingX === 'number' ? `${paddingX}px` : paddingX,
          }),
          ...(paddingY && {
            paddingBottom:
              typeof paddingY === 'number' ? `${paddingY}px` : paddingY,
            paddingTop: typeof paddingY === 'number' ? `${paddingY}px` : paddingY,
          }),
        }}
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
