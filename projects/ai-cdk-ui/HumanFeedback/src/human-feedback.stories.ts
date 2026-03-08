import { computed, signal } from '@angular/core';
import { AiHumanFeedbackComponent } from '@ai-cdk/ui/HumanFeedback';
import type { Meta, StoryObj } from '@storybook/angular';

interface AiHumanFeedbackTokens {
  readonly maxWidth: string;
  readonly containerBg: string;
  readonly containerBorder: string;
  readonly containerRadius: string;
  readonly containerPadding: string;
  readonly containerGap: string;
  readonly textColor: string;
  readonly textSize: string;
  readonly actionsGap: string;
  readonly buttonPadding: string;
  readonly buttonRadius: string;
  readonly buttonFontSize: string;
  readonly buttonFontWeight: string;
  readonly buttonFlex: string;
  readonly buttonBorder: string;
  readonly cancelHeight: string;
  readonly approveHeight: string;
  readonly focusRingColor: string;
  readonly focusRingShadow: string;
  readonly cancelBg: string;
  readonly cancelColor: string;
  readonly cancelButtonBorder: string;
  readonly cancelHoverBg: string;
  readonly cancelActiveBg: string;
  readonly approveBg: string;
  readonly approveColor: string;
  readonly approveButtonBorder: string;
  readonly approveHoverBg: string;
  readonly approveActiveBg: string;
}

interface AiHumanFeedbackTokenControl {
  readonly key: keyof AiHumanFeedbackTokens;
  readonly cssVar: string;
  readonly label: string;
  readonly inputType: 'color' | 'text';
  readonly defaultValue: string;
}

const HUMAN_FEEDBACK_TOKEN_DEFAULTS: AiHumanFeedbackTokens = {
  maxWidth: '40rem',
  containerBg: '#ffffff',
  containerBorder: '1px solid #d1d5db',
  containerRadius: '12px',
  containerPadding: '1rem',
  containerGap: '0.875rem',
  textColor: '#111827',
  textSize: '1rem',
  actionsGap: '0.75rem',
  buttonPadding: '0.625rem 0.875rem',
  buttonRadius: '10px',
  buttonFontSize: '0.95rem',
  buttonFontWeight: '600',
  buttonFlex: '1 1 10rem',
  buttonBorder: '1px solid transparent',
  cancelHeight: '2.625rem',
  approveHeight: '2.625rem',
  focusRingColor: '#1d4ed8',
  focusRingShadow: '0 0 0 3px rgba(29, 78, 216, 0.3)',
  cancelBg: '#ffffff',
  cancelColor: '#1f2937',
  cancelButtonBorder: '1px solid #6b7280',
  cancelHoverBg: '#f9fafb',
  cancelActiveBg: '#f3f4f6',
  approveBg: '#1d4ed8',
  approveColor: '#ffffff',
  approveButtonBorder: '1px solid #1e40af',
  approveHoverBg: '#1e40af',
  approveActiveBg: '#1e3a8a',
};

