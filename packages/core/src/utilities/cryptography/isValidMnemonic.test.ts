import { describe, expect, test } from 'vitest';

// utilities
import isValidMnemonic from './isValidMnemonic';

interface TestParameters {
  expected: boolean;
  input: string;
}

describe('isValidMnemonic', () => {
  test.each([
    {
      expected: false,
      input: '1235',
    },
    {
      expected: false, // 24-words
      input:
        'ostrich ahead liquid race metal equal rural mind ribbon able canyon practice oblige split lonely ritual pumpkin document hurt gorilla evolve torch giggle above',
    },
    {
      expected: true, // 25-words
      input:
        'ostrich ahead liquid race metal equal rural mind ribbon able canyon practice oblige split lonely ritual pumpkin document hurt gorilla evolve torch giggle above harsh',
    },
  ])(`should format the unit of $input to $expected`, ({ expected, input }: TestParameters) => {
    expect(isValidMnemonic(input)).toBe(expected);
  });
});
