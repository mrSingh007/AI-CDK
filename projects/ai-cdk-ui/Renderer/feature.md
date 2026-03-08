# Renderer Component

## Purpose
Render registered Angular components from protocol-friendly JSON payloads.

## What It Should Do
- Resolve render payloads to registered components by key.
- Apply JSON props and projected slot text content.
- Wire component outputs and callbacks to external handler maps.
- Support streaming integration patterns (for example SSE transports like AG-UI and Vercel AI).

## Customization Expectations
- Keep rendering behavior protocol-agnostic.
- Preserve strict input typing for predictable payload contracts.

## AI Chatbot Usage
- Render tool/UI cards emitted from model responses.
- Map stream events to component callbacks without template branching.
- Enable schema-driven UI updates during token or event streams.

## Non-Goals
- Not responsible for network transport, SSE parsing, or retry logic.
- Not a layout engine for arbitrary HTML rendering.