const HUMAN_FEEDBACK_TOKEN_CONTROLS: readonly AiHumanFeedbackTokenControl[] = [
  {
    key: 'maxWidth',
    cssVar: '--ai-human-feedback-max-width',
    label: 'Max width',
    inputType: 'text',
    defaultValue: HUMAN_FEEDBACK_TOKEN_DEFAULTS.maxWidth,
  },
  {
    key: 'containerBg',
    cssVar: '--ai-human-feedback-bg',
    label: 'Container background',
    inputType: 'color',
    defaultValue: HUMAN_FEEDBACK_TOKEN_DEFAULTS.containerBg,
  },
  {
    key: 'containerBorder',
    cssVar: '--ai-human-feedback-border',
    label: 'Container border',
    inputType: 'text',
    defaultValue: HUMAN_FEEDBACK_TOKEN_DEFAULTS.containerBorder,
  },
  {
    key: 'containerRadius',
    cssVar: '--ai-human-feedback-radius',
    label: 'Container radius',
    inputType: 'text',
    defaultValue: HUMAN_FEEDBACK_TOKEN_DEFAULTS.containerRadius,
  },
  {
    key: 'containerPadding',
    cssVar: '--ai-human-feedback-padding',
    label: 'Container padding',
    inputType: 'text',
    defaultValue: HUMAN_FEEDBACK_TOKEN_DEFAULTS.containerPadding,
  },
  {
    key: 'containerGap',
    cssVar: '--ai-human-feedback-gap',
    label: 'Container gap',
    inputType: 'text',
    defaultValue: HUMAN_FEEDBACK_TOKEN_DEFAULTS.containerGap,
  },
  {
    key: 'textColor',
    cssVar: '--ai-human-feedback-text-color',
    label: 'Text color',
    inputType: 'color',
    defaultValue: HUMAN_FEEDBACK_TOKEN_DEFAULTS.textColor,
  },
  {
    key: 'textSize',
    cssVar: '--ai-human-feedback-text-size',
    label: 'Text size',
    inputType: 'text',
    defaultValue: HUMAN_FEEDBACK_TOKEN_DEFAULTS.textSize,
  },
  {
    key: 'actionsGap',
    cssVar: '--ai-human-feedback-actions-gap',
    label: 'Actions gap',
    inputType: 'text',
    defaultValue: HUMAN_FEEDBACK_TOKEN_DEFAULTS.actionsGap,
  },
  {
    key: 'buttonPadding',
    cssVar: '--ai-human-feedback-button-padding',
    label: 'Button padding',
    inputType: 'text',
    defaultValue: HUMAN_FEEDBACK_TOKEN_DEFAULTS.buttonPadding,
  },
  {
    key: 'buttonRadius',
    cssVar: '--ai-human-feedback-button-radius',
    label: 'Button radius',
    inputType: 'text',
    defaultValue: HUMAN_FEEDBACK_TOKEN_DEFAULTS.buttonRadius,
  },
  {
    key: 'buttonFontSize',
    cssVar: '--ai-human-feedback-button-font-size',
    label: 'Button font size',
    inputType: 'text',
    defaultValue: HUMAN_FEEDBACK_TOKEN_DEFAULTS.buttonFontSize,
  },
  {
    key: 'buttonFontWeight',
    cssVar: '--ai-human-feedback-button-font-weight',
    label: 'Button font weight',
    inputType: 'text',
    defaultValue: HUMAN_FEEDBACK_TOKEN_DEFAULTS.buttonFontWeight,
  },
  {
    key: 'buttonFlex',
    cssVar: '--ai-human-feedback-button-flex',
    label: 'Button flex',
    inputType: 'text',
    defaultValue: HUMAN_FEEDBACK_TOKEN_DEFAULTS.buttonFlex,
  },
  {
    key: 'buttonBorder',
    cssVar: '--ai-human-feedback-button-border',
    label: 'Button border',
    inputType: 'text',
    defaultValue: HUMAN_FEEDBACK_TOKEN_DEFAULTS.buttonBorder,
  },
  {
    key: 'cancelHeight',
    cssVar: '--ai-human-feedback-cancel-height',
    label: 'Reject button height',
    inputType: 'text',
    defaultValue: HUMAN_FEEDBACK_TOKEN_DEFAULTS.cancelHeight,
  },
  {
    key: 'approveHeight',
    cssVar: '--ai-human-feedback-approve-height',
    label: 'Approve button height',
    inputType: 'text',
    defaultValue: HUMAN_FEEDBACK_TOKEN_DEFAULTS.approveHeight,
  },
  {
    key: 'focusRingColor',
    cssVar: '--ai-human-feedback-focus-ring-color',
    label: 'Focus ring color',
    inputType: 'color',
    defaultValue: HUMAN_FEEDBACK_TOKEN_DEFAULTS.focusRingColor,
  },
  {
    key: 'focusRingShadow',
    cssVar: '--ai-human-feedback-focus-ring-shadow',
    label: 'Focus ring shadow',
    inputType: 'text',
    defaultValue: HUMAN_FEEDBACK_TOKEN_DEFAULTS.focusRingShadow,
  },
  {
    key: 'cancelBg',
    cssVar: '--ai-human-feedback-cancel-bg',
    label: 'Reject button background',
    inputType: 'color',
    defaultValue: HUMAN_FEEDBACK_TOKEN_DEFAULTS.cancelBg,
  },
  {
    key: 'cancelColor',
    cssVar: '--ai-human-feedback-cancel-color',
    label: 'Reject button color',
    inputType: 'color',
    defaultValue: HUMAN_FEEDBACK_TOKEN_DEFAULTS.cancelColor,
  },
  {
    key: 'cancelButtonBorder',
    cssVar: '--ai-human-feedback-cancel-button-border',
    label: 'Reject button border',
    inputType: 'text',
    defaultValue: HUMAN_FEEDBACK_TOKEN_DEFAULTS.cancelButtonBorder,
  },
  {
    key: 'cancelHoverBg',
    cssVar: '--ai-human-feedback-cancel-hover-bg',
    label: 'Reject hover background',
    inputType: 'color',
    defaultValue: HUMAN_FEEDBACK_TOKEN_DEFAULTS.cancelHoverBg,
  },
  {
    key: 'cancelActiveBg',
    cssVar: '--ai-human-feedback-cancel-active-bg',
    label: 'Reject active background',
    inputType: 'color',
    defaultValue: HUMAN_FEEDBACK_TOKEN_DEFAULTS.cancelActiveBg,
  },
  {
    key: 'approveBg',
    cssVar: '--ai-human-feedback-approve-bg',
    label: 'Approve button background',
    inputType: 'color',
    defaultValue: HUMAN_FEEDBACK_TOKEN_DEFAULTS.approveBg,
  },
  {
    key: 'approveColor',
    cssVar: '--ai-human-feedback-approve-color',
    label: 'Approve button color',
    inputType: 'color',
    defaultValue: HUMAN_FEEDBACK_TOKEN_DEFAULTS.approveColor,
  },
  {
    key: 'approveButtonBorder',
    cssVar: '--ai-human-feedback-approve-button-border',
    label: 'Approve button border',
    inputType: 'text',
    defaultValue: HUMAN_FEEDBACK_TOKEN_DEFAULTS.approveButtonBorder,
  },
  {
    key: 'approveHoverBg',
    cssVar: '--ai-human-feedback-approve-hover-bg',
    label: 'Approve hover background',
    inputType: 'color',
    defaultValue: HUMAN_FEEDBACK_TOKEN_DEFAULTS.approveHoverBg,
  },
  {
    key: 'approveActiveBg',
    cssVar: '--ai-human-feedback-approve-active-bg',
    label: 'Approve active background',
    inputType: 'color',
    defaultValue: HUMAN_FEEDBACK_TOKEN_DEFAULTS.approveActiveBg,
  },
];

