import { computed, signal } from '@angular/core';
import { AiSidebarComponent } from '@ai-cdk/chat/SideBar';
import type { Meta, StoryObj } from '@storybook/angular';

interface AiSidebarTokens {
  readonly sidebarWidth: string;
  readonly sidebarBg: string;
  readonly sidebarBorderLeft: string;
  readonly sidebarShadow: string;
  readonly sidebarZIndex: string;
  readonly sidebarTopbarBg: string;
  readonly sidebarTopbarBorder: string;
  readonly sidebarTopbarPadding: string;
  readonly sidebarIconColor: string;
  readonly sidebarIconHoverColor: string;
  readonly sidebarContentPadding: string;
  readonly sidebarContentGap: string;
  readonly sidebarUserBubbleBg: string;
  readonly sidebarUserBubbleColor: string;
  readonly sidebarUserBubbleRadius: string;
  readonly sidebarAiBubbleBg: string;
  readonly sidebarAiBubbleColor: string;
  readonly sidebarAiBubbleRadius: string;
  readonly sidebarBubblePadding: string;
  readonly sidebarBubbleFontSize: string;
  readonly sidebarInputBarBg: string;
  readonly sidebarInputBarBorder: string;
  readonly sidebarInputBarPadding: string;
  readonly sidebarInputBg: string;
  readonly sidebarInputBorder: string;
  readonly sidebarInputBorderRadius: string;
  readonly sidebarInputColor: string;
  readonly sidebarInputPadding: string;
  readonly sidebarSendIconColor: string;
  readonly sidebarSendIconDisabled: string;
}

interface AiSidebarTokenControl {
  readonly key: keyof AiSidebarTokens;
  readonly cssVar: string;
  readonly label: string;
  readonly inputType: 'color' | 'text';
  readonly defaultValue: string;
}

const SIDEBAR_TOKEN_DEFAULTS: AiSidebarTokens = {
  sidebarWidth: '400px',
  sidebarBg: '#ffffff',
  sidebarBorderLeft: '1px solid #e5e7eb',
  sidebarShadow: '-4px 0 16px rgba(0, 0, 0, 0.08)',
  sidebarZIndex: '1000',
  sidebarTopbarBg: '#f9fafb',
  sidebarTopbarBorder: '1px solid #e5e7eb',
  sidebarTopbarPadding: '0.75rem 1rem',
  sidebarIconColor: '#6b7280',
  sidebarIconHoverColor: '#111827',
  sidebarContentPadding: '1rem',
  sidebarContentGap: '0.75rem',
  sidebarUserBubbleBg: '#3b82f6',
  sidebarUserBubbleColor: '#ffffff',
  sidebarUserBubbleRadius: '18px 18px 4px 18px',
  sidebarAiBubbleBg: '#f3f4f6',
  sidebarAiBubbleColor: '#111827',
  sidebarAiBubbleRadius: '18px 18px 18px 4px',
  sidebarBubblePadding: '0.6rem 0.9rem',
  sidebarBubbleFontSize: '0.875rem',
  sidebarInputBarBg: '#ffffff',
  sidebarInputBarBorder: '1px solid #e5e7eb',
  sidebarInputBarPadding: '0.75rem 1rem',
  sidebarInputBg: '#f9fafb',
  sidebarInputBorder: '1px solid #d1d5db',
  sidebarInputBorderRadius: '20px',
  sidebarInputColor: '#111827',
  sidebarInputPadding: '0.5rem 1rem',
  sidebarSendIconColor: '#3b82f6',
  sidebarSendIconDisabled: '#9ca3af',
};

