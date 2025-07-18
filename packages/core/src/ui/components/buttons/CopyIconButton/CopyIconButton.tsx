import { type FunctionComponent } from 'preact';

// components
import IconButton from '@/ui/components/buttons/IconButton';

// hooks
import useClipboard from '@/ui/hooks/forms/useClipboard';

// icons
import CheckIcon from '@/ui/icons/CheckIcon';
import CopyIcon from '@/ui/icons/CopyIcon';

// types
import type { Props } from './types';

const CopyIconButton: FunctionComponent<Props> = ({
  text,
  ...iconButtonProps
}) => {
  // hooks
  const {
    copied,
    onCopy,
  } = useClipboard(text);

  return (
    <IconButton
      {...iconButtonProps}
      icon={copied ? <CheckIcon /> : <CopyIcon />}
      onClick={onCopy}
      {...(copied && {
        iconColor: iconButtonProps.colorMode === 'dark' ? '#4ade80' : '#22c55e',
      })}
    />
  );
};

export default CopyIconButton;
