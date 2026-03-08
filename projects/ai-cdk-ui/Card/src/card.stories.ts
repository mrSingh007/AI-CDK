import { computed, signal } from '@angular/core';
import { AiCardComponent } from '@ai-cdk/ui/Card';
import type { Meta, StoryObj } from '@storybook/angular';

interface AiCardTokens {
  readonly cardBg: string;
  readonly cardBorder: string;
  readonly cardBorderRadius: string;
  readonly cardPadding: string;
  readonly cardShadow: string;
  readonly cardHoverShadow: string;
  readonly cardColor: string;
}

interface AiCardTokenControl {
  readonly key: keyof AiCardTokens;
  readonly cssVar: string;
  readonly label: string;
  readonly inputType: 'color' | 'text';
  readonly defaultValue: string;
}

const CARD_TOKEN_DEFAULTS: AiCardTokens = {
  cardBg: '#ffffff',
  cardBorder: '1px solid #e5e7eb',
  cardBorderRadius: '12px',
  cardPadding: '1.25rem',
  cardShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
  cardHoverShadow: '0 6px 16px rgba(0, 0, 0, 0.14)',
  cardColor: '#111827',
};

const CARD_TOKEN_CONTROLS: readonly AiCardTokenControl[] = [
  {
    key: 'cardBg',
    cssVar: '--ai-card-bg',
    label: 'Card background',
    inputType: 'color',
    defaultValue: CARD_TOKEN_DEFAULTS.cardBg,
  },
  {
    key: 'cardColor',
    cssVar: '--ai-card-color',
    label: 'Text color',
    inputType: 'color',
    defaultValue: CARD_TOKEN_DEFAULTS.cardColor,
  },
  {
    key: 'cardBorder',
    cssVar: '--ai-card-border',
    label: 'Border',
    inputType: 'text',
    defaultValue: CARD_TOKEN_DEFAULTS.cardBorder,
  },
  {
    key: 'cardBorderRadius',
    cssVar: '--ai-card-border-radius',
    label: 'Border radius',
    inputType: 'text',
    defaultValue: CARD_TOKEN_DEFAULTS.cardBorderRadius,
  },
  {
    key: 'cardPadding',
    cssVar: '--ai-card-padding',
    label: 'Padding',
    inputType: 'text',
    defaultValue: CARD_TOKEN_DEFAULTS.cardPadding,
  },
  {
    key: 'cardShadow',
    cssVar: '--ai-card-shadow',
    label: 'Shadow',
    inputType: 'text',
    defaultValue: CARD_TOKEN_DEFAULTS.cardShadow,
  },
  {
    key: 'cardHoverShadow',
    cssVar: '--ai-card-hover-shadow',
    label: 'Hover shadow',
    inputType: 'text',
    defaultValue: CARD_TOKEN_DEFAULTS.cardHoverShadow,
  },
];

const BASIC_USAGE_SNIPPET = `<ai-card [clickable]="false">
  <h3 slot="header">Card Header</h3>
  <p>Main card body content.</p>
  <small slot="footer">Footer area</small>
</ai-card>`;

const TOKEN_USAGE_SNIPPET = `<ai-card
  style="--ai-card-bg: #fff7ed; --ai-card-border-radius: 16px; --ai-card-color: #9a3412;"
>
  <h3 slot="header">Token override</h3>
  <p>Set CSS custom properties directly on the component host.</p>
</ai-card>`;

function buildCardTokenStyles(tokens: AiCardTokens): string {
  return [
    `--ai-card-bg: ${tokens.cardBg}`,
    `--ai-card-border: ${tokens.cardBorder}`,
    `--ai-card-border-radius: ${tokens.cardBorderRadius}`,
    `--ai-card-padding: ${tokens.cardPadding}`,
    `--ai-card-shadow: ${tokens.cardShadow}`,
    `--ai-card-hover-shadow: ${tokens.cardHoverShadow}`,
    `--ai-card-color: ${tokens.cardColor}`,
  ].join('; ');
}

const meta: Meta = {
  title: 'UI/Card',
  component: AiCardComponent,
  parameters: {
    controls: {
      disable: true,
      hideNoControlsWarning: true,
    },
  },
};

export default meta;
type Story = StoryObj;

