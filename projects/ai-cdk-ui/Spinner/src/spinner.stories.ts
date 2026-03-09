import { computed, signal } from '@angular/core';
import { AiSpinnerComponent } from '@ai-cdk/ui/Spinner';
import type { Meta, StoryObj } from '@storybook/angular';

interface AiSpinnerTokens {
  readonly spinnerColor: string;
  readonly spinnerTrackColor: string;
  readonly spinnerSize: string;
  readonly spinnerStrokeWidth: string;
  readonly spinnerDuration: string;
}

interface AiSpinnerTokenControl {
  readonly key: keyof AiSpinnerTokens;
  readonly cssVar: string;
  readonly label: string;
  readonly inputType: 'color' | 'text';
  readonly defaultValue: string;
}

const SPINNER_TOKEN_DEFAULTS: AiSpinnerTokens = {
  spinnerColor: '#3b82f6',
  spinnerTrackColor: '#e5e7eb',
  spinnerSize: '18px',
  spinnerStrokeWidth: '2.5px',
  spinnerDuration: '0.75s',
};

const SPINNER_TOKEN_CONTROLS: readonly AiSpinnerTokenControl[] = [
  {
    key: 'spinnerColor',
    cssVar: '--ai-spinner-color',
    label: 'Spinner color',
    inputType: 'color',
    defaultValue: SPINNER_TOKEN_DEFAULTS.spinnerColor,
  },
  {
    key: 'spinnerTrackColor',
    cssVar: '--ai-spinner-track-color',
    label: 'Track color',
    inputType: 'color',
    defaultValue: SPINNER_TOKEN_DEFAULTS.spinnerTrackColor,
  },
  {
    key: 'spinnerSize',
    cssVar: '--ai-spinner-size',
    label: 'Size',
    inputType: 'text',
    defaultValue: SPINNER_TOKEN_DEFAULTS.spinnerSize,
  },
  {
    key: 'spinnerStrokeWidth',
    cssVar: '--ai-spinner-stroke-width',
    label: 'Stroke width',
    inputType: 'text',
    defaultValue: SPINNER_TOKEN_DEFAULTS.spinnerStrokeWidth,
  },
  {
    key: 'spinnerDuration',
    cssVar: '--ai-spinner-duration',
    label: 'Animation duration',
    inputType: 'text',
    defaultValue: SPINNER_TOKEN_DEFAULTS.spinnerDuration,
  },
];

const BASIC_USAGE_SNIPPET = `<ai-spinner></ai-spinner>`;

const INLINE_COLOR_SNIPPET = `<div style="--ai-spinner-inline-color: #ef4444;">
  <ai-spinner></ai-spinner>
</div>`;

function buildSpinnerTokenStyles(tokens: AiSpinnerTokens): string {
  return [
    `--ai-spinner-color: ${tokens.spinnerColor}`,
    `--ai-spinner-track-color: ${tokens.spinnerTrackColor}`,
    `--ai-spinner-size: ${tokens.spinnerSize}`,
    `--ai-spinner-stroke-width: ${tokens.spinnerStrokeWidth}`,
    `--ai-spinner-duration: ${tokens.spinnerDuration}`,
  ].join('; ');
}

