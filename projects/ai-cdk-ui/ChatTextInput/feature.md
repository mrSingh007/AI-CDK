# Chat Text Input Component

## Purpose
Provide a reusable chat-focused text input surface with optional attachment selection.

## What It Should Do
- Capture chat text with a send action.
- Enable send only when non-empty text is present.
- Optionally show file upload trigger with configurable accepted formats.
- Support single-file and multi-file selection modes.
- Emit a single submit payload containing message text and selected files.

## Customization Expectations
- Allow customization through CSS custom properties for layout, text area, upload trigger, send action, and focus states.
- Keep behavior predictable and easy to integrate in chat shells.

## AI Chatbot Usage
- Power composer areas where users send prompts and optional attachments.
- Provide a compact, consistent input control that can be embedded in chatbot panels and pages.

## Non-Goals
- Not responsible for message persistence or transport.
- Not a full conversation container.
