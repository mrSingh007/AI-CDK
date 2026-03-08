import { computed, signal } from '@angular/core';
import {
  AiChatTextInputComponent,
  type AiChatTextInputSubmitPayload,
} from '@ai-cdk/ui/ChatTextInput';
import type { Meta, StoryObj } from '@storybook/angular';

interface AiChatTextInputTokens {
  readonly containerBg: string;
  readonly containerBorder: string;
  readonly containerRadius: string;
  readonly containerPadding: string;
  readonly containerGap: string;
  readonly textareaBg: string;
  readonly textareaBorder: string;
  readonly textareaRadius: string;
  readonly textareaColor: string;
  readonly textareaPlaceholder: string;
  readonly textareaPadding: string;
  readonly textareaMinHeight: string;
  readonly textareaFontSize: string;
  readonly controlsGap: string;
  readonly uploadBg: string;
  readonly uploadBorder: string;
  readonly uploadColor: string;
  readonly uploadHoverBg: string;
  readonly uploadSize: string;
  readonly sendBg: string;
  readonly sendColor: string;
  readonly sendActiveBg: string;
  readonly sendActiveColor: string;
  readonly sendDisabledBg: string;
  readonly sendDisabledColor: string;
  readonly sendSize: string;
  readonly filesColor: string;
  readonly filesSize: string;
  readonly focusColor: string;
  readonly focusShadow: string;
}

interface AiChatTextInputTokenControl {
  readonly key: keyof AiChatTextInputTokens;
  readonly cssVar: string;
  readonly label: string;
  readonly inputType: 'color' | 'text';
  readonly defaultValue: string;
}

const TOKEN_DEFAULTS: AiChatTextInputTokens = {
  containerBg: '#ffffff',
  containerBorder: '1px solid #d1d5db',
  containerRadius: '20px',
  containerPadding: '0.95rem 1rem',
  containerGap: '0.75rem',
  textareaBg: 'transparent',
  textareaBorder: 'none',
  textareaRadius: '12px',
  textareaColor: '#111827',
  textareaPlaceholder: '#6b7280',
  textareaPadding: '0',
  textareaMinHeight: '5.25rem',
  textareaFontSize: '1rem',
  controlsGap: '0.65rem',
  uploadBg: '#ffffff',
  uploadBorder: '1px solid #d1d5db',
  uploadColor: '#111827',
  uploadHoverBg: '#f9fafb',
  uploadSize: '2.25rem',
  sendBg: '#f3f4f6',
  sendColor: '#62757e',
  sendActiveBg: '#c1c4ffff',
  sendActiveColor: '#62757e',
  sendDisabledBg: '#e5e7eb',
  sendDisabledColor: '#9ca3af',
  sendSize: '3rem',
  filesColor: '#374151',
  filesSize: '0.8rem',
  focusColor: '#60a5fa',
  focusShadow: '0 0 0 3px rgba(96, 165, 250, 0.35)',
};

