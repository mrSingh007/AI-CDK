import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
export const repoRoot = path.resolve(currentDirectory, '..', '..');
export const sandboxFiles = [
  'projects/storybook-host/src/sandbox.html',
  'projects/storybook-host/src/sandbox.scss',
  'projects/storybook-host/src/sandbox.ts',
];
export const savedStashesDirectory = path.join(
  repoRoot,
  'projects/storybook-host/saved-stashes',
);

/**
 * Run a Git command in the repository root and return UTF-8 output.
 *
 * @param {string[]} args Git arguments.
 * @returns {string} Command output.
 */
export function runGit(args) {
  return execFileSync('git', args, {
    cwd: repoRoot,
    encoding: 'utf8',
  });
}

/**
 * Read the combined staged and unstaged sandbox diff against HEAD.
 *
 * @returns {string} Diff text for the tracked sandbox files.
 */
export function getCurrentSandboxDiff() {
  return runGit(['diff', '--no-ext-diff', '--binary', 'HEAD', '--', ...sandboxFiles]);
}

/**
 * List sandbox files that are currently staged for commit.
 *
 * @returns {string[]} Staged sandbox file paths.
 */
export function getStagedSandboxFiles() {
  return runGit(['diff', '--cached', '--name-only', '--', ...sandboxFiles])
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

/**
 * Ensure the saved-stashes directory exists.
 *
 * @returns {void}
 */
export function ensureSavedStashesDirectory() {
  mkdirSync(savedStashesDirectory, { recursive: true });
}

/**
 * Normalize line endings before comparing stored patch contents.
 *
 * @param {string} value Text to normalize.
 * @returns {string} Normalized text.
 */
export function normalizePatchContent(value) {
  return value.replace(/\r\n/g, '\n');
}

/**
 * Find an existing saved patch whose content matches the current sandbox diff.
 *
 * @param {string} diff Current sandbox diff.
 * @returns {string | null} Matching patch path relative to repo root, if found.
 */
export function findMatchingSavedPatch(diff) {
  if (!existsSync(savedStashesDirectory)) {
    return null;
  }

  const normalizedDiff = normalizePatchContent(diff);

  for (const entry of readdirSync(savedStashesDirectory)) {
    if (!entry.endsWith('.patch')) {
      continue;
    }

    const absolutePath = path.join(savedStashesDirectory, entry);
    const patchContent = normalizePatchContent(readFileSync(absolutePath, 'utf8'));
    if (patchContent === normalizedDiff) {
      return path.relative(repoRoot, absolutePath);
    }
  }

  return null;
}

/**
 * Build a timestamp suitable for patch filenames.
 *
 * @returns {string} Filename-safe timestamp.
 */
export function createTimestamp() {
  const date = new Date();
  const parts = [
    date.getFullYear().toString().padStart(4, '0'),
    (date.getMonth() + 1).toString().padStart(2, '0'),
    date.getDate().toString().padStart(2, '0'),
    date.getHours().toString().padStart(2, '0'),
    date.getMinutes().toString().padStart(2, '0'),
    date.getSeconds().toString().padStart(2, '0'),
  ];

  return `${parts[0]}-${parts[1]}-${parts[2]}-${parts[3]}${parts[4]}${parts[5]}`;
}

/**
 * Convert a user-provided label into a filename-safe slug.
 *
 * @param {string | undefined} value Optional label from the CLI.
 * @returns {string | null} Slug for filenames, if present.
 */
export function createPatchSlug(value) {
  if (!value) {
    return null;
  }

  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return slug || null;
}

/**
 * Save the provided diff into the saved-stashes directory.
 *
 * @param {string} diff Diff contents to persist.
 * @param {string | null} slug Optional filename slug.
 * @returns {string} Relative path of the written patch file.
 */
export function writePatchFile(diff, slug = null) {
  ensureSavedStashesDirectory();
  const fileName = slug ? `${slug}.patch` : `sandbox-${createTimestamp()}.patch`;
  const absolutePath = path.join(savedStashesDirectory, fileName);
  writeFileSync(absolutePath, diff, 'utf8');
  return path.relative(repoRoot, absolutePath);
}
