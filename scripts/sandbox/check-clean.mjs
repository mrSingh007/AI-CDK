import { getCurrentSandboxDiff, sandboxFiles } from './lib.mjs';

const diff = getCurrentSandboxDiff();

if (!diff) {
  console.log('Sandbox files are clean.');
  process.exit(0);
}

console.error('Sandbox files are modified:');
for (const file of sandboxFiles) {
  console.error(`- ${file}`);
}
console.error('');
console.error(
  'Save the setup with `npm run sandbox:stash -- <name>` if it should be reusable, then restore the sandbox files.',
);
process.exit(1);
