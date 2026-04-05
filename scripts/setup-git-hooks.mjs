import { existsSync, chmodSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { runGit } from './sandbox/lib.mjs';

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDirectory, '..');
const gitDirectory = path.join(repoRoot, '.git');
const preCommitHook = path.join(repoRoot, '.githooks/pre-commit');

if (!existsSync(gitDirectory)) {
  process.exit(0);
}

chmodSync(preCommitHook, 0o755);
runGit(['config', 'core.hooksPath', '.githooks']);
console.log('Configured Git hooks path to .githooks.');
