import { type FunctionComponent } from 'preact';
import { useCallback, useState } from 'preact/hooks';

// components
import IconButton from '@/ui/components/buttons/IconButton';
import Input from '@/ui/components/inputs/Input';

// icons
import EyeIcon from '@/ui/icons/EyeIcon';
import EyeOffIcon from '@/ui/icons/EyeOffIcon';

// types
import type { Props } from './types';

const PasswordInput: FunctionComponent<Props> = (props) => {
  // states
  const [masked, setMasked] = useState<boolean>(true);
  // callbacks
  const handleOnMaskedClick = useCallback(() => setMasked(!masked), [masked, setMasked]);

  return (
    <Input
      {...props}
      autocomplete="current-password"
      rightButton={(
        <IconButton
          colorMode={props.colorMode}
          icon={masked ? <EyeOffIcon /> : <EyeIcon />}
          onClick={handleOnMaskedClick}
        />
      )}
      type={masked ? 'password' : 'text'}
    />
  );
};

export default PasswordInput;
