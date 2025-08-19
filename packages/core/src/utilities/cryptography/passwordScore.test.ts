import { describe, expect, test } from 'vitest';

// utilities
import passwordScore from './passwordScore';

interface TestParameters {
  expectedScore: number;
  password: string;
}

describe('passwordScore()', () => {
  test.each<TestParameters>([
    {
      expectedScore: -1,
      password: '',
    },
    {
      expectedScore: 0,
      password: 'password1',
    },
    {
      expectedScore: 1,
      password: 'cCAME6KnA@r-vh9p!Jkb',
    },
    {
      expectedScore: 1,
      password: '🐉🚀🦄🌸💥🌈🧩🐉🦉👾🎲🌴',
    },
    {
      expectedScore: 1,
      password: 'B5@🐉🚀7🦄Fs!🦄Zm🌸D2#🌈Qp',
    },
    {
      expectedScore: 2,
      password: 'G#7!kD8z🍀🔥🚀💎✨🌟🎉🥳👾🐉🍕🍣🍩🍦',
    },
  ])(`should return a score of "$expectedScore" for the password "$password"`, ({ expectedScore, password }) =>
    expect(passwordScore(password).score).toBe(expectedScore)
  );
});
