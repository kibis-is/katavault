// types
import type { Parameters } from './types';

/**
 * Truncates a given text by preserving the start and end portions as specified in the parameters.
 * If the sum of start and end lengths exceeds the text length, the original text is returned.
 *
 * @param {string} text - The text to be truncated.
 * @param {Object} [params] - An optional object specifying truncation details.
 * @param {number} [params.start] - The number of characters to preserve at the start of the text.
 * @param {number} [params.end] - The number of characters to preserve at the end of the text.
 * @return {string} The truncated text with preserved start and end portions, or the original text if truncation is
 * not possible.
 */
export default function truncateText(text: string, params?: Parameters): string {
  const end = params?.end ?? 0;
  const start = params?.start ?? 0;
  let endCharacters: string = '';
  let startCharacters: string = '';

  if (end > text.length || start > text.length || start + end >= text.length) {
    return text;
  }

  if (end > 0) {
    endCharacters = text.substring(text.length - end);
  }

  if (start > 0) {
    startCharacters = text.substring(0, start);
  }

  return `${startCharacters}...${endCharacters}`;
}
