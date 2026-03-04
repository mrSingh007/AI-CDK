# @ai-cdk/ui

Angular UI library with secondary entry points:

- `@ai-cdk/ui/Skeleton`
- `@ai-cdk/ui/Card`
- `@ai-cdk/ui/Spinner`
- `@ai-cdk/ui/Questionnaire`

## Build

```bash
ng build ai-cdk-ui
```

## Publish

```bash
cd dist/ai-cdk-ui
npm publish
```

## Consumer Usage

```ts
import { AiQuestionnaireComponent } from '@ai-cdk/ui/Questionnaire';
```

Importing from a secondary entry point avoids pulling unrelated components into the bundle.