const TOKEN_CONTROLS: readonly AiChatTextInputTokenControl[] = [
  {
    key: 'containerBg',
    cssVar: '--ai-chat-text-input-bg',
    label: 'Container background',
    inputType: 'color',
    defaultValue: TOKEN_DEFAULTS.containerBg,
  },
  {
    key: 'containerBorder',
    cssVar: '--ai-chat-text-input-border',
    label: 'Container border',
    inputType: 'text',
    defaultValue: TOKEN_DEFAULTS.containerBorder,
  },
  {
    key: 'containerRadius',
    cssVar: '--ai-chat-text-input-radius',
    label: 'Container radius',
    inputType: 'text',
    defaultValue: TOKEN_DEFAULTS.containerRadius,
  },
  {
    key: 'containerPadding',
    cssVar: '--ai-chat-text-input-padding',
    label: 'Container padding',
    inputType: 'text',
    defaultValue: TOKEN_DEFAULTS.containerPadding,
  },
  {
    key: 'containerGap',
    cssVar: '--ai-chat-text-input-gap',
    label: 'Container gap',
    inputType: 'text',
    defaultValue: TOKEN_DEFAULTS.containerGap,
  },
  {
    key: 'textareaBg',
    cssVar: '--ai-chat-text-input-textarea-bg',
    label: 'Textarea background',
    inputType: 'color',
    defaultValue: TOKEN_DEFAULTS.textareaBg,
  },
  {
    key: 'textareaBorder',
    cssVar: '--ai-chat-text-input-textarea-border',
    label: 'Textarea border',
    inputType: 'text',
    defaultValue: TOKEN_DEFAULTS.textareaBorder,
  },
  {
    key: 'textareaRadius',
    cssVar: '--ai-chat-text-input-textarea-radius',
    label: 'Textarea radius',
    inputType: 'text',
    defaultValue: TOKEN_DEFAULTS.textareaRadius,
  },
  {
    key: 'textareaColor',
    cssVar: '--ai-chat-text-input-textarea-color',
    label: 'Textarea color',
    inputType: 'color',
    defaultValue: TOKEN_DEFAULTS.textareaColor,
  },
  {
    key: 'textareaPlaceholder',
    cssVar: '--ai-chat-text-input-textarea-placeholder',
    label: 'Placeholder color',
    inputType: 'color',
    defaultValue: TOKEN_DEFAULTS.textareaPlaceholder,
  },
  {
    key: 'textareaPadding',
    cssVar: '--ai-chat-text-input-textarea-padding',
    label: 'Textarea padding',
    inputType: 'text',
    defaultValue: TOKEN_DEFAULTS.textareaPadding,
  },
  {
    key: 'textareaMinHeight',
    cssVar: '--ai-chat-text-input-textarea-min-height',
    label: 'Textarea min height',
    inputType: 'text',
    defaultValue: TOKEN_DEFAULTS.textareaMinHeight,
  },
  {
    key: 'textareaFontSize',
    cssVar: '--ai-chat-text-input-textarea-font-size',
    label: 'Textarea font size',
    inputType: 'text',
    defaultValue: TOKEN_DEFAULTS.textareaFontSize,
  },
  {
    key: 'controlsGap',
    cssVar: '--ai-chat-text-input-controls-gap',
    label: 'Controls gap',
    inputType: 'text',
    defaultValue: TOKEN_DEFAULTS.controlsGap,
  },
  {
    key: 'uploadBg',
    cssVar: '--ai-chat-text-input-upload-bg',
    label: 'Upload background',
    inputType: 'color',
    defaultValue: TOKEN_DEFAULTS.uploadBg,
  },
  {
    key: 'uploadBorder',
    cssVar: '--ai-chat-text-input-upload-border',
    label: 'Upload border',
    inputType: 'text',
    defaultValue: TOKEN_DEFAULTS.uploadBorder,
  },
  {
    key: 'uploadColor',
    cssVar: '--ai-chat-text-input-upload-color',
    label: 'Upload color',
    inputType: 'color',
    defaultValue: TOKEN_DEFAULTS.uploadColor,
  },
  {
    key: 'uploadHoverBg',
    cssVar: '--ai-chat-text-input-upload-hover-bg',
    label: 'Upload hover background',
    inputType: 'color',
    defaultValue: TOKEN_DEFAULTS.uploadHoverBg,
  },
  {
    key: 'uploadSize',
    cssVar: '--ai-chat-text-input-upload-size',
    label: 'Upload button size',
    inputType: 'text',
    defaultValue: TOKEN_DEFAULTS.uploadSize,
  },
  {
    key: 'sendBg',
    cssVar: '--ai-chat-text-input-send-bg',
    label: 'Send background',
    inputType: 'color',
    defaultValue: TOKEN_DEFAULTS.sendBg,
  },
  {
    key: 'sendColor',
    cssVar: '--ai-chat-text-input-send-color',
    label: 'Send color',
    inputType: 'color',
    defaultValue: TOKEN_DEFAULTS.sendColor,
  },
  {
    key: 'sendActiveBg',
    cssVar: '--ai-chat-text-input-send-active-bg',
    label: 'Send active background',
    inputType: 'color',
    defaultValue: TOKEN_DEFAULTS.sendActiveBg,
  },
  {
    key: 'sendActiveColor',
    cssVar: '--ai-chat-text-input-send-active-color',
    label: 'Send active color',
    inputType: 'color',
    defaultValue: TOKEN_DEFAULTS.sendActiveColor,
  },
  {
    key: 'sendDisabledBg',
    cssVar: '--ai-chat-text-input-send-disabled-bg',
    label: 'Send disabled background',
    inputType: 'color',
    defaultValue: TOKEN_DEFAULTS.sendDisabledBg,
  },
  {
    key: 'sendDisabledColor',
    cssVar: '--ai-chat-text-input-send-disabled-color',
    label: 'Send disabled color',
    inputType: 'color',
    defaultValue: TOKEN_DEFAULTS.sendDisabledColor,
  },
  {
    key: 'sendSize',
    cssVar: '--ai-chat-text-input-send-size',
    label: 'Send button size',
    inputType: 'text',
    defaultValue: TOKEN_DEFAULTS.sendSize,
  },
  {
    key: 'filesColor',
    cssVar: '--ai-chat-text-input-files-color',
    label: 'Files label color',
    inputType: 'color',
    defaultValue: TOKEN_DEFAULTS.filesColor,
  },
  {
    key: 'filesSize',
    cssVar: '--ai-chat-text-input-files-size',
    label: 'Files label size',
    inputType: 'text',
    defaultValue: TOKEN_DEFAULTS.filesSize,
  },
  {
    key: 'focusColor',
    cssVar: '--ai-chat-text-input-focus-color',
    label: 'Focus ring color',
    inputType: 'color',
    defaultValue: TOKEN_DEFAULTS.focusColor,
  },
  {
    key: 'focusShadow',
    cssVar: '--ai-chat-text-input-focus-shadow',
    label: 'Focus shadow',
    inputType: 'text',
    defaultValue: TOKEN_DEFAULTS.focusShadow,
  },
];

