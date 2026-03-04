# @ai-cdk — Component Features Specification

> **Convention (applies to all components)**
> - Every component has **three dedicated files**: `component-name.ts`, `component-name.html`, `component-name.scss`
> - All visual properties (colors, spacing, borders, sizing) are exposed as **SCSS tokens** using CSS custom properties with a fallback value, e.g.:
>   ```scss
>   $ai-card-bg: var(--ai-card-bg, #ffffff);
>   .ai-card { background: $ai-card-bg; }
>   ```
> - Style-only values are **not component inputs**. Keep padding, margin, border, radius, and color in SCSS tokens. Size may be an input when needed for component variants.
> - Import paths follow the pattern `@ai-cdk/<entry-point>`

---

## 1. Skeleton Component

**Entry point:** `@ai-cdk/ui`  
**Import:** `import { AiSkeletonComponent } from '@ai-cdk/ui/Skeleton'`  
**Files:** `skeleton.ts` · `skeleton.html` · `skeleton.scss`

### Purpose
A loading placeholder used inside the ChatBox component (and anywhere else a loading state is needed). Displays an animated shimmer effect to indicate content is being loaded.

### Shape Variants
| Variant | Description |
|---|---|
| `rectangle` *(default)* | A rectangular block with configurable width and height |

### Inputs
| Input | Type | Default | Description |
|---|---|---|---|
| `animate` | `boolean` | `true` | Enables/disables the shimmer animation |

### SCSS Tokens
```scss
$ai-skeleton-bg:             var(--ai-skeleton-bg, #e0e0e0);
$ai-skeleton-shimmer-color:  var(--ai-skeleton-shimmer-color, #f5f5f5);
$ai-skeleton-width:          var(--ai-skeleton-width, 100%);
$ai-skeleton-height:         var(--ai-skeleton-height, 1rem);
$ai-skeleton-border-radius:  var(--ai-skeleton-border-radius, 4px);
$ai-skeleton-animation-duration: var(--ai-skeleton-animation-duration, 1.5s);
```

### Behavior
- Renders a `<div>` with the shimmer keyframe animation by default.
- When `animate` is `false`, renders a static muted block (no animation).

---

## 2. Card Component

**Entry point:** `@ai-cdk/ui`  
**Import:** `import { AiCardComponent } from '@ai-cdk/ui/Card'`  
**Files:** `card.ts` · `card.html` · `card.scss`

### Purpose
A general-purpose surface container for grouping related content.

### Inputs
| Input | Type | Default | Description |
|---|---|---|---|
| `elevation` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Shadow depth |
| `clickable` | `boolean` | `false` | Adds hover/active styles and cursor pointer |

### Outputs
| Output | Payload | Description |
|---|---|---|
| `cardClick` | `MouseEvent` | Emitted on click when `clickable` is `true` |

### Content Projection (Angular `ng-content` slots)
| Slot | Selector | Description |
|---|---|---|
| Header | `[slot="header"]` | Optional card header area |
| Body | *(default)* | Main card content |
| Footer | `[slot="footer"]` | Optional card footer area |

### SCSS Tokens
```scss
$ai-card-bg:              var(--ai-card-bg, #ffffff);
$ai-card-border:          var(--ai-card-border, 1px solid #e5e7eb);
$ai-card-border-radius:   var(--ai-card-border-radius, 12px);
$ai-card-padding:         var(--ai-card-padding, 1.25rem);
$ai-card-shadow-sm:       var(--ai-card-shadow-sm, 0 1px 3px rgba(0,0,0,0.08));
$ai-card-shadow-md:       var(--ai-card-shadow-md, 0 4px 12px rgba(0,0,0,0.1));
$ai-card-shadow-lg:       var(--ai-card-shadow-lg, 0 8px 24px rgba(0,0,0,0.12));
$ai-card-hover-shadow:    var(--ai-card-hover-shadow, 0 6px 16px rgba(0,0,0,0.14));
$ai-card-color:           var(--ai-card-color, #111827);
```

