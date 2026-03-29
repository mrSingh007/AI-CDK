# Markdown

`AiMarkdownComponent` renders GFM markdown content for AI chat transcripts and component docs.

## Goals

- Render markdown safely as sanitized HTML.
- Keep output accessible and keyboard friendly.
- Provide token-driven styling for host surfaces like chat bubbles and panels.

## Public API

- `content` (`string`, required): markdown source text.

## Notes

- GFM parsing is enabled (tables, lists, code blocks, inline code).
- Output HTML is sanitized before rendering.