const BASIC_USAGE_SNIPPET = `<ai-chat-text-input
  [placeholder]="'Type a message...'"
  (submitted)="onSubmitted($event)"
></ai-chat-text-input>`;

const UPLOAD_USAGE_SNIPPET = `<ai-chat-text-input
  [acceptFileFormats]="['.pdf', '.png']"
  [allowMultipleFiles]="true"
  (submitted)="onSubmitted($event)"
></ai-chat-text-input>`;

function buildTokenStyles(tokens: AiChatTextInputTokens): string {
  return [
    `--ai-chat-text-input-bg: ${tokens.containerBg}`,
    `--ai-chat-text-input-border: ${tokens.containerBorder}`,
    `--ai-chat-text-input-radius: ${tokens.containerRadius}`,
    `--ai-chat-text-input-padding: ${tokens.containerPadding}`,
    `--ai-chat-text-input-gap: ${tokens.containerGap}`,
    `--ai-chat-text-input-textarea-bg: ${tokens.textareaBg}`,
    `--ai-chat-text-input-textarea-border: ${tokens.textareaBorder}`,
    `--ai-chat-text-input-textarea-radius: ${tokens.textareaRadius}`,
    `--ai-chat-text-input-textarea-color: ${tokens.textareaColor}`,
    `--ai-chat-text-input-textarea-placeholder: ${tokens.textareaPlaceholder}`,
    `--ai-chat-text-input-textarea-padding: ${tokens.textareaPadding}`,
    `--ai-chat-text-input-textarea-min-height: ${tokens.textareaMinHeight}`,
    `--ai-chat-text-input-textarea-font-size: ${tokens.textareaFontSize}`,
    `--ai-chat-text-input-controls-gap: ${tokens.controlsGap}`,
    `--ai-chat-text-input-upload-bg: ${tokens.uploadBg}`,
    `--ai-chat-text-input-upload-border: ${tokens.uploadBorder}`,
    `--ai-chat-text-input-upload-color: ${tokens.uploadColor}`,
    `--ai-chat-text-input-upload-hover-bg: ${tokens.uploadHoverBg}`,
    `--ai-chat-text-input-upload-size: ${tokens.uploadSize}`,
    `--ai-chat-text-input-send-bg: ${tokens.sendBg}`,
    `--ai-chat-text-input-send-color: ${tokens.sendColor}`,
    `--ai-chat-text-input-send-active-bg: ${tokens.sendActiveBg}`,
    `--ai-chat-text-input-send-active-color: ${tokens.sendActiveColor}`,
    `--ai-chat-text-input-send-disabled-bg: ${tokens.sendDisabledBg}`,
    `--ai-chat-text-input-send-disabled-color: ${tokens.sendDisabledColor}`,
    `--ai-chat-text-input-send-size: ${tokens.sendSize}`,
    `--ai-chat-text-input-files-color: ${tokens.filesColor}`,
    `--ai-chat-text-input-files-size: ${tokens.filesSize}`,
    `--ai-chat-text-input-focus-color: ${tokens.focusColor}`,
    `--ai-chat-text-input-focus-shadow: ${tokens.focusShadow}`,
  ].join('; ');
}