---

## 3. Loading Spinner Component

**Entry point:** `@ai-cdk/ui`  
**Import:** `import { AiSpinnerComponent } from '@ai-cdk/ui/Spinner'`  
**Files:** `spinner.ts` · `spinner.html` · `spinner.scss`

### Purpose
A small circular loading indicator for inline use (buttons, inline states, etc.).

### Inputs
| Input | Type | Default | Description |
|---|---|---|---|
| `size` | `'xs' \| 'sm' \| 'md'` | `'sm'` | Diameter of the spinner |

### SCSS Tokens
```scss
$ai-spinner-color:        var(--ai-spinner-color, #3b82f6);
$ai-spinner-track-color:  var(--ai-spinner-track-color, #e5e7eb);
$ai-spinner-size-xs:      var(--ai-spinner-size-xs, 12px);
$ai-spinner-size-sm:      var(--ai-spinner-size-sm, 18px);
$ai-spinner-size-md:      var(--ai-spinner-size-md, 24px);
$ai-spinner-stroke-width: var(--ai-spinner-stroke-width, 2.5px);
$ai-spinner-duration:     var(--ai-spinner-duration, 0.75s);
```

### Behavior
- Rendered as an SVG circle with a CSS `rotate` keyframe animation.
- Color is driven by CSS tokens (`--ai-spinner-inline-color` or `--ai-spinner-color`), not a component input.
- No text label; purely visual.

---

## 4. Questionnaire Component

**Entry point:** `@ai-cdk/ui`  
**Import:** `import { AiQuestionnaireComponent } from '@ai-cdk/ui/Questionnaire'`  
**Files:** `questionnaire.ts` · `questionnaire.html` · `questionnaire.scss`

### Purpose
A step-by-step questionnaire UI resembling AI chat flows. Presents one question at a time with predefined answer options, optional multi-selection, and an optional free-text input.

### Data Model
```ts
interface AiQuestion {
  id: string;
  question: string;
  options: string[];
  multiSelect?: boolean;  // overrides component-level multiSelect for this question
}

interface AiAnswer {
  questionId: string;
  selected: string[];   // selected option(s); empty array if only free text was entered
  text?: string;        // free-text input value (only when allowInput is true)
}
```

### Inputs
| Input | Type | Default | Description |
|---|---|---|---|
| `questions` | `AiQuestion[]` | `[]` | Array of questions to step through |
| `allowInput` | `boolean` | `true` | Shows/hides the free-text input field below the options |
| `multiSelect` | `boolean` | `false` | Allows selecting more than one option per question; can also be overridden per question via `AiQuestion.multiSelect` |

### Outputs
| Output | Payload | Description |
|---|---|---|
| `answerSubmit` | `AiAnswer` | Emitted each time the user clicks Next |
| `completed` | `AiAnswer[]` | Emitted after the last question is answered, with all collected answers |

### Selection Modes
| Mode | Options rendered as | Next button |
|---|---|---|
| Single-select (`multiSelect: false`) | Radio-style option pills | Always visible; enabled as soon as one option is selected or (if `allowInput: false`) hidden entirely — see below |
| Multi-select (`multiSelect: true`) | Multi-select option items | Always visible and always enabled |

### Next Action Rules
| `allowInput` | `multiSelect` | Next button behaviour |
|---|---|---|
| `true` | `false` | Always visible; **always enabled** (user may submit with no option selected if they filled in the text input, or with an option selected and no text) |
| `true` | `true` | Always visible; **always enabled** |
| `false` | `false` | **Hidden entirely**; selecting an option immediately advances |
| `false` | `true` | Always visible; **always enabled** (user clicks Next when done selecting) |

### Visual Examples

**Single-select + free-text input (`allowInput: true`, `multiSelect: false`)**
```
Q: Where would you like to go?

  ● UK
  ○ USA
  ┌────────────────────────────────┐
  │ Other destination...           │
  └────────────────────────────────┘
                            [ Next ]
```

