# @ai-cdk/ui

`@ai-cdk/ui` is an Angular library of AI chatbot building blocks for chat and agent interfaces.

It provides reusable UI elements and a payload renderer so you can build protocol-driven chatbot experiences quickly.

Check [Storybook](https://mrsingh007.github.io/AI-CDK/) for all components and changes.
Contribute to project [HERE](https://github.com/mrSingh007/AI-CDK/)

## Protocol Support

`@ai-cdk/ui/Renderer` supports JSON-driven UI payloads for streaming integrations.

The library is not limited to AG-UI or the Vercel AI protocol. It also supports other SSE event-based protocols, as long as events are mapped to your render payload and handlers.

## Installation

```bash
npm i @ai-cdk/ui@alpha
```

Peer dependencies:

- `@angular/core` `^21.1.0`
- `@angular/common` `^21.1.0`


## Accessibility

The components include keyboard and semantic support intended for WCAG AA usage:

- Clickable card supports keyboard activation (`Enter`/`Space`)
- Questionnaire uses grouped controls and labels
- Human feedback actions are exposed with grouped ARIA semantics
- Renderer supports configurable `aria-live` announcements for dynamic content

## License

MIT
