import clsx from 'clsx';
import { type FunctionComponent } from 'preact';
import { useCallback, useEffect, useState } from 'preact/hooks';

// components
import IconButton from '@/ui/components/buttons/IconButton';
import Input from '@/ui/components/inputs/Input';
import StrengthMeter from '@/ui/components/inputs/StrengthMeter';
import VStack from '@/ui/components/layouts/VStack';

// icons
import EyeIcon from '@/ui/icons/EyeIcon';
import EyeOffIcon from '@/ui/icons/EyeOffIcon';

// styles
import styles from './styles.module.scss';

// types
import type { Props } from './types';

// utilities
import { passwordScore } from '@/utilities';

const NewPasswordInput: FunctionComponent<Props> = ({ colorMode, value, ...inputProps }) => {
  // states
  const [masked, setMasked] = useState<boolean>(true);
  const [_score, setScore] = useState<number>(passwordScore(value?.toString() ?? ''));
  // callbacks
  const handleOnMaskedClick = useCallback(() => setMasked(!masked), [masked, setMasked]);

  useEffect(() => setScore(passwordScore(value?.toString() ?? '')), [value]);

  return (
    <VStack align="center" fullWidth={true} justify="center" spacing="sm">
      <Input
        {...inputProps}
        autocomplete="new-password"
        colorMode={colorMode}
        rightButton={(
          <IconButton
            colorMode={colorMode}
            icon={masked ? <EyeOffIcon /> : <EyeIcon />}
            onClick={handleOnMaskedClick}
            type="button"
          />
        )}
        type={masked ? 'password' : 'text'}
        value={value}
      />

      <div className={clsx(styles.meterContainer)}>
        <StrengthMeter colorMode={colorMode} score={_score} />
      </div>
    </VStack>
  );
};

export default NewPasswordInput;