**Multi-select + free-text input (`allowInput: true`, `multiSelect: true`)**
```
Q: Which topics interest you?

  ☑ Design
  ☑ Engineering
  ☐ Marketing
  ┌────────────────────────────────┐
  │ Something else...              │
  └────────────────────────────────┘
                            [ Next ]
```

**`allowInput: false`, `multiSelect: false`** — Next button hidden; tapping an option auto-advances.

**`allowInput: false`, `multiSelect: true`** — No text input; Next button always visible and enabled.

### SCSS Tokens
```scss
$ai-questionnaire-bg:              var(--ai-questionnaire-bg, #ffffff);
$ai-questionnaire-border-radius:   var(--ai-questionnaire-border-radius, 12px);
$ai-questionnaire-padding:         var(--ai-questionnaire-padding, 1.5rem);
$ai-questionnaire-question-color:  var(--ai-questionnaire-question-color, #111827);
$ai-questionnaire-question-size:   var(--ai-questionnaire-question-size, 1rem);
$ai-questionnaire-option-bg:       var(--ai-questionnaire-option-bg, #f9fafb);
$ai-questionnaire-option-border:   var(--ai-questionnaire-option-border, 1px solid #e5e7eb);
$ai-questionnaire-option-hover-bg: var(--ai-questionnaire-option-hover-bg, #eff6ff);
$ai-questionnaire-option-selected-bg:     var(--ai-questionnaire-option-selected-bg, #3b82f6);
$ai-questionnaire-option-selected-color:  var(--ai-questionnaire-option-selected-color, #ffffff);
$ai-questionnaire-input-border:    var(--ai-questionnaire-input-border, 1px solid #d1d5db);
$ai-questionnaire-input-bg:        var(--ai-questionnaire-input-bg, #ffffff);
$ai-questionnaire-input-color:     var(--ai-questionnaire-input-color, #111827);
$ai-questionnaire-gap:             var(--ai-questionnaire-gap, 0.5rem);
```



---

## 5. AI Sidebar Component

**Entry point:** `@ai-cdk/chat`  
**Import:** `import { AiSidebarComponent } from '@ai-cdk/chat/SideBar'`  
**Files:** `sidebar.ts` · `sidebar.html` · `sidebar.scss`

### Purpose
A full-height chat sidebar panel that connects to a server-sent events (SSE) endpoint. Displays a conversation thread and streams AI responses token by token into a live message bubble.

### Inputs
| Input | Type | Required | Description |
|---|---|---|---|
| `path` | `string` | ✅ | URL of the SSE endpoint. User message is sent as a query param or POST body (configurable). |
| `placeholder` | `string` | — | Input field placeholder text. Default: `'Type a message...'` |

### Outputs
| Output | Payload | Description |
|---|---|---|
| `xClicked` | `void` | Emitted when the close (✕) button is clicked |
| `clearClicked` | `void` | Emitted when the trash icon is clicked |

### Layout & Structure
```
┌─────────────────────────────────────────┐  ← full viewport height
│  🗑  [trash]              [✕ close]     │  ← top bar
├─────────────────────────────────────────┤
│                                         │
│   User: Hello, how are you?             │
│                                         │
│   AI: I'm doing great, thanks for       │  ← streaming token-by-token
│       asking! How can I help you...▌    │
│                                         │
│                                         │
├─────────────────────────────────────────┤
│  ┌──────────────────────┐  [send icon]  │  ← bottom input bar
│  │ Type a message...    │               │
│  └──────────────────────┘               │
└─────────────────────────────────────────┘
     ← 400px width (token-configurable) →
```

### SSE Behavior
1. On **Enter** keypress or **send button** click:
   - The user's message is appended to the chat as a user bubble.
   - A new AI message bubble is created (empty, with a blinking cursor).
   - An SSE connection is opened to `path` with the user message as payload.
   - Each received SSE `data` token is appended to the active AI bubble in real time.
   - On `[DONE]` or stream close, the cursor is removed and the bubble is finalised.
