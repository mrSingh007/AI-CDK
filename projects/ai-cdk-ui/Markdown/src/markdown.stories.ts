import { computed, signal } from '@angular/core';
import { AiMarkdownComponent } from '@ai-cdk/ui/Markdown';
import type { Meta, StoryObj } from '@storybook/angular';

interface MarkdownTokens {
  readonly textColor: string;
  readonly headingColor: string;
  readonly linkColor: string;
  readonly linkHoverColor: string;
  readonly focusColor: string;
  readonly codeColor: string;
  readonly codeBg: string;
  readonly preColor: string;
  readonly preBg: string;
  readonly blockquoteColor: string;
  readonly blockquoteBorder: string;
  readonly tableBorder: string;
  readonly tableHeaderBg: string;
}

interface TokenControl {
  readonly key: keyof MarkdownTokens;
  readonly cssVar: string;
  readonly label: string;
  readonly inputType: 'color' | 'text';
  readonly defaultValue: string;
}

const TOKEN_DEFAULTS: MarkdownTokens = {
  textColor: '#0f172a',
  headingColor: '#0f172a',
  linkColor: '#1d4ed8',
  linkHoverColor: '#1e40af',
  focusColor: '#1d4ed8',
  codeColor: '#111827',
  codeBg: '#e2e8f0',
  preColor: '#e2e8f0',
  preBg: '#0f172a',
  blockquoteColor: '#334155',
  blockquoteBorder: '#94a3b8',
  tableBorder: '#cbd5e1',
  tableHeaderBg: '#f1f5f9',
};

const TOKEN_CONTROLS: readonly TokenControl[] = [
  {
    key: 'textColor',
    cssVar: '--ai-markdown-color',
    label: 'Text color',
    inputType: 'color',
    defaultValue: TOKEN_DEFAULTS.textColor,
  },
  {
    key: 'headingColor',
    cssVar: '--ai-markdown-heading-color',
    label: 'Heading color',
    inputType: 'color',
    defaultValue: TOKEN_DEFAULTS.headingColor,
  },
  {
    key: 'linkColor',
    cssVar: '--ai-markdown-link-color',
    label: 'Link color',
    inputType: 'color',
    defaultValue: TOKEN_DEFAULTS.linkColor,
  },
  {
    key: 'linkHoverColor',
    cssVar: '--ai-markdown-link-hover-color',
    label: 'Link hover color',
    inputType: 'color',
    defaultValue: TOKEN_DEFAULTS.linkHoverColor,
  },
  {
    key: 'focusColor',
    cssVar: '--ai-markdown-focus-color',
    label: 'Focus ring color',
    inputType: 'color',
    defaultValue: TOKEN_DEFAULTS.focusColor,
  },
  {
    key: 'codeColor',
    cssVar: '--ai-markdown-code-color',
    label: 'Inline code text',
    inputType: 'color',
    defaultValue: TOKEN_DEFAULTS.codeColor,
  },
  {
    key: 'codeBg',
    cssVar: '--ai-markdown-code-bg',
    label: 'Inline code background',
    inputType: 'color',
    defaultValue: TOKEN_DEFAULTS.codeBg,
  },
  {
    key: 'preColor',
    cssVar: '--ai-markdown-pre-color',
    label: 'Code block text',
    inputType: 'color',
    defaultValue: TOKEN_DEFAULTS.preColor,
  },
  {
    key: 'preBg',
    cssVar: '--ai-markdown-pre-bg',
    label: 'Code block background',
    inputType: 'color',
    defaultValue: TOKEN_DEFAULTS.preBg,
  },
  {
    key: 'blockquoteColor',
    cssVar: '--ai-markdown-blockquote-color',
    label: 'Blockquote text',
    inputType: 'color',
    defaultValue: TOKEN_DEFAULTS.blockquoteColor,
  },
  {
    key: 'blockquoteBorder',
    cssVar: '--ai-markdown-blockquote-border',
    label: 'Blockquote border',
    inputType: 'color',
    defaultValue: TOKEN_DEFAULTS.blockquoteBorder,
  },
  {
    key: 'tableBorder',
    cssVar: '--ai-markdown-table-border',
    label: 'Table border',
    inputType: 'color',
    defaultValue: TOKEN_DEFAULTS.tableBorder,
  },
  {
    key: 'tableHeaderBg',
    cssVar: '--ai-markdown-table-header-bg',
    label: 'Table header background',
    inputType: 'color',
    defaultValue: TOKEN_DEFAULTS.tableHeaderBg,
  },
];

