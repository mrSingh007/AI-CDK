# Skeleton Component

## Purpose
Provide loading placeholders while chatbot content or UI data is being prepared.

## What It Should Do
- Render lightweight placeholder blocks for pending content.
- Provide an optional shimmer animation to signal active loading.
- Fit into different parent layouts without hard coupling to one screen.

## Customization Expectations
- Allow customization of placeholder color, size, radius, and animation timing through style tokens.
- Support static and animated states.

## AI Chatbot Usage
- Represent pending assistant responses and loading message cards.
- Smooth perceived latency while AI responses or metadata are loading.

## Non-Goals
- Not a progress tracker with exact completion metrics.
- Not responsible for network/request state management.
