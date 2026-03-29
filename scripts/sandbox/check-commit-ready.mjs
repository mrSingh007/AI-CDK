import { findMatchingSavedPatch, getCurrentSandboxDiff, getStagedSandboxFiles } from './lib.mjs';

const stagedSandboxFiles = getStagedSandboxFiles();
if (stagedSandboxFiles.length > 0) {
  console.error('Sandbox files are staged for commit:');
  for (const file of stagedSandboxFiles) {
    console.error(`- ${file}`);
  }
  console.error('');
  console.error(
    'Run `npm run sandbox:stash -- <name>` if the setup should be shared, then unstage or restore the sandbox files before committing.',
  );
  process.exit(1);
}

const diff = getCurrentSandboxDiff();
if (!diff) {
  console.log('Sandbox files are clean.');
  process.exit(0);
}

const matchingPatch = findMatchingSavedPatch(diff);
if (matchingPatch) {
  console.log(`Sandbox changes are preserved in ${matchingPatch}.`);
  process.exit(0);
}

console.error('Sandbox files still have local changes and no matching saved patch was found.');
console.error('Run `npm run sandbox:stash -- <name>` or restore the sandbox files before committing.');
process.exit(1);
