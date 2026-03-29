# Contributing to AI-CDK

Thanks for contributing.

## Development Setup
1. Fork and clone the repository.
2. Install dependencies:
   ```bash
   npm ci
   ```
3. Run local development:
   ```bash
   npm run start
   ```

## Branch and PR Flow
1. Create a branch from `main`.
2. Make focused changes with tests/docs updates.
3. Open a pull request using the PR template.
4. Ensure CI checks pass before requesting review.

## Required Checks Before PR
Run these locally when relevant:
```bash
npm run build
npm run test
npm run build-storybook
```

## Component Feature Documentation Rule
If your PR adds or changes a component or feature, create or update that component's local `feature.md` file.

Current component feature docs live at:
- `projects/ai-cdk-ui/Card/feature.md`
- `projects/ai-cdk-ui/Skeleton/feature.md`
- `projects/ai-cdk-ui/Spinner/feature.md`
- `projects/ai-cdk-ui/Questionnaire/feature.md`

## Coding and Quality Expectations
- Follow Angular and TypeScript best practices defined in repository guidance.
- Keep components accessible and ensure AXE/WCAG AA expectations are met.
- Add or update Storybook stories for component behavior and style tokens.

## Reporting
- Bugs: use the Bug Report issue template.
- Feature requests: use the Feature Request issue template.
- Security issues: follow `.github/SECURITY.md`.
