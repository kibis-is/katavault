export default (() => {
  return {
    '**/*.{cjs,js,json,mjs,ts}': (filenames) => [
      `prettier --write ${filenames.join(' ')}`, // exclude this file
    ],
  };
})();
