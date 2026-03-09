# AI-CDK

AI-CDK is an Angular component development kit focused on reusable building blocks for AI chatbot interfaces.

It provides reusable UI elements and a payload renderer so you can build protocol-driven chatbot experiences quickly.

Check [Storybook](https://mrsingh007.github.io/AI-CDK/) for all components and documentation.

## Protocol Support

`@ai-cdk/ui/Renderer` supports JSON-driven UI payloads for streaming integrations.

The library is not limited to AG-UI or the Vercel AI protocol. It also supports other SSE event-based protocols, as long as events are mapped to your render payload and handlers.

## Packages

- `@ai-cdk/ui`
- `@ai-cdk/chat` (WIP)

## Development

```bash
npm ci
```

```bash
npm run start
```

```bash
npm run build
```

```bash
npm run test
```

## Storybook

```bash
npm run storybook
npm run build-storybook
```

## Feature Docs

Each component has a local high-level `feature.md` document in its component folder.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution workflow and standards.

## Security

See [.github/SECURITY.md](.github/SECURITY.md) for vulnerability reporting.

## License

MIT - see [LICENSE](LICENSE).
