# AgUiRuntimeService

## Purpose
Provide an Angular-first AG-UI runtime service for message streaming, frontend tool rendering, request header management, and shared application state orchestration.

## What It Should Do
- Initialize AG-UI runtime configuration from Angular consumers.
- Send outbound messages and maintain a local structured message timeline for UI rendering.
- Register frontend tools that can render inline UI or pause runs for human feedback.
- Track and expose request headers, streaming state, waiting-interaction state, and shared application state.
- Support continuation runs after frontend tool execution resolves locally.

## Customization Expectations
- Allow consumers to provide a custom runtime or the default HTTP runtime.
- Allow reactive header sources plus per-request header overrides.
- Keep tool definitions transport-compatible while letting Angular applications render tool UI locally.
- Preserve a predictable local message shape that can be consumed by renderer-based chat shells.

## AI Chatbot Usage
- Drive AG-UI chat sessions from Angular components and services.
- Render approval dialogs, forms, or other local tool UIs inline in the conversation.
- Resume agent runs after the user resolves a waiting interaction.
- Share runtime state such as cards, workflow progress, or other UI state across the Angular shell.

## Non-Goals
- Not a renderer component by itself; pair it with UI components such as `AiPayloadRendererComponent`.
- Not responsible for backend business logic, prompt design, or AG-UI server implementation.
- Not a generic global state store outside the scope of AG-UI-driven interactions.
