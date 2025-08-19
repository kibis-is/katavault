import clsx from 'clsx';
import { type FunctionComponent } from 'preact';
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks';

// components
import IconButton from '@/ui/components/buttons/IconButton';
import Input from '@/ui/components/inputs/Input';
import StrengthMeter from '@/ui/components/inputs/StrengthMeter';
import Text from '@/ui/components/typography/Text';
import VStack from '@/ui/components/layouts/VStack';

// hooks
import useSubTextColor from '@/ui/hooks/colors/useSubTextColor';
import useTranslate from '@/ui/hooks/i18n/useTranslate';

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
  // hooks
  const subTextColor = useSubTextColor(colorMode);
  const translate = useTranslate();
  // states
  const [masked, setMasked] = useState<boolean>(true);
  const [score, setScore] = useState<number>(passwordScore(value?.toString() ?? '').score);
  // memos
  const passwordStrengthTextStyle = useMemo(() => {
    switch (score) {
      case 0:
        return styles.passwordStrengthTextWeakPassword;
      case 1:
        return styles.passwordStrengthTextNormalPassword;
      case 2:
        return styles.passwordStrengthTextStrongPassword;
      case -1:
      default:
        return styles.passwordStrengthTextNoPassword;
    }
  }, [score, subTextColor]);
  // callbacks
  const handleOnMaskedClick = useCallback(() => setMasked(!masked), [masked, setMasked]);

  useEffect(() => setScore(passwordScore(value?.toString() ?? '').score), [value]);

  return (
    <VStack align="center" fullWidth={true} justify="center" spacing="sm">
      {/*input*/}
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

      {/*strength meter*/}
      <div className={clsx(styles.itemContainer)}>
        <VStack align="center" fullWidth={true} justify="center" spacing="xs">
          <StrengthMeter colorMode={colorMode} score={score} />

          {score >= 0 && (
            <Text className={clsx(passwordStrengthTextStyle)} colorMode={colorMode} fullWidth={true} size="xs" textAlign="justify">
              {translate('captions.passwordDescription', {
                context: score,
              })}
            </Text>
          )}
        </VStack>
      </div>

      {/*hint*/}
      <div className={clsx(styles.itemContainer)}>
        <Text color={subTextColor} colorMode={colorMode} fullWidth={true} size="sm" textAlign="justify">
          {translate('captions.passwordHint')}
        </Text>
      </div>
    </VStack>
  );
};

export default NewPasswordInput;