const SIDEBAR_TOKEN_CONTROLS: readonly AiSidebarTokenControl[] = [
  {
    key: 'sidebarWidth',
    cssVar: '--ai-sidebar-width',
    label: 'Width',
    inputType: 'text',
    defaultValue: SIDEBAR_TOKEN_DEFAULTS.sidebarWidth,
  },
  {
    key: 'sidebarBg',
    cssVar: '--ai-sidebar-bg',
    label: 'Background',
    inputType: 'color',
    defaultValue: SIDEBAR_TOKEN_DEFAULTS.sidebarBg,
  },
  {
    key: 'sidebarBorderLeft',
    cssVar: '--ai-sidebar-border-left',
    label: 'Border left',
    inputType: 'text',
    defaultValue: SIDEBAR_TOKEN_DEFAULTS.sidebarBorderLeft,
  },
  {
    key: 'sidebarShadow',
    cssVar: '--ai-sidebar-shadow',
    label: 'Shadow',
    inputType: 'text',
    defaultValue: SIDEBAR_TOKEN_DEFAULTS.sidebarShadow,
  },
  {
    key: 'sidebarZIndex',
    cssVar: '--ai-sidebar-z-index',
    label: 'Z-index',
    inputType: 'text',
    defaultValue: SIDEBAR_TOKEN_DEFAULTS.sidebarZIndex,
  },
  {
    key: 'sidebarTopbarBg',
    cssVar: '--ai-sidebar-topbar-bg',
    label: 'Topbar background',
    inputType: 'color',
    defaultValue: SIDEBAR_TOKEN_DEFAULTS.sidebarTopbarBg,
  },
  {
    key: 'sidebarTopbarBorder',
    cssVar: '--ai-sidebar-topbar-border',
    label: 'Topbar border',
    inputType: 'text',
    defaultValue: SIDEBAR_TOKEN_DEFAULTS.sidebarTopbarBorder,
  },
  {
    key: 'sidebarTopbarPadding',
    cssVar: '--ai-sidebar-topbar-padding',
    label: 'Topbar padding',
    inputType: 'text',
    defaultValue: SIDEBAR_TOKEN_DEFAULTS.sidebarTopbarPadding,
  },
  {
    key: 'sidebarIconColor',
    cssVar: '--ai-sidebar-icon-color',
    label: 'Icon color',
    inputType: 'color',
    defaultValue: SIDEBAR_TOKEN_DEFAULTS.sidebarIconColor,
  },
  {
    key: 'sidebarIconHoverColor',
    cssVar: '--ai-sidebar-icon-hover-color',
    label: 'Icon hover color',
    inputType: 'color',
    defaultValue: SIDEBAR_TOKEN_DEFAULTS.sidebarIconHoverColor,
  },
  {
    key: 'sidebarContentPadding',
    cssVar: '--ai-sidebar-content-padding',
    label: 'Content padding',
    inputType: 'text',
    defaultValue: SIDEBAR_TOKEN_DEFAULTS.sidebarContentPadding,
  },
  {
    key: 'sidebarContentGap',
    cssVar: '--ai-sidebar-content-gap',
    label: 'Content gap',
    inputType: 'text',
    defaultValue: SIDEBAR_TOKEN_DEFAULTS.sidebarContentGap,
  },
  {
    key: 'sidebarUserBubbleBg',
    cssVar: '--ai-sidebar-user-bubble-bg',
    label: 'User bubble background',
    inputType: 'color',
    defaultValue: SIDEBAR_TOKEN_DEFAULTS.sidebarUserBubbleBg,
  },
  {
    key: 'sidebarUserBubbleColor',
    cssVar: '--ai-sidebar-user-bubble-color',
    label: 'User bubble color',
    inputType: 'color',
    defaultValue: SIDEBAR_TOKEN_DEFAULTS.sidebarUserBubbleColor,
  },
  {
    key: 'sidebarUserBubbleRadius',
    cssVar: '--ai-sidebar-user-bubble-radius',
    label: 'User bubble radius',
    inputType: 'text',
    defaultValue: SIDEBAR_TOKEN_DEFAULTS.sidebarUserBubbleRadius,
  },
  {
    key: 'sidebarAiBubbleBg',
    cssVar: '--ai-sidebar-ai-bubble-bg',
    label: 'AI bubble background',
    inputType: 'color',
    defaultValue: SIDEBAR_TOKEN_DEFAULTS.sidebarAiBubbleBg,
  },
  {
    key: 'sidebarAiBubbleColor',
    cssVar: '--ai-sidebar-ai-bubble-color',
    label: 'AI bubble color',
    inputType: 'color',
    defaultValue: SIDEBAR_TOKEN_DEFAULTS.sidebarAiBubbleColor,
  },
  {
    key: 'sidebarAiBubbleRadius',
    cssVar: '--ai-sidebar-ai-bubble-radius',
    label: 'AI bubble radius',
    inputType: 'text',
    defaultValue: SIDEBAR_TOKEN_DEFAULTS.sidebarAiBubbleRadius,
  },
  {
    key: 'sidebarBubblePadding',
    cssVar: '--ai-sidebar-bubble-padding',
    label: 'Bubble padding',
    inputType: 'text',
    defaultValue: SIDEBAR_TOKEN_DEFAULTS.sidebarBubblePadding,
  },
  {
    key: 'sidebarBubbleFontSize',
    cssVar: '--ai-sidebar-bubble-font-size',
    label: 'Bubble font size',
    inputType: 'text',
    defaultValue: SIDEBAR_TOKEN_DEFAULTS.sidebarBubbleFontSize,
  },
  {
    key: 'sidebarInputBarBg',
    cssVar: '--ai-sidebar-input-bar-bg',
    label: 'Input bar background',
    inputType: 'color',
    defaultValue: SIDEBAR_TOKEN_DEFAULTS.sidebarInputBarBg,
  },
  {
    key: 'sidebarInputBarBorder',
    cssVar: '--ai-sidebar-input-bar-border',
    label: 'Input bar border',
    inputType: 'text',
    defaultValue: SIDEBAR_TOKEN_DEFAULTS.sidebarInputBarBorder,
  },
  {
    key: 'sidebarInputBarPadding',
    cssVar: '--ai-sidebar-input-bar-padding',
    label: 'Input bar padding',
    inputType: 'text',
    defaultValue: SIDEBAR_TOKEN_DEFAULTS.sidebarInputBarPadding,
  },
  {
    key: 'sidebarInputBg',
    cssVar: '--ai-sidebar-input-bg',
    label: 'Input background',
    inputType: 'color',
    defaultValue: SIDEBAR_TOKEN_DEFAULTS.sidebarInputBg,
  },
  {
    key: 'sidebarInputBorder',
    cssVar: '--ai-sidebar-input-border',
    label: 'Input border',
    inputType: 'text',
    defaultValue: SIDEBAR_TOKEN_DEFAULTS.sidebarInputBorder,
  },
  {
    key: 'sidebarInputBorderRadius',
    cssVar: '--ai-sidebar-input-border-radius',
    label: 'Input border radius',
    inputType: 'text',
    defaultValue: SIDEBAR_TOKEN_DEFAULTS.sidebarInputBorderRadius,
  },
  {
    key: 'sidebarInputColor',
    cssVar: '--ai-sidebar-input-color',
    label: 'Input text color',
    inputType: 'color',
    defaultValue: SIDEBAR_TOKEN_DEFAULTS.sidebarInputColor,
  },
  {
    key: 'sidebarInputPadding',
    cssVar: '--ai-sidebar-input-padding',
    label: 'Input padding',
    inputType: 'text',
    defaultValue: SIDEBAR_TOKEN_DEFAULTS.sidebarInputPadding,
  },
  {
    key: 'sidebarSendIconColor',
    cssVar: '--ai-sidebar-send-icon-color',
    label: 'Send icon color',
    inputType: 'color',
    defaultValue: SIDEBAR_TOKEN_DEFAULTS.sidebarSendIconColor,
  },
  {
    key: 'sidebarSendIconDisabled',
    cssVar: '--ai-sidebar-send-icon-disabled',
    label: 'Send icon disabled color',
    inputType: 'color',
    defaultValue: SIDEBAR_TOKEN_DEFAULTS.sidebarSendIconDisabled,
  },
];

