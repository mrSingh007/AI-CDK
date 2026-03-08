# Questionnaire Component

## Purpose
Provide a guided question-and-answer flow to collect structured user input in chatbot experiences.

## What It Should Do
- Render one question at a time with selectable options.
- Support single-select and multi-select answer patterns.
- Optionally allow free-text input where needed.
- Emit answer progression and completion events for parent integration.

## Customization Expectations
- Allow customization of spacing, option appearance, selected state, and input styling through style tokens.
- Support adaptable text and option content based on dynamic question sets.

## AI Chatbot Usage
- Capture user preferences, intent, and constraints before generating AI responses.
- Power conversational intake flows in AI assistant experiences.

## Non-Goals
- Not a replacement for full form engines with deep validation pipelines.
- Not responsible for backend persistence.
