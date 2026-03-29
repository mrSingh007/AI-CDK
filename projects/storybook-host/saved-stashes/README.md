# Storybook Host Saved Stashes

Store reusable sandbox test setups here as `.patch` files.

Rules:

- Do not commit changes to `projects/storybook-host/src/sandbox.html`.
- Do not commit changes to `projects/storybook-host/src/sandbox.scss`.
- Do not commit changes to `projects/storybook-host/src/sandbox.ts`.
- If a sandbox setup is useful for others, save it here and commit the patch file instead.

Create a patch:

```bash
npm run sandbox:stash -- my-test-setup
```

Apply a patch:

```bash
git apply projects/storybook-host/saved-stashes/my-test-setup.patch
```

Apply with Git's three-way merge fallback:

```bash
git apply --3way projects/storybook-host/saved-stashes/my-test-setup.patch
```