const DEFAULT_CONTENT = `# Release Summary

Copilot style mixed rendering expects markdown to work well beside generative UI payloads.

## Highlights

- Streaming transcript support
- Tool-call UI component rendering
- Safe markdown output

| Module | Status |
| --- | --- |
| Renderer | Stable |
| AG-UI chatbox | Stable |

Use \`AiMarkdownComponent\` for assistant text rendering.

\`\`\`ts
<ai-markdown [content]="message.content" />
\`\`\``;

const USAGE_SNIPPET = `<ai-markdown [content]="markdownContent" />`;

function buildTokenStyle(tokens: MarkdownTokens): string {
  return [
    `--ai-markdown-color: ${tokens.textColor}`,
    `--ai-markdown-heading-color: ${tokens.headingColor}`,
    `--ai-markdown-link-color: ${tokens.linkColor}`,
    `--ai-markdown-link-hover-color: ${tokens.linkHoverColor}`,
    `--ai-markdown-focus-color: ${tokens.focusColor}`,
    `--ai-markdown-code-color: ${tokens.codeColor}`,
    `--ai-markdown-code-bg: ${tokens.codeBg}`,
    `--ai-markdown-pre-color: ${tokens.preColor}`,
    `--ai-markdown-pre-bg: ${tokens.preBg}`,
    `--ai-markdown-blockquote-color: ${tokens.blockquoteColor}`,
    `--ai-markdown-blockquote-border: ${tokens.blockquoteBorder}`,
    `--ai-markdown-table-border: ${tokens.tableBorder}`,
    `--ai-markdown-table-header-bg: ${tokens.tableHeaderBg}`,
  ].join('; ');
}

const meta: Meta<AiMarkdownComponent> = {
  title: 'UI/Markdown',
  component: AiMarkdownComponent,
  parameters: {
    controls: {
      disable: true,
      hideNoControlsWarning: true,
    },
  },
};

export default meta;
type Story = StoryObj<AiMarkdownComponent>;