export const Overview: Story = {
  render: () => {
    const tokenValues = signal<AiCardTokens>(CARD_TOKEN_DEFAULTS);
    const tokenStyles = computed(() => buildCardTokenStyles(tokenValues()));
    const cardEventLog = signal<readonly string[]>([]);
    const activationCount = signal(0);

    const onCardActivated = (event: MouseEvent): void => {
      activationCount.update((value) => value + 1);
      const activationSource = event.detail === 0 ? 'keyboard' : 'pointer';
      const line = `Activation #${activationCount()} from ${activationSource} (${event.type})`;
      cardEventLog.update((entries) => [line, ...entries].slice(0, 8));
    };

    return {
      props: {
        tokenControls: CARD_TOKEN_CONTROLS,
        tokenValues,
        tokenStyles,
        cardEventLog,
        basicUsageSnippet: BASIC_USAGE_SNIPPET,
        tokenUsageSnippet: TOKEN_USAGE_SNIPPET,
        onCardActivated,
        onTokenInputEvent: (key: keyof AiCardTokens, event: Event): void => {
          const target = event.target;
          if (!(target instanceof HTMLInputElement)) {
            return;
          }

          tokenValues.update((current) => ({
            ...current,
            [key]: target.value,
          }));
        },
      },
      template: `
        <style>
          .ai-card-docs {
            display: grid;
            gap: 1rem;
            color: #0f172a;
          }

          .ai-card-docs__section {
            border: 1px solid #cbd5e1;
            border-radius: 14px;
            padding: 1rem;
            background: #ffffff;
          }

          .ai-card-docs__title {
            margin: 0 0 0.5rem;
            font-size: 1.15rem;
            line-height: 1.3;
          }

          .ai-card-docs__lead {
            margin: 0;
            color: #334155;
            line-height: 1.5;
          }

          .ai-card-docs__variant-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 0.75rem;
            margin-top: 0.875rem;
          }

          .ai-card-docs__event-log {
            margin: 0;
            padding-left: 1.125rem;
            color: #1e293b;
            font: 500 0.82rem/1.45 'Menlo', 'Monaco', monospace;
          }

          .ai-card-docs__event-empty {
            margin: 0;
            color: #475569;
            font-size: 0.9rem;
          }

          .ai-card-docs__table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 0.75rem;
            font-size: 0.9rem;
          }

          .ai-card-docs__table th,
          .ai-card-docs__table td {
            border: 1px solid #d1d5db;
            padding: 0.625rem;
            text-align: left;
            vertical-align: top;
          }

          .ai-card-docs__table thead {
            background: #f8fafc;
          }

          .ai-card-docs__code {
            margin: 0.65rem 0 0;
            border-radius: 10px;
            padding: 0.75rem;
            overflow-x: auto;
            background: #0f172a;
            color: #e2e8f0;
            font: 500 0.78rem/1.45 'Menlo', 'Monaco', monospace;
          }

          .ai-card-docs__tokens-layout {
            display: grid;
            grid-template-columns: minmax(320px, 1fr) minmax(260px, 1fr);
            gap: 1rem;
            align-items: start;
          }

          .ai-card-docs__token-fieldset {
            margin: 0;
            padding: 0;
            border: 0;
          }

          .ai-card-docs__token-legend {
            padding: 0;
            margin: 0 0 0.25rem;
            font-size: 1rem;
            font-weight: 700;
          }

          .ai-card-docs__token-help {
            margin: 0 0 0.75rem;
            color: #334155;
            font-size: 0.9rem;
          }

          .ai-card-docs__token-grid {
            display: grid;
            gap: 0.625rem;
          }

          .ai-card-docs__token-row {
            display: grid;
            gap: 0.35rem;
          }

          .ai-card-docs__token-label {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 0.5rem;
            font-size: 0.88rem;
            font-weight: 600;
            color: #0f172a;
          }

          .ai-card-docs__token-label code {
            background: #f1f5f9;
            padding: 0.125rem 0.375rem;
            border-radius: 6px;
            font-size: 0.75rem;
          }

          .ai-card-docs__token-input {
            width: 100%;
            min-height: 2.15rem;
            border: 1px solid #94a3b8;
            border-radius: 8px;
            background: #ffffff;
            color: #0f172a;
            padding: 0.45rem 0.6rem;
            font-size: 0.88rem;
          }

          .ai-card-docs__token-input[type='color'] {
            padding: 0.2rem;
          }

          .ai-card-docs__token-input:focus-visible {
            outline: 2px solid #1d4ed8;
            outline-offset: 2px;
          }

          .ai-card-docs__token-default {
            margin: 0;
            color: #475569;
            font-size: 0.78rem;
          }

          .ai-card-docs__token-preview {
            display: grid;
            gap: 0.5rem;
          }

          .ai-card-docs__token-preview-title {
            margin: 0;
            font-size: 0.92rem;
            color: #0f172a;
          }

          .ai-card-docs__sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
          }

          @media (max-width: 920px) {
            .ai-card-docs__tokens-layout {
              grid-template-columns: 1fr;
            }
          }
        </style>

        <article class="ai-card-docs" aria-label="AiCardComponent single-page documentation">
          <section class="ai-card-docs__section" aria-labelledby="ai-card-docs-intro">
            <h2 id="ai-card-docs-intro" class="ai-card-docs__title">AiCardComponent</h2>
            <pre class="ai-card-docs__code"><code>import &#123;AiCardComponent&#125; from '@ai-cdk/ui';</code></pre>
            <p class="ai-card-docs__lead">
              AiCardComponent is a reusable surface for grouped content such as summaries, references,
              or inline actions in AI chat interfaces. This page combines API reference, behavior demos,
              and design token customization in one place.
            </p>
          </section>

          <section class="ai-card-docs__section" aria-labelledby="ai-card-docs-functional">
            <h2 id="ai-card-docs-functional" class="ai-card-docs__title">Functional API showcase</h2>
            <p class="ai-card-docs__lead">The clickable variant supports pointer and keyboard activation (Enter / Space).
            </p>

            <div class="ai-card-docs__variant-grid">
              <ai-card [clickable]="true" (cardClick)="onCardActivated($event)">
                <strong slot="header">Clickable card</strong>
                <p>Click this card or focus it and press Enter/Space.</p>
                <small slot="footer">Output: cardClick(MouseEvent)</small>
              </ai-card>
            </div>

            <h3 class="ai-card-docs__title">Event log</h3>
            @if (cardEventLog().length === 0) {
              <p class="ai-card-docs__event-empty">No events yet. Activate the clickable card to inspect emitted output.</p>
            } @else {
              <ol class="ai-card-docs__event-log">
                @for (entry of cardEventLog(); track entry) {
                  <li>{{ entry }}</li>
                }
              </ol>
            }
          </section>

          <section class="ai-card-docs__section" aria-labelledby="ai-card-docs-reference">
            <h2 id="ai-card-docs-reference" class="ai-card-docs__title">Technical reference</h2>
            <table class="ai-card-docs__table">
              <caption class="ai-card-docs__sr-only">AiCardComponent public API</caption>
              <thead>
                <tr>
                  <th scope="col">Type</th>
                  <th scope="col">Name</th>
                  <th scope="col">Accepted values</th>
                  <th scope="col">Default</th>
                  <th scope="col">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Input</td>
                  <td><code>clickable</code></td>
                  <td><code>boolean</code></td>
                  <td><code>false</code></td>
                  <td>Enables interactive behavior and keyboard activation semantics.</td>
                </tr>
                <tr>
                  <td>Output</td>
                  <td><code>cardClick</code></td>
                  <td><code>MouseEvent</code></td>
                  <td>n/a</td>
                  <td>Emitted when a clickable card is activated by click, Enter, or Space.</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section class="ai-card-docs__section" aria-labelledby="ai-card-docs-usage">
            <h2 id="ai-card-docs-usage" class="ai-card-docs__title">Usage snippets</h2>
            <p class="ai-card-docs__lead">Use projection slots for header and footer. Override styles via CSS custom properties.</p>
            <pre class="ai-card-docs__code">{{ basicUsageSnippet }}</pre>
            <pre class="ai-card-docs__code">{{ tokenUsageSnippet }}</pre>
          </section>

          <section class="ai-card-docs__section" aria-labelledby="ai-card-docs-tokens">
            <h2 id="ai-card-docs-tokens" class="ai-card-docs__title">Style tokens playground</h2>
            <div class="ai-card-docs__tokens-layout">
              <fieldset class="ai-card-docs__token-fieldset">
                <legend class="ai-card-docs__token-legend">Live token editor</legend>
                <p class="ai-card-docs__token-help">Adjust values below to update CSS variables on the preview card.</p>
                <div class="ai-card-docs__token-grid">
                  @for (token of tokenControls; track token.key) {
                    <div class="ai-card-docs__token-row">
                      <label class="ai-card-docs__token-label" [attr.for]="'ai-card-token-' + token.key">
                        <span>{{ token.label }}</span>
                        <code>{{ token.cssVar }}</code>
                      </label>
                      <input
                        class="ai-card-docs__token-input"
                        [id]="'ai-card-token-' + token.key"
                        [type]="token.inputType"
                        [value]="tokenValues()[token.key]"
                        [attr.aria-describedby]="'ai-card-token-help-' + token.key"
                        (input)="onTokenInputEvent(token.key, $event)"
                      />
                      <p class="ai-card-docs__token-default" [id]="'ai-card-token-help-' + token.key">
                        Default: <code>{{ token.defaultValue }}</code>
                      </p>
                    </div>
                  }
                </div>
              </fieldset>

              <div class="ai-card-docs__token-preview">
                <h3 class="ai-card-docs__token-preview-title">Preview</h3>
                <ai-card [style]="tokenStyles()" [clickable]="true" (cardClick)="onCardActivated($event)">
                  <strong slot="header">Token preview card</strong>
                  <p>Changes apply in real time through CSS custom properties.</p>
                  <small slot="footer">Style: <code>[style]="tokenStyles()"</code></small>
                </ai-card>
              </div>
            </div>
          </section>
        </article>
      `,
    };
  },
};
