import { resolve } from 'node:path';

export default (() => {
  return {
    '**/*.{cjs,js,json,mjs,ts}': (filenames) => [
      `sh -c 'pnpm -F @kibisis/embedded-wallet-sdk run generate:index && git add ${resolve(process.cwd(), 'packages', 'core', 'src', 'index.ts')}'`,
      `prettier --write ${filenames.join(' ')}`, // exclude this file
    ],
  };
})();
