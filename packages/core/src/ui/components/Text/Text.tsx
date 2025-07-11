import clsx from 'clsx';
import type { FunctionComponent } from 'preact';

// styles
import styles from './styles.module.scss';

// types
import type { TypographyProps } from '@/ui/types';

const Text: FunctionComponent<TypographyProps> = ({
  bold = false,
  children,
  colorMode,
  fullWidth = false,
  size = 'md',
  textAlign = 'center',
}) => {
  let sizeStyle = styles.textMd;
  let textAlignStyle = styles.headingCenter;

  switch (size) {
    case 'sm':
      sizeStyle = styles.textSm;
      break;
    case 'lg':
      sizeStyle = styles.textLg;
      break;
    case 'xl':
      sizeStyle = styles.textXl;
      break;
    case 'md':
    default:
      break;
  }

  switch (textAlign) {
    case 'left':
      textAlignStyle = styles.headingLeft;
      break;
    case 'right':
      textAlignStyle = styles.headingRight;
      break;
    case 'center':
    default:
      break;
  }

  return (
    <p
      className={clsx(
        styles.text,
        sizeStyle,
        textAlignStyle,
        bold && styles.textBold,
        fullWidth && styles.textFullWidth
      )}
      data-color-mode={colorMode}
    >
      {children}
    </p>
  );
};

export default Text;
