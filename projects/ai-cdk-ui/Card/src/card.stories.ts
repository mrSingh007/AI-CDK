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

interface AiCardStyledVariantPreview {
  readonly name: string;
  readonly description: string;
  readonly tokenStyle: string;
  readonly clickable: boolean;
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

const CARD_STYLED_VARIANT_PREVIEWS: readonly AiCardStyledVariantPreview[] = [
  {
    name: 'Elevated accent',
    description: 'Use for highlighted summaries and key actions.',
    tokenStyle:
      '--ai-card-bg: #f8fbff; --ai-card-border: 1px solid #93c5fd; --ai-card-color: #0f172a; --ai-card-shadow: 0 10px 24px rgba(37, 99, 235, 0.14); --ai-card-hover-shadow: 0 14px 28px rgba(37, 99, 235, 0.2);',
    clickable: true,
  },
  {
    name: 'Subtle neutral',
    description: 'Use for low-priority context blocks.',
    tokenStyle:
      '--ai-card-bg: #f8fafc; --ai-card-border: 1px solid #dbe3ee; --ai-card-color: #1e293b; --ai-card-shadow: 0 4px 12px rgba(15, 23, 42, 0.06); --ai-card-hover-shadow: 0 6px 16px rgba(15, 23, 42, 0.1);',
    clickable: false,
  },
  {
    name: 'Warm callout',
    description: 'Use for alerts, onboarding tips, and guidance.',
    tokenStyle:
      '--ai-card-bg: #fff8ed; --ai-card-border: 1px solid #f7c98a; --ai-card-color: #7c2d12; --ai-card-shadow: 0 8px 20px rgba(234, 88, 12, 0.14); --ai-card-hover-shadow: 0 10px 24px rgba(234, 88, 12, 0.2);',
    clickable: false,
  },
];

const DEFAULT_USAGE_SNIPPET = `<ai-card>
  <h3 slot="header">Card header</h3>
  <p>Main card body content.</p>
  <small slot="footer">Footer area</small>
</ai-card>`;

const CLICKABLE_USAGE_SNIPPET = `<ai-card [clickable]="true" (cardClick)="onCardActivated($event)">
  <strong slot="header">Interactive card</strong>
  <p>Supports click + keyboard activation (Enter/Space).</p>
  <small slot="footer">Output: cardClick(MouseEvent)</small>
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
        styledVariantPreviews: CARD_STYLED_VARIANT_PREVIEWS,
        tokenValues,
        tokenStyles,
        cardEventLog,
        defaultUsageSnippet: DEFAULT_USAGE_SNIPPET,
        clickableUsageSnippet: CLICKABLE_USAGE_SNIPPET,
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
            font-family: 'Manrope', 'Avenir Next', 'Segoe UI', sans-serif;
            display: grid;
            gap: 1rem;
            color: #10233f;
            font-size: 0.95rem;
            line-height: 1.55;
          }

          .ai-card-docs__section {
            border: 1px solid #d5e2f3;
            border-radius: 16px;
            padding: 1.1rem;
            background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
            box-shadow: 0 8px 20px rgba(15, 23, 42, 0.04);
          }

          .ai-card-docs__title {
            margin: 0 0 0.5rem;
            font-size: 1.24rem;
            line-height: 1.3;
            color: #0b1f3a;
            letter-spacing: 0.01em;
          }

          .ai-card-docs__subtitle {
            margin: 0 0 0.5rem;
            font-size: 1.02rem;
            line-height: 1.4;
            color: #11365e;
          }

          .ai-card-docs__lead {
            margin: 0;
            color: #2a3f5e;
            line-height: 1.5;
          }

          .ai-card-docs__default-layout {
            margin-top: 0.95rem;
            display: grid;
            grid-template-columns: minmax(280px, 1.15fr) minmax(280px, 1fr);
            gap: 1rem;
          }

          .ai-card-docs__preview-stack {
            display: grid;
            gap: 0.75rem;
          }

          .ai-card-docs__preview-panel {
            border: 1px dashed #b9cbe3;
            border-radius: 12px;
            padding: 0.75rem;
            background: #f3f8ff;
          }

          .ai-card-docs__preview-label {
            margin: 0 0 0.5rem;
            font-size: 0.82rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.04em;
            color: #274a74;
          }

          .ai-card-docs__code-stack {
            display: grid;
            gap: 0.75rem;
          }

          .ai-card-docs__event-panel {
            margin-top: 0.9rem;
            border: 1px solid #cad9ed;
            border-radius: 12px;
            background: #f7fbff;
            padding: 0.75rem;
          }

          .ai-card-docs__event-log {
            margin: 0;
            padding-left: 1.125rem;
            color: #0f2746;
            font: 500 0.82rem/1.45 'JetBrains Mono', 'SFMono-Regular', 'Menlo', monospace;
          }

          .ai-card-docs__event-empty {
            margin: 0;
            color: #355174;
            font-size: 0.9rem;
          }

          .ai-card-docs__table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 0.75rem;
            font-size: 0.88rem;
          }

          .ai-card-docs__table th,
          .ai-card-docs__table td {
            border: 1px solid #ccdaea;
            padding: 0.6rem;
            text-align: left;
            vertical-align: top;
          }

          .ai-card-docs__table thead {
            background: #edf5ff;
            color: #0f355f;
          }

          .ai-card-docs__notes {
            margin: 0.75rem 0 0;
            padding-left: 1.1rem;
            color: #274667;
          }

          .ai-card-docs__notes li + li {
            margin-top: 0.3rem;
          }

          .ai-card-docs__code {
            margin: 0;
            border-radius: 12px;
            border: 1px solid #22324b;
            padding: 0.8rem 0.85rem;
            overflow-x: auto;
            background: #0f1a2c;
            color: #d7e5ff;
            font: 500 0.79rem/1.5 'JetBrains Mono', 'SFMono-Regular', 'Menlo', monospace;
          }

          .ai-card-docs__variant-grid {
            margin-top: 0.9rem;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
            gap: 0.75rem;
          }

          .ai-card-docs__variant-card {
            border: 1px solid #d4e2f4;
            border-radius: 12px;
            padding: 0.75rem;
            background: #f8fbff;
            display: grid;
            gap: 0.5rem;
          }

          .ai-card-docs__variant-name {
            margin: 0;
            font-size: 0.9rem;
            font-weight: 700;
            color: #103a69;
          }

          .ai-card-docs__variant-description {
            margin: 0;
            color: #355a80;
            font-size: 0.82rem;
          }

          .ai-card-docs__tokens-layout {
            display: grid;
            grid-template-columns: minmax(320px, 1fr) minmax(260px, 0.95fr);
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
            color: #0d2f53;
          }

          .ai-card-docs__token-help {
            margin: 0 0 0.75rem;
            color: #2f4f75;
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
            color: #143960;
          }

          .ai-card-docs__token-label code {
            background: #e8f0fb;
            padding: 0.125rem 0.375rem;
            border-radius: 6px;
            font-size: 0.75rem;
          }

          .ai-card-docs__token-input {
            width: 100%;
            min-height: 2.15rem;
            border: 1px solid #8ca8c8;
            border-radius: 8px;
            background: #ffffff;
            color: #0f2746;
            padding: 0.45rem 0.6rem;
            font-size: 0.88rem;
          }

          .ai-card-docs__token-input[type='color'] {
            padding: 0.2rem;
          }

          .ai-card-docs__token-input:focus-visible {
            outline: 2px solid #0f4ea0;
            outline-offset: 2px;
          }

          .ai-card-docs__token-default {
            margin: 0;
            color: #355779;
            font-size: 0.78rem;
          }

          .ai-card-docs__token-preview {
            display: grid;
            gap: 0.5rem;
          }

          .ai-card-docs__token-preview-title {
            margin: 0;
            font-size: 0.95rem;
            color: #12385f;
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

          @media (max-width: 980px) {
            .ai-card-docs__default-layout {
              grid-template-columns: 1fr;
            }
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
            <p class="ai-card-docs__lead">
              Reusable content surface for grouped information, inline actions, and contextual messaging.
            </p>
            <pre class="ai-card-docs__code"><code>import &#123; AiCardComponent &#125; from '@ai-cdk/ui/Card';</code></pre>
          </section>

          <section class="ai-card-docs__section" aria-labelledby="ai-card-docs-reference">
            <h2 id="ai-card-docs-reference" class="ai-card-docs__title">Technical reference</h2>
            <h3 class="ai-card-docs__subtitle">Public API</h3>
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
                  <td>Enables interactive semantics including keyboard activation.</td>
                </tr>
                <tr>
                  <td>Output</td>
                  <td><code>cardClick</code></td>
                  <td><code>MouseEvent</code></td>
                  <td>n/a</td>
                  <td>Emitted on click, Enter, or Space while <code>clickable</code> is true.</td>
                </tr>
              </tbody>
            </table>

            <h3 class="ai-card-docs__subtitle">Style tokens</h3>
            <table class="ai-card-docs__table">
              <caption class="ai-card-docs__sr-only">AiCardComponent style tokens</caption>
              <thead>
                <tr>
                  <th scope="col">Token</th>
                  <th scope="col">CSS variable</th>
                  <th scope="col">Default</th>
                </tr>
              </thead>
              <tbody>
                @for (token of tokenControls; track token.key) {
                  <tr>
                    <td>{{ token.label }}</td>
                    <td><code>{{ token.cssVar }}</code></td>
                    <td><code>{{ token.defaultValue }}</code></td>
                  </tr>
                }
              </tbody>
            </table>

            <ul class="ai-card-docs__notes">
              <li>Supports content projection slots: <code>header</code>, default body slot, and <code>footer</code>.</li>
              <li>Keyboard support for interactive cards: Enter and Space trigger <code>cardClick</code>.</li>
              <li>Visual customization uses CSS custom properties (tokens), not style-specific component inputs.</li>
            </ul>
          </section>

          <section class="ai-card-docs__section" aria-labelledby="ai-card-docs-default">
            <h2 id="ai-card-docs-default" class="ai-card-docs__title">Default showcase</h2>
            <p class="ai-card-docs__lead">
              Unmodified default appearance with base behavior and usage snippets.
            </p>

            <div class="ai-card-docs__default-layout">
              <div class="ai-card-docs__preview-stack">
                <h3 class="ai-card-docs__subtitle">Preview</h3>

                <div class="ai-card-docs__preview-panel">
                  <p class="ai-card-docs__preview-label">Static card</p>
                  <ai-card>
                    <strong slot="header">Card header</strong>
                    <p>Base card with slots and default tokens.</p>
                    <small slot="footer">Non-interactive surface</small>
                  </ai-card>
                </div>

                <div class="ai-card-docs__preview-panel">
                  <p class="ai-card-docs__preview-label">Interactive card</p>
                  <ai-card [clickable]="true" (cardClick)="onCardActivated($event)">
                    <strong slot="header">Clickable card</strong>
                    <p>Click or press Enter/Space while focused.</p>
                    <small slot="footer">Output: cardClick(MouseEvent)</small>
                  </ai-card>
                </div>
              </div>

              <div class="ai-card-docs__code-stack">
                <h3 class="ai-card-docs__subtitle">Usage snippets</h3>
                <pre class="ai-card-docs__code"><code>{{ defaultUsageSnippet }}</code></pre>
                <pre class="ai-card-docs__code"><code>{{ clickableUsageSnippet }}</code></pre>
              </div>
            </div>

            <div class="ai-card-docs__event-panel" aria-live="polite">
              <h3 class="ai-card-docs__subtitle">Event log</h3>
              @if (cardEventLog().length === 0) {
                <p class="ai-card-docs__event-empty">No events yet. Activate the interactive card to inspect emitted payloads.</p>
              } @else {
                <ol class="ai-card-docs__event-log">
                  @for (entry of cardEventLog(); track entry) {
                    <li>{{ entry }}</li>
                  }
                </ol>
              }
            </div>
          </section>

          <section class="ai-card-docs__section" aria-labelledby="ai-card-docs-variants">
            <h2 id="ai-card-docs-variants" class="ai-card-docs__title">Styled variants previews</h2>
            <p class="ai-card-docs__lead">
              Preview-only examples that combine token overrides with clickable/non-clickable variants.
            </p>
            <div class="ai-card-docs__variant-grid">
              @for (variant of styledVariantPreviews; track variant.name) {
                <div class="ai-card-docs__variant-card">
                  <p class="ai-card-docs__variant-name">{{ variant.name }}</p>
                  <p class="ai-card-docs__variant-description">{{ variant.description }}</p>
                  <ai-card
                    [style]="variant.tokenStyle"
                    [clickable]="variant.clickable"
                    (cardClick)="onCardActivated($event)"
                  >
                    <strong slot="header">{{ variant.name }}</strong>
                    <p>{{ variant.description }}</p>
                    <small slot="footer">
                      Variant: {{ variant.clickable ? 'interactive' : 'static' }}
                    </small>
                  </ai-card>
                </div>
              }
            </div>
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