const BASIC_USAGE_SNIPPET = `<ai-sidebar
  [path]="'/api/sse'"
  [placeholder]="'Type a message...'"
  [disabled]="false"
  (xClicked)="onClose()"
  (clearClicked)="onClear()"
></ai-sidebar>`;

const TOKEN_USAGE_SNIPPET = `<ai-sidebar
  style="--ai-sidebar-bg: #f8fafc; --ai-sidebar-width: 360px;"
  [path]="'/api/sse'"
  [disabled]="true"
></ai-sidebar>`;

function buildSidebarTokenStyles(tokens: AiSidebarTokens): string {
  return [
    `--ai-sidebar-width: ${tokens.sidebarWidth}`,
    `--ai-sidebar-bg: ${tokens.sidebarBg}`,
    `--ai-sidebar-border-left: ${tokens.sidebarBorderLeft}`,
    `--ai-sidebar-shadow: ${tokens.sidebarShadow}`,
    `--ai-sidebar-z-index: ${tokens.sidebarZIndex}`,
    `--ai-sidebar-topbar-bg: ${tokens.sidebarTopbarBg}`,
    `--ai-sidebar-topbar-border: ${tokens.sidebarTopbarBorder}`,
    `--ai-sidebar-topbar-padding: ${tokens.sidebarTopbarPadding}`,
    `--ai-sidebar-icon-color: ${tokens.sidebarIconColor}`,
    `--ai-sidebar-icon-hover-color: ${tokens.sidebarIconHoverColor}`,
    `--ai-sidebar-content-padding: ${tokens.sidebarContentPadding}`,
    `--ai-sidebar-content-gap: ${tokens.sidebarContentGap}`,
    `--ai-sidebar-user-bubble-bg: ${tokens.sidebarUserBubbleBg}`,
    `--ai-sidebar-user-bubble-color: ${tokens.sidebarUserBubbleColor}`,
    `--ai-sidebar-user-bubble-radius: ${tokens.sidebarUserBubbleRadius}`,
    `--ai-sidebar-ai-bubble-bg: ${tokens.sidebarAiBubbleBg}`,
    `--ai-sidebar-ai-bubble-color: ${tokens.sidebarAiBubbleColor}`,
    `--ai-sidebar-ai-bubble-radius: ${tokens.sidebarAiBubbleRadius}`,
    `--ai-sidebar-bubble-padding: ${tokens.sidebarBubblePadding}`,
    `--ai-sidebar-bubble-font-size: ${tokens.sidebarBubbleFontSize}`,
    `--ai-sidebar-input-bar-bg: ${tokens.sidebarInputBarBg}`,
    `--ai-sidebar-input-bar-border: ${tokens.sidebarInputBarBorder}`,
    `--ai-sidebar-input-bar-padding: ${tokens.sidebarInputBarPadding}`,
    `--ai-sidebar-input-bg: ${tokens.sidebarInputBg}`,
    `--ai-sidebar-input-border: ${tokens.sidebarInputBorder}`,
    `--ai-sidebar-input-border-radius: ${tokens.sidebarInputBorderRadius}`,
    `--ai-sidebar-input-color: ${tokens.sidebarInputColor}`,
    `--ai-sidebar-input-padding: ${tokens.sidebarInputPadding}`,
    `--ai-sidebar-send-icon-color: ${tokens.sidebarSendIconColor}`,
    `--ai-sidebar-send-icon-disabled: ${tokens.sidebarSendIconDisabled}`,
  ].join('; ');
}