function formatPayload(payload: AiChatTextInputSubmitPayload): string {
  const fileNames = Array.from(payload.files).map((file) => file.name);
  return JSON.stringify(
    {
      text: payload.text,
      fileCount: payload.files.length,
      files: fileNames,
    },
    null,
    2,
  );
}

const meta: Meta = {
  title: 'UI/ChatTextInput',
  component: AiChatTextInputComponent,
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
    const tokenValues = signal<AiChatTextInputTokens>(TOKEN_DEFAULTS);
    const tokenStyles = computed(() => buildTokenStyles(tokenValues()));
    const eventLog = signal<readonly string[]>([]);

    const appendEvent = (payload: AiChatTextInputSubmitPayload): void => {
      eventLog.update((existing) => [formatPayload(payload), ...existing].slice(0, 8));
    };

    return {
      props: {
        tokenControls: TOKEN_CONTROLS,
        tokenValues,
        tokenStyles,
        eventLog,
        basicUsageSnippet: BASIC_USAGE_SNIPPET,
        uploadUsageSnippet: UPLOAD_USAGE_SNIPPET,
        onSubmitted: (payload: AiChatTextInputSubmitPayload): void => {
          appendEvent(payload);
        },
        onTokenInputEvent: (key: keyof AiChatTextInputTokens, event: Event): void => {
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
          .ai-chat-input-docs {
            display: grid;
            gap: 1rem;
            color: #0f172a;
          }

          .ai-chat-input-docs__section {
            border: 1px solid #cbd5e1;
            border-radius: 14px;
            padding: 1rem;
            background: #ffffff;
          }

          .ai-chat-input-docs__title {
            margin: 0 0 0.5rem;
            font-size: 1.12rem;
          }

          .ai-chat-input-docs__lead {
            margin: 0;
            color: #334155;
            line-height: 1.5;
          }

          .ai-chat-input-docs__demo-grid {
            margin-top: 0.875rem;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 0.875rem;
          }

          .ai-chat-input-docs__demo {
            border: 1px dashed #cbd5e1;
            border-radius: 10px;
            padding: 0.75rem;
            background: #f8fafc;
            display: grid;
            gap: 0.6rem;
          }

          .ai-chat-input-docs__demo-title {
            margin: 0;
            font-size: 0.9rem;
            color: #334155;
          }

          .ai-chat-input-docs__event-log {
            margin: 0;
            padding-left: 1.125rem;
            color: #1e293b;
            font: 500 0.8rem/1.4 'Menlo', 'Monaco', monospace;
          }

          .ai-chat-input-docs__event-empty {
            margin: 0;
            color: #475569;
            font-size: 0.9rem;
          }

          .ai-chat-input-docs__table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 0.75rem;
          }

          .ai-chat-input-docs__table th,
          .ai-chat-input-docs__table td {
            border: 1px solid #d1d5db;
            padding: 0.625rem;
            text-align: left;
            vertical-align: top;
            font-size: 0.9rem;
          }

          .ai-chat-input-docs__table thead {
            background: #f8fafc;
          }

          .ai-chat-input-docs__code {
            margin: 0.65rem 0 0;
            border-radius: 10px;
            padding: 0.75rem;
            background: #0f172a;
            color: #e2e8f0;
            font: 500 0.78rem/1.45 'Menlo', 'Monaco', monospace;
            overflow-x: auto;
          }

          .ai-chat-input-docs__tokens-layout {
            display: grid;
            grid-template-columns: minmax(320px, 1fr) minmax(300px, 1fr);
            gap: 1rem;
            align-items: start;
          }

          .ai-chat-input-docs__token-fieldset {
            margin: 0;
            border: 0;
            padding: 0;
          }

          .ai-chat-input-docs__token-grid {
            display: grid;
            gap: 0.625rem;
          }

          .ai-chat-input-docs__token-row {
            display: grid;
            gap: 0.35rem;
          }

          .ai-chat-input-docs__token-label {
            display: flex;
            justify-content: space-between;
            gap: 0.5rem;
            font-size: 0.88rem;
            font-weight: 600;
          }

          .ai-chat-input-docs__token-label code {
            padding: 0.125rem 0.375rem;
            border-radius: 6px;
            background: #f1f5f9;
            font-size: 0.75rem;
          }

          .ai-chat-input-docs__token-input {
            min-height: 2.1rem;
            width: 100%;
            border: 1px solid #94a3b8;
            border-radius: 8px;
            background: #ffffff;
            color: #0f172a;
            padding: 0.45rem 0.6rem;
          }

          .ai-chat-input-docs__token-input[type='color'] {
            padding: 0.2rem;
          }

          .ai-chat-input-docs__token-input:focus-visible {
            outline: 2px solid #1d4ed8;
            outline-offset: 2px;
          }

          .ai-chat-input-docs__token-default {
            margin: 0;
            color: #475569;
            font-size: 0.78rem;
          }

          .ai-chat-input-docs__token-preview {
            border: 1px dashed #cbd5e1;
            border-radius: 10px;
            background: #f8fafc;
            padding: 0.75rem;
          }

          @media (max-width: 920px) {
            .ai-chat-input-docs__tokens-layout {
              grid-template-columns: 1fr;
            }
          }
        </style>

        <article class="ai-chat-input-docs" aria-label="AiChatTextInputComponent single-page documentation">
          <section class="ai-chat-input-docs__section" aria-labelledby="ai-chat-input-intro">
            <h2 id="ai-chat-input-intro" class="ai-chat-input-docs__title">AiChatTextInputComponent</h2>
            <pre class="ai-chat-input-docs__code"><code>import &#123;AiChatTextInputComponent&#125; from '@ai-cdk/ui/ChatTextInput';</code></pre>
            <p class="ai-chat-input-docs__lead">
              AiChatTextInputComponent provides a reusable chat composer with submit-on-enter behavior,
              optional attachments, and a single typed submit payload.
            </p>
          </section>

          <section class="ai-chat-input-docs__section" aria-labelledby="ai-chat-input-functional">
            <h2 id="ai-chat-input-functional" class="ai-chat-input-docs__title">Functional API showcase</h2>
            <p class="ai-chat-input-docs__lead">Default mode, single-file mode, and multi-file mode with shared event log.</p>

            <div class="ai-chat-input-docs__demo-grid">
              <div class="ai-chat-input-docs__demo">
                <h3 class="ai-chat-input-docs__demo-title">Text only</h3>
                <ai-chat-text-input
                  [placeholder]="'Wie kann ich dir heute helfen?'"
                  (submitted)="onSubmitted($event)"
                ></ai-chat-text-input>
              </div>

              <div class="ai-chat-input-docs__demo">
                <h3 class="ai-chat-input-docs__demo-title">Single-file upload</h3>
                <ai-chat-text-input
                  [placeholder]="'Ask with one attachment'"
                  [acceptFileFormats]="['.pdf', '.png', '.jpg']"
                  [allowMultipleFiles]="false"
                  (submitted)="onSubmitted($event)"
                ></ai-chat-text-input>
              </div>

              <div class="ai-chat-input-docs__demo">
                <h3 class="ai-chat-input-docs__demo-title">Multi-file upload</h3>
                <ai-chat-text-input
                  [placeholder]="'Ask with multiple files'"
                  [acceptFileFormats]="['.pdf', '.png', '.jpg', '.txt']"
                  [allowMultipleFiles]="true"
                  (submitted)="onSubmitted($event)"
                ></ai-chat-text-input>
              </div>
            </div>

            <h3 class="ai-chat-input-docs__title">Event log</h3>
            @if (eventLog().length === 0) {
              <p class="ai-chat-input-docs__event-empty">No submit events yet. Send a message in any demo.</p>
            } @else {
              <ol class="ai-chat-input-docs__event-log">
                @for (entry of eventLog(); track entry) {
                  <li>{{ entry }}</li>
                }
              </ol>
            }
          </section>

          <section class="ai-chat-input-docs__section" aria-labelledby="ai-chat-input-reference">
            <h2 id="ai-chat-input-reference" class="ai-chat-input-docs__title">Technical reference</h2>
            <table class="ai-chat-input-docs__table">
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
                  <td><code>placeholder</code></td>
                  <td><code>string</code></td>
                  <td><code>'Type a message...'</code></td>
                  <td>Placeholder displayed in the message textarea.</td>
                </tr>
                <tr>
                  <td>Input</td>
                  <td><code>disabled</code></td>
                  <td><code>boolean</code></td>
                  <td><code>false</code></td>
                  <td>Disables typing, upload, and send actions.</td>
                </tr>
                <tr>
                  <td>Input</td>
                  <td><code>acceptFileFormats</code></td>
                  <td><code>string[] | null</code></td>
                  <td><code>null</code></td>
                  <td>Array of accepted formats (extensions or MIME types). Use <code>['*']</code> for all file types.</td>
                </tr>
                <tr>
                  <td>Input</td>
                  <td><code>allowMultipleFiles</code></td>
                  <td><code>boolean</code></td>
                  <td><code>false</code></td>
                  <td>Enables selecting multiple files in the picker.</td>
                </tr>
                <tr>
                  <td>Input</td>
                  <td><code>sendAriaLabel</code></td>
                  <td><code>string</code></td>
                  <td><code>'Send message'</code></td>
                  <td>Accessible label for the send action button.</td>
                </tr>
                <tr>
                  <td>Input</td>
                  <td><code>uploadAriaLabel</code></td>
                  <td><code>string</code></td>
                  <td><code>'Upload file'</code></td>
                  <td>Accessible label for the upload trigger button.</td>
                </tr>
                <tr>
                  <td>Output</td>
                  <td><code>submitted</code></td>
                  <td><code>&#123;text: string; files: FileList&#125;</code></td>
                  <td>n/a</td>
                  <td>Emits on send click or Enter key with non-empty text.</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section class="ai-chat-input-docs__section" aria-labelledby="ai-chat-input-snippets">
            <h2 id="ai-chat-input-snippets" class="ai-chat-input-docs__title">Usage snippets</h2>
            <pre class="ai-chat-input-docs__code">{{ basicUsageSnippet }}</pre>
            <pre class="ai-chat-input-docs__code">{{ uploadUsageSnippet }}</pre>
          </section>

          <section class="ai-chat-input-docs__section" aria-labelledby="ai-chat-input-tokens">
            <h2 id="ai-chat-input-tokens" class="ai-chat-input-docs__title">Style tokens playground</h2>
            <div class="ai-chat-input-docs__tokens-layout">
              <fieldset class="ai-chat-input-docs__token-fieldset">
                <legend>Live token editor</legend>
                <div class="ai-chat-input-docs__token-grid">
                  @for (token of tokenControls; track token.key) {
                    <div class="ai-chat-input-docs__token-row">
                      <label class="ai-chat-input-docs__token-label" [attr.for]="'ai-chat-input-token-' + token.key">
                        <span>{{ token.label }}</span>
                        <code>{{ token.cssVar }}</code>
                      </label>
                      <input
                        class="ai-chat-input-docs__token-input"
                        [id]="'ai-chat-input-token-' + token.key"
                        [type]="token.inputType"
                        [value]="tokenValues()[token.key]"
                        (input)="onTokenInputEvent(token.key, $event)"
                      />
                      <p class="ai-chat-input-docs__token-default">Default: <code>{{ token.defaultValue }}</code></p>
                    </div>
                  }
                </div>
              </fieldset>

              <div class="ai-chat-input-docs__token-preview">
                <ai-chat-text-input
                  [style]="tokenStyles()"
                  [placeholder]="'Token preview input'"
                  [acceptFileFormats]="['.pdf', '.png', '.jpg']"
                  [allowMultipleFiles]="true"
                  (submitted)="onSubmitted($event)"
                ></ai-chat-text-input>
              </div>
            </div>
          </section>
        </article>
      `,
    };
  },
};
