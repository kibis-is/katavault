export default (() => {
  return {
    '**/*.{cjs,js,json,mjs,ts,tsx}': (filenames) => [
      `prettier --write ${filenames.join(' ')}`, // exclude this file
    ],
  };
})();
