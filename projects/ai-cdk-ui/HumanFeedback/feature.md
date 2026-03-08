# Human Feedback Component

## Purpose
Provide a compact confirmation surface for moments where an AI agent needs explicit human approval.

## What It Should Do
- Display a clear decision prompt.
- Show a reject action and a confirm action with configurable labels.
- Emit explicit events for confirm and reject decisions.

## Customization Expectations
- Allow visual customization through CSS custom properties for layout, colors, spacing, borders, and focus styles.
- Keep behavior simple and predictable while making text and action labels configurable.

## AI Chatbot Usage
- Ask users to approve or cancel agent actions such as running steps, applying changes, or continuing a workflow.
- Capture human-in-the-loop decisions cleanly in conversational interfaces.

## Non-Goals
- Not a modal/dialog framework.
- Not responsible for orchestrating business logic after decision events.