const BASIC_USAGE_SNIPPET = `<ai-human-feedback
  [text]="'Should the agent proceed?'"
  [approveButtonText]="'Confirm'"
  [cancelButtonText]="'Reject'"
  (confirmed)="onConfirmed()"
  (rejected)="onRejected()"
></ai-human-feedback>`;

const TOKEN_USAGE_SNIPPET = `<ai-human-feedback
  style="--ai-human-feedback-bg: #f8fafc; --ai-human-feedback-approve-bg: #0f766e; --ai-human-feedback-approve-height: 3rem;"
  [text]="'Token-styled confirmation'"
></ai-human-feedback>`;

function buildHumanFeedbackTokenStyles(tokens: AiHumanFeedbackTokens): string {
  return [
    `--ai-human-feedback-max-width: ${tokens.maxWidth}`,
    `--ai-human-feedback-bg: ${tokens.containerBg}`,
    `--ai-human-feedback-border: ${tokens.containerBorder}`,
    `--ai-human-feedback-radius: ${tokens.containerRadius}`,
    `--ai-human-feedback-padding: ${tokens.containerPadding}`,
    `--ai-human-feedback-gap: ${tokens.containerGap}`,
    `--ai-human-feedback-text-color: ${tokens.textColor}`,
    `--ai-human-feedback-text-size: ${tokens.textSize}`,
    `--ai-human-feedback-actions-gap: ${tokens.actionsGap}`,
    `--ai-human-feedback-button-padding: ${tokens.buttonPadding}`,
    `--ai-human-feedback-button-radius: ${tokens.buttonRadius}`,
    `--ai-human-feedback-button-font-size: ${tokens.buttonFontSize}`,
    `--ai-human-feedback-button-font-weight: ${tokens.buttonFontWeight}`,
    `--ai-human-feedback-button-flex: ${tokens.buttonFlex}`,
    `--ai-human-feedback-button-border: ${tokens.buttonBorder}`,
    `--ai-human-feedback-cancel-height: ${tokens.cancelHeight}`,
    `--ai-human-feedback-approve-height: ${tokens.approveHeight}`,
    `--ai-human-feedback-focus-ring-color: ${tokens.focusRingColor}`,
    `--ai-human-feedback-focus-ring-shadow: ${tokens.focusRingShadow}`,
    `--ai-human-feedback-cancel-bg: ${tokens.cancelBg}`,
    `--ai-human-feedback-cancel-color: ${tokens.cancelColor}`,
    `--ai-human-feedback-cancel-button-border: ${tokens.cancelButtonBorder}`,
    `--ai-human-feedback-cancel-hover-bg: ${tokens.cancelHoverBg}`,
    `--ai-human-feedback-cancel-active-bg: ${tokens.cancelActiveBg}`,
    `--ai-human-feedback-approve-bg: ${tokens.approveBg}`,
    `--ai-human-feedback-approve-color: ${tokens.approveColor}`,
    `--ai-human-feedback-approve-button-border: ${tokens.approveButtonBorder}`,
    `--ai-human-feedback-approve-hover-bg: ${tokens.approveHoverBg}`,
    `--ai-human-feedback-approve-active-bg: ${tokens.approveActiveBg}`,
  ].join('; ');
}