const meta: Meta = {
  title: 'UI/Spinner',
  component: AiSpinnerComponent,
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
    const tokenValues = signal<AiSpinnerTokens>(SPINNER_TOKEN_DEFAULTS);
    const tokenStyles = computed(() => buildSpinnerTokenStyles(tokenValues()));

    return {
      props: {
        tokenControls: SPINNER_TOKEN_CONTROLS,
        tokenValues,
        tokenStyles,
        basicUsageSnippet: BASIC_USAGE_SNIPPET,
        inlineColorSnippet: INLINE_COLOR_SNIPPET,
        onTokenInputEvent: (key: keyof AiSpinnerTokens, event: Event): void => {
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
          .ai-spinner-docs {
            font-family: 'Manrope', 'Avenir Next', 'Segoe UI', sans-serif;
            display: grid;
            gap: 1rem;
            color: #10233f;
            font-size: 0.95rem;
            line-height: 1.55;
          }

          .ai-spinner-docs__section {
            border: 1px solid #d5e2f3;
            border-radius: 16px;
            padding: 1.1rem;
            background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
            box-shadow: 0 8px 20px rgba(15, 23, 42, 0.04);
          }

          .ai-spinner-docs__title {
            margin: 0 0 0.5rem;
            font-size: 1.24rem;
            line-height: 1.3;
            color: #0b1f3a;
            letter-spacing: 0.01em;
          }

          .ai-spinner-docs__subtitle {
            margin: 0 0 0.5rem;
            font-size: 1.02rem;
            line-height: 1.4;
            color: #11365e;
          }

          .ai-spinner-docs__lead {
            margin: 0;
            color: #2a3f5e;
            line-height: 1.5;
          }

          .ai-spinner-docs__preview-grid {
            margin-top: 0.875rem;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 0.75rem;
          }

          .ai-spinner-docs__preview {
            display: grid;
            place-items: center;
            gap: 0.5rem;
            min-height: 120px;
            border: 1px dashed #b9cbe3;
            border-radius: 12px;
            padding: 0.75rem;
            background: #f3f8ff;
          }

          .ai-spinner-docs__preview-label {
            margin: 0;
            font-size: 0.85rem;
            color: #274a74;
          }

          .ai-spinner-docs__table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 0.75rem;
            font-size: 0.88rem;
          }

          .ai-spinner-docs__table th,
          .ai-spinner-docs__table td {
            border: 1px solid #ccdaea;
            padding: 0.6rem;
            text-align: left;
            vertical-align: top;
          }

          .ai-spinner-docs__table thead {
            background: #edf5ff;
            color: #0f355f;
          }

          .ai-spinner-docs__code {
            margin: 0;
            border-radius: 12px;
            border: 1px solid #22324b;
            padding: 0.8rem 0.85rem;
            background: #0f1a2c;
            color: #d7e5ff;
            font: 500 0.79rem/1.5 'JetBrains Mono', 'SFMono-Regular', 'Menlo', monospace;
            overflow-x: auto;
          }

          .ai-spinner-docs__tokens-layout {
            display: grid;
            grid-template-columns: minmax(320px, 1fr) minmax(240px, 1fr);
            gap: 1rem;
            align-items: start;
          }

          .ai-spinner-docs__token-fieldset {
            margin: 0;
            border: 0;
            padding: 0;
          }

          .ai-spinner-docs__token-grid {
            display: grid;
            gap: 0.625rem;
          }

          .ai-spinner-docs__token-row {
            display: grid;
            gap: 0.35rem;
          }

          .ai-spinner-docs__token-label {
            display: flex;
            justify-content: space-between;
            gap: 0.5rem;
            font-size: 0.88rem;
            font-weight: 600;
            color: #143960;
          }

          .ai-spinner-docs__token-label code {
            padding: 0.125rem 0.375rem;
            border-radius: 6px;
            background: #e8f0fb;
            font-size: 0.75rem;
          }

          .ai-spinner-docs__token-input {
            min-height: 2.1rem;
            width: 100%;
            border: 1px solid #8ca8c8;
            border-radius: 8px;
            background: #ffffff;
            color: #0f2746;
            padding: 0.45rem 0.6rem;
          }

          .ai-spinner-docs__token-input[type='color'] {
            padding: 0.2rem;
          }

          .ai-spinner-docs__token-input:focus-visible {
            outline: 2px solid #0f4ea0;
            outline-offset: 2px;
          }

          .ai-spinner-docs__token-default {
            margin: 0;
            color: #355779;
            font-size: 0.78rem;
          }

          .ai-spinner-docs__token-preview {
            min-height: 240px;
            display: grid;
            place-items: center;
            border: 1px dashed #b9cbe3;
            border-radius: 12px;
            background: #f3f8ff;
          }

          @media (max-width: 920px) {
            .ai-spinner-docs__tokens-layout {
              grid-template-columns: 1fr;
            }
          }
        </style>

        <article class="ai-spinner-docs" aria-label="AiSpinnerComponent single-page documentation">
          <section class="ai-spinner-docs__section" aria-labelledby="ai-spinner-intro">
            <h2 id="ai-spinner-intro" class="ai-spinner-docs__title">AiSpinnerComponent</h2>
            <p class="ai-spinner-docs__lead">
              AiSpinnerComponent provides a lightweight loading indicator with CSS-token theming support for
              color, dimensions, and animation timing.
            </p>
            <pre class="ai-spinner-docs__code"><code>import &#123; AiSpinnerComponent &#125; from '@ai-cdk/ui/Spinner';</code></pre>
          </section>

          <section class="ai-spinner-docs__section" aria-labelledby="ai-spinner-reference">
            <h2 id="ai-spinner-reference" class="ai-spinner-docs__title">Technical reference</h2>
            <table class="ai-spinner-docs__table">
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
                  <td><code>n/a</code></td>
                  <td><code>n/a</code></td>
                  <td><code>n/a</code></td>
                  <td>Spinner behavior is configured through CSS tokens and inline CSS variables.</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section class="ai-spinner-docs__section" aria-labelledby="ai-spinner-default">
            <h2 id="ai-spinner-default" class="ai-spinner-docs__title">Default showcase</h2>
            <p class="ai-spinner-docs__lead">Base spinner without token or inline style overrides.</p>
            <div class="ai-spinner-docs__preview-grid">
              <div class="ai-spinner-docs__preview">
                <ai-spinner></ai-spinner>
                <p class="ai-spinner-docs__preview-label">default size (18px)</p>
              </div>
            </div>
            <h3 class="ai-spinner-docs__subtitle">Usage snippet</h3>
            <pre class="ai-spinner-docs__code"><code>{{ basicUsageSnippet }}</code></pre>
          </section>

          <section class="ai-spinner-docs__section" aria-labelledby="ai-spinner-variants">
            <h2 id="ai-spinner-variants" class="ai-spinner-docs__title">Styled variants previews</h2>
            <p class="ai-spinner-docs__lead">Preview-only examples using inline style overrides and token variables.</p>
            <div class="ai-spinner-docs__preview-grid">
              <div class="ai-spinner-docs__preview" style="--ai-spinner-size: 28px;">
                <ai-spinner></ai-spinner>
                <p class="ai-spinner-docs__preview-label">token size override (28px)</p>
              </div>

              <div class="ai-spinner-docs__preview" style="--ai-spinner-inline-color: #ef4444;">
                <ai-spinner></ai-spinner>
                <p class="ai-spinner-docs__preview-label">inline color override</p>
              </div>
            </div>
          </section>

          <section class="ai-spinner-docs__section" aria-labelledby="ai-spinner-tokens">
            <h2 id="ai-spinner-tokens" class="ai-spinner-docs__title">Style tokens playground</h2>
            <div class="ai-spinner-docs__tokens-layout">
              <fieldset class="ai-spinner-docs__token-fieldset">
                <legend class="ai-spinner-docs__subtitle">Live token editor</legend>
                <div class="ai-spinner-docs__token-grid">
                  @for (token of tokenControls; track token.key) {
                    <div class="ai-spinner-docs__token-row">
                      <label class="ai-spinner-docs__token-label" [attr.for]="'ai-spinner-token-' + token.key">
                        <span>{{ token.label }}</span>
                        <code>{{ token.cssVar }}</code>
                      </label>
                      <input
                        class="ai-spinner-docs__token-input"
                        [id]="'ai-spinner-token-' + token.key"
                        [type]="token.inputType"
                        [value]="tokenValues()[token.key]"
                        (input)="onTokenInputEvent(token.key, $event)"
                      />
                      <p class="ai-spinner-docs__token-default">Default: <code>{{ token.defaultValue }}</code></p>
                    </div>
                  }
                </div>
              </fieldset>

              <div class="ai-spinner-docs__token-preview">
                <ai-spinner [style]="tokenStyles()"></ai-spinner>
              </div>
            </div>
          </section>
        </article>
      `,
    };
  },
};