export const Overview: Story = {
  render: () => {
    const tokenValues = signal<MarkdownTokens>(TOKEN_DEFAULTS);
    const tokenStyle = computed(() => buildTokenStyle(tokenValues()));
    const content = signal(DEFAULT_CONTENT);

    return {
      props: {
        tokenControls: TOKEN_CONTROLS,
        tokenValues,
        tokenStyle,
        content,
        usageSnippet: USAGE_SNIPPET,
        onTokenInput: (key: keyof MarkdownTokens, event: Event): void => {
          const target = event.target;
          if (!(target instanceof HTMLInputElement)) {
            return;
          }

          tokenValues.update((current) => ({
            ...current,
            [key]: target.value,
          }));
        },
        onContentInput: (event: Event): void => {
          const target = event.target;
          if (!(target instanceof HTMLTextAreaElement)) {
            return;
          }

          content.set(target.value);
        },
      },
      template: `
        <style>
          .ai-markdown-docs {
            font-family: 'Manrope', 'Avenir Next', 'Segoe UI', sans-serif;
            color: #0f172a;
            display: grid;
            gap: 1rem;
          }

          .ai-markdown-docs__section {
            border: 1px solid #d1d5db;
            border-radius: 14px;
            background: #ffffff;
            padding: 1rem;
          }

          .ai-markdown-docs__title {
            margin: 0 0 0.5rem;
            font-size: 1.2rem;
          }

          .ai-markdown-docs__lead {
            margin: 0;
            color: #334155;
          }

          .ai-markdown-docs__demo-grid {
            margin-top: 0.8rem;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 0.8rem;
          }

          .ai-markdown-docs__preview {
            border: 1px solid #cbd5e1;
            border-radius: 12px;
            background: #ffffff;
            padding: 0.75rem;
          }

          .ai-markdown-docs__editor {
            width: 100%;
            min-height: 13rem;
            border: 1px solid #94a3b8;
            border-radius: 10px;
            padding: 0.7rem;
            font: 500 0.85rem/1.45 'JetBrains Mono', 'SFMono-Regular', monospace;
          }

          .ai-markdown-docs__table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.9rem;
          }

          .ai-markdown-docs__table th,
          .ai-markdown-docs__table td {
            border: 1px solid #d1d5db;
            padding: 0.55rem;
            text-align: left;
            vertical-align: top;
          }

          .ai-markdown-docs__table thead {
            background: #f1f5f9;
          }

          .ai-markdown-docs__code {
            margin: 0;
            padding: 0.75rem;
            border-radius: 10px;
            background: #0f172a;
            color: #e2e8f0;
            font: 500 0.78rem/1.45 'JetBrains Mono', 'SFMono-Regular', monospace;
            overflow-x: auto;
          }

          .ai-markdown-docs__tokens {
            display: grid;
            grid-template-columns: minmax(280px, 1fr) minmax(280px, 1fr);
            gap: 0.9rem;
          }

          .ai-markdown-docs__token-grid {
            display: grid;
            gap: 0.55rem;
            max-height: 26rem;
            overflow: auto;
            padding-right: 0.2rem;
          }

          .ai-markdown-docs__token-row {
            display: grid;
            gap: 0.32rem;
          }

          .ai-markdown-docs__token-label {
            display: flex;
            justify-content: space-between;
            gap: 0.4rem;
            font-size: 0.84rem;
            font-weight: 600;
          }

          .ai-markdown-docs__token-label code {
            border-radius: 6px;
            background: #e2e8f0;
            padding: 0.1rem 0.32rem;
            font-size: 0.73rem;
          }

          .ai-markdown-docs__token-input {
            min-height: 2rem;
            border: 1px solid #94a3b8;
            border-radius: 8px;
            padding: 0.4rem 0.55rem;
          }

          .ai-markdown-docs__token-input[type='color'] {
            padding: 0.2rem;
          }

          .ai-markdown-docs__token-default {
            margin: 0;
            color: #475569;
            font-size: 0.76rem;
          }

          @media (max-width: 960px) {
            .ai-markdown-docs__tokens {
              grid-template-columns: 1fr;
            }

            .ai-markdown-docs__token-grid {
              max-height: none;
            }
          }
        </style>

        <article class="ai-markdown-docs" aria-label="AiMarkdownComponent single-page documentation">
          <section class="ai-markdown-docs__section" aria-labelledby="ai-markdown-intro">
            <h2 id="ai-markdown-intro" class="ai-markdown-docs__title">AiMarkdownComponent</h2>
            <p class="ai-markdown-docs__lead">
              Reusable markdown renderer for AI transcript text with sanitized HTML output and token-driven styling.
            </p>
            <pre class="ai-markdown-docs__code"><code>import &#123; AiMarkdownComponent &#125; from '@ai-cdk/ui/Markdown';</code></pre>
          </section>

          <section class="ai-markdown-docs__section" aria-labelledby="ai-markdown-functional">
            <h2 id="ai-markdown-functional" class="ai-markdown-docs__title">Functional API showcase</h2>
            <p class="ai-markdown-docs__lead">
              Edit markdown text and see parsed output in real time.
            </p>

            <div class="ai-markdown-docs__demo-grid">
              <div>
                <label for="markdown-input">Markdown source</label>
                <textarea
                  id="markdown-input"
                  class="ai-markdown-docs__editor"
                  [value]="content()"
                  (input)="onContentInput($event)"
                ></textarea>
              </div>

              <div class="ai-markdown-docs__preview" [style]="tokenStyle()">
                <ai-markdown [content]="content()" />
              </div>
            </div>
          </section>

          <section class="ai-markdown-docs__section" aria-labelledby="ai-markdown-reference">
            <h2 id="ai-markdown-reference" class="ai-markdown-docs__title">Technical reference</h2>
            <table class="ai-markdown-docs__table">
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
                  <td><code>content</code></td>
                  <td><code>string</code></td>
                  <td>required</td>
                  <td>Markdown source text rendered as sanitized HTML.</td>
                </tr>
                <tr>
                  <td>Output</td>
                  <td>none</td>
                  <td>n/a</td>
                  <td>n/a</td>
                  <td>The component is render-only.</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section class="ai-markdown-docs__section" aria-labelledby="ai-markdown-usage">
            <h2 id="ai-markdown-usage" class="ai-markdown-docs__title">Usage snippets</h2>
            <pre class="ai-markdown-docs__code"><code>{{ usageSnippet }}</code></pre>
          </section>

          <section class="ai-markdown-docs__section" aria-labelledby="ai-markdown-tokens">
            <h2 id="ai-markdown-tokens" class="ai-markdown-docs__title">SCSS tokens</h2>
            <div class="ai-markdown-docs__tokens">
              <div class="ai-markdown-docs__token-grid">
                @for (token of tokenControls; track token.key) {
                  <label class="ai-markdown-docs__token-row">
                    <span class="ai-markdown-docs__token-label">
                      <span>{{ token.label }}</span>
                      <code>{{ token.cssVar }}</code>
                    </span>
                    <input
                      class="ai-markdown-docs__token-input"
                      [type]="token.inputType"
                      [value]="tokenValues()[token.key]"
                      (input)="onTokenInput(token.key, $event)"
                    />
                    <small class="ai-markdown-docs__token-default">Default: {{ token.defaultValue }}</small>
                  </label>
                }
              </div>

              <div class="ai-markdown-docs__preview" [style]="tokenStyle()">
                <ai-markdown [content]="content()" />
              </div>
            </div>
          </section>
        </article>
      `,
    };
  },
};