const meta: Meta = {
  title: 'UI/HumanFeedback',
  component: AiHumanFeedbackComponent,
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
    const tokenValues = signal<AiHumanFeedbackTokens>(HUMAN_FEEDBACK_TOKEN_DEFAULTS);
    const tokenStyles = computed(() => buildHumanFeedbackTokenStyles(tokenValues()));
    const eventLog = signal<readonly string[]>([]);

    const appendEvent = (entry: string): void => {
      eventLog.update((existing) => [entry, ...existing].slice(0, 8));
    };

    return {
      props: {
        tokenControls: HUMAN_FEEDBACK_TOKEN_CONTROLS,
        tokenValues,
        tokenStyles,
        eventLog,
        basicUsageSnippet: BASIC_USAGE_SNIPPET,
        tokenUsageSnippet: TOKEN_USAGE_SNIPPET,
        onConfirmed: () => {
          appendEvent('confirmed');
        },
        onRejected: () => {
          appendEvent('rejected');
        },
        onTokenInputEvent: (key: keyof AiHumanFeedbackTokens, event: Event): void => {
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
          .ai-human-feedback-docs {
            display: grid;
            gap: 1rem;
            color: #0f172a;
          }

          .ai-human-feedback-docs__section {
            border: 1px solid #cbd5e1;
            border-radius: 14px;
            padding: 1rem;
            background: #ffffff;
          }

          .ai-human-feedback-docs__title {
            margin: 0 0 0.5rem;
            font-size: 1.12rem;
          }

          .ai-human-feedback-docs__lead {
            margin: 0;
            color: #334155;
            line-height: 1.5;
          }

          .ai-human-feedback-docs__demo-grid {
            margin-top: 0.875rem;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
            gap: 0.875rem;
          }

          .ai-human-feedback-docs__demo {
            border: 1px dashed #cbd5e1;
            border-radius: 10px;
            padding: 0.75rem;
            background: #f8fafc;
          }

          .ai-human-feedback-docs__demo-title {
            margin: 0 0 0.5rem;
            font-size: 0.9rem;
            color: #334155;
          }

          .ai-human-feedback-docs__event-log {
            margin: 0;
            padding-left: 1.125rem;
            color: #1e293b;
            font: 500 0.8rem/1.4 'Menlo', 'Monaco', monospace;
          }

          .ai-human-feedback-docs__event-empty {
            margin: 0;
            color: #475569;
            font-size: 0.9rem;
          }

          .ai-human-feedback-docs__table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 0.75rem;
          }

          .ai-human-feedback-docs__table th,
          .ai-human-feedback-docs__table td {
            border: 1px solid #d1d5db;
            padding: 0.625rem;
            text-align: left;
            vertical-align: top;
            font-size: 0.9rem;
          }

          .ai-human-feedback-docs__table thead {
            background: #f8fafc;
          }

          .ai-human-feedback-docs__code {
            margin: 0.65rem 0 0;
            border-radius: 10px;
            padding: 0.75rem;
            background: #0f172a;
            color: #e2e8f0;
            font: 500 0.78rem/1.45 'Menlo', 'Monaco', monospace;
            overflow-x: auto;
          }

          .ai-human-feedback-docs__tokens-layout {
            display: grid;
            grid-template-columns: minmax(320px, 1fr) minmax(280px, 1fr);
            gap: 1rem;
            align-items: start;
          }

          .ai-human-feedback-docs__token-fieldset {
            margin: 0;
            border: 0;
            padding: 0;
          }

          .ai-human-feedback-docs__token-grid {
            display: grid;
            gap: 0.625rem;
            max-height: 560px;
            overflow: auto;
            padding-right: 0.2rem;
          }

          .ai-human-feedback-docs__token-row {
            display: grid;
            gap: 0.35rem;
          }

          .ai-human-feedback-docs__token-label {
            display: flex;
            justify-content: space-between;
            gap: 0.5rem;
            font-size: 0.88rem;
            font-weight: 600;
          }

          .ai-human-feedback-docs__token-label code {
            padding: 0.125rem 0.375rem;
            border-radius: 6px;
            background: #f1f5f9;
            font-size: 0.75rem;
          }

          .ai-human-feedback-docs__token-input {
            min-height: 2.1rem;
            width: 100%;
            border: 1px solid #94a3b8;
            border-radius: 8px;
            background: #ffffff;
            color: #0f172a;
            padding: 0.45rem 0.6rem;
          }

          .ai-human-feedback-docs__token-input[type='color'] {
            padding: 0.2rem;
          }

          .ai-human-feedback-docs__token-input:focus-visible {
            outline: 2px solid #1d4ed8;
            outline-offset: 2px;
          }

          .ai-human-feedback-docs__token-default {
            margin: 0;
            color: #475569;
            font-size: 0.78rem;
          }

          .ai-human-feedback-docs__token-preview {
            border: 1px dashed #cbd5e1;
            border-radius: 10px;
            background: #f8fafc;
            padding: 0.75rem;
          }

          @media (max-width: 920px) {
            .ai-human-feedback-docs__tokens-layout {
              grid-template-columns: 1fr;
            }

            .ai-human-feedback-docs__token-grid {
              max-height: none;
            }
          }
        </style>

        <article class="ai-human-feedback-docs" aria-label="AiHumanFeedbackComponent single-page documentation">
          <section class="ai-human-feedback-docs__section" aria-labelledby="ai-human-feedback-intro">
            <h2 id="ai-human-feedback-intro" class="ai-human-feedback-docs__title">AiHumanFeedbackComponent</h2>
            <pre class="ai-human-feedback-docs__code"><code>import &#123;AiHumanFeedbackComponent&#125; from '@ai-cdk/ui';</code></pre>
            <p class="ai-human-feedback-docs__lead">
              AiHumanFeedbackComponent captures explicit user approval or rejection with accessible button
              semantics and token-driven styling.
            </p>
          </section>

          <section class="ai-human-feedback-docs__section" aria-labelledby="ai-human-feedback-functional">
            <h2 id="ai-human-feedback-functional" class="ai-human-feedback-docs__title">Functional API showcase</h2>
            <p class="ai-human-feedback-docs__lead">Default and long-prompt variants with output event tracking.</p>

            <div class="ai-human-feedback-docs__demo-grid">
              <div class="ai-human-feedback-docs__demo">
                <h3 class="ai-human-feedback-docs__demo-title">Default variant</h3>
                <ai-human-feedback
                  [text]="'The agent is ready to continue. Should it proceed with this action?'"
                  [approveButtonText]="'Yes, proceed'"
                  [cancelButtonText]="'No, cancel'"
                  (confirmed)="onConfirmed()"
                  (rejected)="onRejected()"
                ></ai-human-feedback>
              </div>

              <div class="ai-human-feedback-docs__demo">
                <h3 class="ai-human-feedback-docs__demo-title">Long prompt + custom buttons</h3>
                <ai-human-feedback
                  style="
                  --ai-human-feedback-button-padding:10px;
                  --ai-human-feedback-button-flex:0 0 auto;
                  --ai-human-feedback-approve-height:auto;
                  --ai-human-feedback-cancel-button-border:0;
                  --ai-human-feedback-approve-button-border:0;
                  --ai-human-feedback-cancel-height:30px;
                  --ai-human-feedback-button-font-weight:300;
                  "
                  [text]="'The agent will apply changes to your project files and run verification checks. Confirm only if you want to continue now.'"
                  [approveButtonText]="'Approve changes'"
                  [cancelButtonText]="'Reject for now'"
                  (confirmed)="onConfirmed()"
                  (rejected)="onRejected()"
                ></ai-human-feedback>
              </div>
            </div>

            <h3 class="ai-human-feedback-docs__title">Event log</h3>
            @if (eventLog().length === 0) {
              <p class="ai-human-feedback-docs__event-empty">No events yet. Click any action button to inspect outputs.</p>
            } @else {
              <ol class="ai-human-feedback-docs__event-log">
                @for (entry of eventLog(); track entry) {
                  <li>{{ entry }}</li>
                }
              </ol>
            }
          </section>

          <section class="ai-human-feedback-docs__section" aria-labelledby="ai-human-feedback-reference">
            <h2 id="ai-human-feedback-reference" class="ai-human-feedback-docs__title">Technical reference</h2>
            <table class="ai-human-feedback-docs__table">
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
                  <td><code>text</code></td>
                  <td><code>string</code></td>
                  <td><code>'Should I proceed?'</code></td>
                  <td>Primary prompt presented to the user.</td>
                </tr>
                <tr>
                  <td>Input</td>
                  <td><code>approveButtonText</code></td>
                  <td><code>string</code></td>
                  <td><code>'Confirm'</code></td>
                  <td>Label for the confirm action button.</td>
                </tr>
                <tr>
                  <td>Input</td>
                  <td><code>cancelButtonText</code></td>
                  <td><code>string</code></td>
                  <td><code>'Reject'</code></td>
                  <td>Label for the reject action button.</td>
                </tr>
                <tr>
                  <td>Output</td>
                  <td><code>confirmed</code></td>
                  <td><code>void</code></td>
                  <td>n/a</td>
                  <td>Emits when the confirm button is clicked.</td>
                </tr>
                <tr>
                  <td>Output</td>
                  <td><code>rejected</code></td>
                  <td><code>void</code></td>
                  <td>n/a</td>
                  <td>Emits when the reject button is clicked.</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section class="ai-human-feedback-docs__section" aria-labelledby="ai-human-feedback-snippets">
            <h2 id="ai-human-feedback-snippets" class="ai-human-feedback-docs__title">Usage snippets</h2>
            <pre class="ai-human-feedback-docs__code">{{ basicUsageSnippet }}</pre>
            <pre class="ai-human-feedback-docs__code">{{ tokenUsageSnippet }}</pre>
          </section>

          <section class="ai-human-feedback-docs__section" aria-labelledby="ai-human-feedback-tokens">
            <h2 id="ai-human-feedback-tokens" class="ai-human-feedback-docs__title">Style tokens playground</h2>
            <div class="ai-human-feedback-docs__tokens-layout">
              <fieldset class="ai-human-feedback-docs__token-fieldset">
                <legend>Live token editor</legend>
                <div class="ai-human-feedback-docs__token-grid">
                  @for (token of tokenControls; track token.key) {
                    <div class="ai-human-feedback-docs__token-row">
                      <label class="ai-human-feedback-docs__token-label" [attr.for]="'ai-human-feedback-token-' + token.key">
                        <span>{{ token.label }}</span>
                        <code>{{ token.cssVar }}</code>
                      </label>
                      <input
                        class="ai-human-feedback-docs__token-input"
                        [id]="'ai-human-feedback-token-' + token.key"
                        [type]="token.inputType"
                        [value]="tokenValues()[token.key]"
                        (input)="onTokenInputEvent(token.key, $event)"
                      />
                      <p class="ai-human-feedback-docs__token-default">Default: <code>{{ token.defaultValue }}</code></p>
                    </div>
                  }
                </div>
              </fieldset>

              <div class="ai-human-feedback-docs__token-preview">
                <ai-human-feedback
                  [style]="tokenStyles()"
                  [text]="'Should the agent execute this pending step?'"
                  [approveButtonText]="'Confirm'"
                  [cancelButtonText]="'Reject'"
                  (confirmed)="onConfirmed()"
                  (rejected)="onRejected()"
                ></ai-human-feedback>
              </div>
            </div>
          </section>
        </article>
      `,
    };
  },
};