2. While streaming, the input is **disabled**.
3. If the SSE connection errors, an error message is shown inside the AI bubble.

### SCSS Tokens
```scss
// Sidebar dimensions
$ai-sidebar-width:              var(--ai-sidebar-width, 400px);
$ai-sidebar-bg:                 var(--ai-sidebar-bg, #ffffff);
$ai-sidebar-border-left:        var(--ai-sidebar-border-left, 1px solid #e5e7eb);
$ai-sidebar-shadow:             var(--ai-sidebar-shadow, -4px 0 16px rgba(0,0,0,0.08));
$ai-sidebar-z-index:            var(--ai-sidebar-z-index, 1000);

// Top bar
$ai-sidebar-topbar-bg:          var(--ai-sidebar-topbar-bg, #f9fafb);
$ai-sidebar-topbar-border:      var(--ai-sidebar-topbar-border, 1px solid #e5e7eb);
$ai-sidebar-topbar-padding:     var(--ai-sidebar-topbar-padding, 0.75rem 1rem);
$ai-sidebar-icon-color:         var(--ai-sidebar-icon-color, #6b7280);
$ai-sidebar-icon-hover-color:   var(--ai-sidebar-icon-hover-color, #111827);

// Chat content area
$ai-sidebar-content-padding:    var(--ai-sidebar-content-padding, 1rem);
$ai-sidebar-content-gap:        var(--ai-sidebar-content-gap, 0.75rem);

// User message bubble
$ai-sidebar-user-bubble-bg:     var(--ai-sidebar-user-bubble-bg, #3b82f6);
$ai-sidebar-user-bubble-color:  var(--ai-sidebar-user-bubble-color, #ffffff);
$ai-sidebar-user-bubble-radius: var(--ai-sidebar-user-bubble-radius, 18px 18px 4px 18px);

// AI message bubble
$ai-sidebar-ai-bubble-bg:       var(--ai-sidebar-ai-bubble-bg, #f3f4f6);
$ai-sidebar-ai-bubble-color:    var(--ai-sidebar-ai-bubble-color, #111827);
$ai-sidebar-ai-bubble-radius:   var(--ai-sidebar-ai-bubble-radius, 18px 18px 18px 4px);
$ai-sidebar-bubble-padding:     var(--ai-sidebar-bubble-padding, 0.6rem 0.9rem);
$ai-sidebar-bubble-font-size:   var(--ai-sidebar-bubble-font-size, 0.875rem);

// Bottom input bar
$ai-sidebar-input-bar-bg:       var(--ai-sidebar-input-bar-bg, #ffffff);
$ai-sidebar-input-bar-border:   var(--ai-sidebar-input-bar-border, 1px solid #e5e7eb);
$ai-sidebar-input-bar-padding:  var(--ai-sidebar-input-bar-padding, 0.75rem 1rem);
$ai-sidebar-input-bg:           var(--ai-sidebar-input-bg, #f9fafb);
$ai-sidebar-input-border:       var(--ai-sidebar-input-border, 1px solid #d1d5db);
$ai-sidebar-input-border-radius:var(--ai-sidebar-input-border-radius, 20px);
$ai-sidebar-input-color:        var(--ai-sidebar-input-color, #111827);
$ai-sidebar-input-padding:      var(--ai-sidebar-input-padding, 0.5rem 1rem);
$ai-sidebar-send-icon-color:    var(--ai-sidebar-send-icon-color, #3b82f6);
$ai-sidebar-send-icon-disabled: var(--ai-sidebar-send-icon-disabled, #9ca3af);
```

---

## Token Override Example

Users can globally customise the library by setting CSS custom properties anywhere in their stylesheet:

```css
:root {
  --ai-sidebar-width: 320px;
  --ai-sidebar-bg: #1e1e2e;
  --ai-sidebar-user-bubble-bg: #7c3aed;
  --ai-card-border-radius: 4px;
  --ai-datepicker-selected-bg: #10b981;
}
```
