import { createPatchSlug, findMatchingSavedPatch, getCurrentSandboxDiff, writePatchFile } from './lib.mjs';

const requestedLabel = process.argv.slice(2).join(' ').trim();
const patchSlug = createPatchSlug(requestedLabel || undefined);

const diff = getCurrentSandboxDiff();

if (!diff) {
  console.error('Sandbox files are already clean. No patch was created.');
  process.exit(1);
}

const existingPatch = findMatchingSavedPatch(diff);
if (existingPatch) {
  console.log(`Current sandbox changes are already saved in ${existingPatch}.`);
  process.exit(0);
}

const patchPath = writePatchFile(diff, patchSlug);
console.log(`Saved sandbox patch to ${patchPath}.`);
