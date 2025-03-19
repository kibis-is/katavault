import chalk from 'chalk';
import { readdirSync, rmSync, type Stats, statSync, writeFileSync } from 'node:fs';
import { join, parse, type ParsedPath } from 'node:path';
import * as process from 'node:process';

/**
 * Script that creates the index.ts file in the `src/` directory.
 */
function main(): void {
  const exports = ['// exports will be generated automatically generated using: pnpm generate:index'];
  const srcDir = 'src';
  const indexFilePath = join(srcDir, 'index.ts');
  let dir: ParsedPath;
  let stat: Stats;

  // remove the index file
  rmSync(indexFilePath, {
    force: true,
  });

  // get utils
  for (const item of readdirSync(srcDir)) {
    stat = statSync(join(srcDir, item));

    // if it is not a directory, move on
    if (!stat.isDirectory()) {
      continue;
    }

    dir = parse(item);

    exports.push(`export * from './${dir.name}';`);
  }

  // write to index file
  writeFileSync(indexFilePath, `${exports.join('\n')}\n`, 'utf-8');

  console.log(`${chalk.yellow('[INFO]')}: generated indexes to "./src/index.ts"`);

  process.exit(0);
}

main();