const meta: Meta = {
  title: 'Chat/SideBar',
  component: AiSidebarComponent,
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
    const tokenValues = signal<AiSidebarTokens>(SIDEBAR_TOKEN_DEFAULTS);
    const tokenStyles = computed(() => buildSidebarTokenStyles(tokenValues()));
    const previewStyles = computed(() => `height: 28rem; ${tokenStyles()}`);
    const eventLog = signal<readonly string[]>([]);

    const appendEvent = (entry: string): void => {
      eventLog.update((existing) => [entry, ...existing].slice(0, 8));
    };

    return {
      props: {
        tokenControls: SIDEBAR_TOKEN_CONTROLS,
        tokenValues,
        tokenStyles,
        previewStyles,
        eventLog,
        basicUsageSnippet: BASIC_USAGE_SNIPPET,
        tokenUsageSnippet: TOKEN_USAGE_SNIPPET,
        onXClicked: () => {
          appendEvent('xClicked');
        },
        onClearClicked: () => {
          appendEvent('clearClicked');
        },
        onTokenInputEvent: (key: keyof AiSidebarTokens, event: Event): void => {
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
          .ai-sidebar-docs {
            display: grid;
            gap: 1rem;
            color: #0f172a;
          }

          .ai-sidebar-docs__section {
            border: 1px solid #cbd5e1;
            border-radius: 14px;
            padding: 1rem;
            background: #ffffff;
          }

          .ai-sidebar-docs__title {
            margin: 0 0 0.5rem;
            font-size: 1.12rem;
          }

          .ai-sidebar-docs__lead {
            margin: 0;
            color: #334155;
            line-height: 1.5;
          }

          .ai-sidebar-docs__demo-grid {
            margin-top: 0.875rem;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 0.875rem;
          }

          .ai-sidebar-docs__demo {
            border: 1px dashed #cbd5e1;
            border-radius: 10px;
            padding: 0.75rem;
            background: #f8fafc;
            overflow: hidden;
          }

          .ai-sidebar-docs__demo-title {
            margin: 0 0 0.5rem;
            font-size: 0.9rem;
            color: #334155;
          }

          .ai-sidebar-docs__event-log {
            margin: 0;
            padding-left: 1.125rem;
            color: #1e293b;
            font: 500 0.8rem/1.4 'Menlo', 'Monaco', monospace;
          }

          .ai-sidebar-docs__event-empty {
            margin: 0;
            color: #475569;
            font-size: 0.9rem;
          }

          .ai-sidebar-docs__table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 0.75rem;
          }

          .ai-sidebar-docs__table th,
          .ai-sidebar-docs__table td {
            border: 1px solid #d1d5db;
            padding: 0.625rem;
            text-align: left;
            vertical-align: top;
            font-size: 0.9rem;
          }

          .ai-sidebar-docs__table thead {
            background: #f8fafc;
          }

          .ai-sidebar-docs__code {
            margin: 0.65rem 0 0;
            border-radius: 10px;
            padding: 0.75rem;
            background: #0f172a;
            color: #e2e8f0;
            font: 500 0.78rem/1.45 'Menlo', 'Monaco', monospace;
            overflow-x: auto;
          }

          .ai-sidebar-docs__tokens-layout {
            display: grid;
            grid-template-columns: minmax(320px, 1fr) minmax(320px, 1fr);
            gap: 1rem;
            align-items: start;
          }

          .ai-sidebar-docs__token-fieldset {
            margin: 0;
            border: 0;
            padding: 0;
          }

          .ai-sidebar-docs__token-grid {
            display: grid;
            gap: 0.625rem;
            max-height: 560px;
            overflow: auto;
            padding-right: 0.2rem;
          }

          .ai-sidebar-docs__token-row {
            display: grid;
            gap: 0.35rem;
          }

          .ai-sidebar-docs__token-label {
            display: flex;
            justify-content: space-between;
            gap: 0.5rem;
            font-size: 0.88rem;
            font-weight: 600;
          }

          .ai-sidebar-docs__token-label code {
            padding: 0.125rem 0.375rem;
            border-radius: 6px;
            background: #f1f5f9;
            font-size: 0.75rem;
          }

          .ai-sidebar-docs__token-input {
            min-height: 2.1rem;
            width: 100%;
            border: 1px solid #94a3b8;
            border-radius: 8px;
            background: #ffffff;
            color: #0f172a;
            padding: 0.45rem 0.6rem;
          }

          .ai-sidebar-docs__token-input[type='color'] {
            padding: 0.2rem;
          }

          .ai-sidebar-docs__token-input:focus-visible {
            outline: 2px solid #1d4ed8;
            outline-offset: 2px;
          }

          .ai-sidebar-docs__token-default {
            margin: 0;
            color: #475569;
            font-size: 0.78rem;
          }

          .ai-sidebar-docs__token-preview {
            border: 1px dashed #cbd5e1;
            border-radius: 10px;
            background: #f8fafc;
            padding: 0.75rem;
            overflow: hidden;
          }

          @media (max-width: 1024px) {
            .ai-sidebar-docs__tokens-layout {
              grid-template-columns: 1fr;
            }

            .ai-sidebar-docs__token-grid {
              max-height: none;
            }
          }
        </style>

        <article class="ai-sidebar-docs" aria-label="AiSidebarComponent single-page documentation">
          <section class="ai-sidebar-docs__section" aria-labelledby="ai-sidebar-intro">
            <h2 id="ai-sidebar-intro" class="ai-sidebar-docs__title">AiSidebarComponent</h2>
            <pre class="ai-sidebar-docs__code"><code>import &#123;AiSidebarComponent&#125; from '@ai-cdk/chat';</code></pre>
            <p class="ai-sidebar-docs__lead">
              AiSidebarComponent provides a chat sidebar shell with message history, input bar, and streaming
              response handling through server-sent events.
            </p>
          </section>

          <section class="ai-sidebar-docs__section" aria-labelledby="ai-sidebar-functional">
            <h2 id="ai-sidebar-functional" class="ai-sidebar-docs__title">Functional API showcase</h2>
            <p class="ai-sidebar-docs__lead">Default and disabled states with output event tracking.</p>

            <div class="ai-sidebar-docs__demo-grid">
              <div class="ai-sidebar-docs__demo">
                <h3 class="ai-sidebar-docs__demo-title">Default sidebar</h3>
                <ai-sidebar
                  style="height: 28rem; --ai-sidebar-width: 100%;"
                  [path]="'/api/sse'"
                  [placeholder]="'Type a message...'"
                  [disabled]="false"
                  (xClicked)="onXClicked()"
                  (clearClicked)="onClearClicked()"
                ></ai-sidebar>
              </div>

              <div class="ai-sidebar-docs__demo">
                <h3 class="ai-sidebar-docs__demo-title">Disabled input state</h3>
                <ai-sidebar
                  style="height: 28rem; --ai-sidebar-width: 100%;"
                  [path]="'/api/sse'"
                  [placeholder]="'Temporarily disabled'"
                  [disabled]="true"
                  (xClicked)="onXClicked()"
                  (clearClicked)="onClearClicked()"
                ></ai-sidebar>
              </div>
            </div>

            <h3 class="ai-sidebar-docs__title">Event log</h3>
            @if (eventLog().length === 0) {
              <p class="ai-sidebar-docs__event-empty">No events yet. Click the topbar clear/close buttons to inspect outputs.</p>
            } @else {
              <ol class="ai-sidebar-docs__event-log">
                @for (entry of eventLog(); track entry) {
                  <li>{{ entry }}</li>
                }
              </ol>
            }
          </section>

          <section class="ai-sidebar-docs__section" aria-labelledby="ai-sidebar-reference">
            <h2 id="ai-sidebar-reference" class="ai-sidebar-docs__title">Technical reference</h2>
            <table class="ai-sidebar-docs__table">
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
                  <td><code>path</code></td>
                  <td><code>string</code></td>
                  <td>required</td>
                  <td>Server endpoint path used for SSE streaming.</td>
                </tr>
                <tr>
                  <td>Input</td>
                  <td><code>placeholder</code></td>
                  <td><code>string</code></td>
                  <td><code>'Type a message...'</code></td>
                  <td>Placeholder text displayed in the input field.</td>
                </tr>
                <tr>
                  <td>Input</td>
                  <td><code>disabled</code></td>
                  <td><code>boolean</code></td>
                  <td><code>false</code></td>
                  <td>Disables input and send interactions.</td>
                </tr>
                <tr>
                  <td>Output</td>
                  <td><code>xClicked</code></td>
                  <td><code>void</code></td>
                  <td>n/a</td>
                  <td>Emitted when the close action is triggered.</td>
                </tr>
                <tr>
                  <td>Output</td>
                  <td><code>clearClicked</code></td>
                  <td><code>void</code></td>
                  <td>n/a</td>
                  <td>Emitted after the clear action resets chat state.</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section class="ai-sidebar-docs__section" aria-labelledby="ai-sidebar-snippets">
            <h2 id="ai-sidebar-snippets" class="ai-sidebar-docs__title">Usage snippets</h2>
            <pre class="ai-sidebar-docs__code">{{ basicUsageSnippet }}</pre>
            <pre class="ai-sidebar-docs__code">{{ tokenUsageSnippet }}</pre>
          </section>

          <section class="ai-sidebar-docs__section" aria-labelledby="ai-sidebar-tokens">
            <h2 id="ai-sidebar-tokens" class="ai-sidebar-docs__title">Style tokens playground</h2>
            <div class="ai-sidebar-docs__tokens-layout">
              <fieldset class="ai-sidebar-docs__token-fieldset">
                <legend>Live token editor</legend>
                <div class="ai-sidebar-docs__token-grid">
                  @for (token of tokenControls; track token.key) {
                    <div class="ai-sidebar-docs__token-row">
                      <label class="ai-sidebar-docs__token-label" [attr.for]="'ai-sidebar-token-' + token.key">
                        <span>{{ token.label }}</span>
                        <code>{{ token.cssVar }}</code>
                      </label>
                      <input
                        class="ai-sidebar-docs__token-input"
                        [id]="'ai-sidebar-token-' + token.key"
                        [type]="token.inputType"
                        [value]="tokenValues()[token.key]"
                        (input)="onTokenInputEvent(token.key, $event)"
                      />
                      <p class="ai-sidebar-docs__token-default">Default: <code>{{ token.defaultValue }}</code></p>
                    </div>
                  }
                </div>
              </fieldset>

              <div class="ai-sidebar-docs__token-preview">
                <ai-sidebar
                  [style]="previewStyles()"
                  [path]="'/api/sse'"
                  [placeholder]="'Type a message...'"
                  [disabled]="true"
                  (xClicked)="onXClicked()"
                  (clearClicked)="onClearClicked()"
                ></ai-sidebar>
              </div>
            </div>
          </section>
        </article>
      `,
    };
  },
};
