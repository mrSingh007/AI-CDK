import { computed, signal } from '@angular/core';
import { AiQuestionnaireComponent, type AiAnswer, type AiQuestion } from '@ai-cdk/ui/Questionnaire';
import type { Meta, StoryObj } from '@storybook/angular';

interface AiQuestionnaireTokens {
  readonly questionnaireBg: string;
  readonly questionnaireBorderRadius: string;
  readonly questionnairePadding: string;
  readonly questionColor: string;
  readonly questionSize: string;
  readonly optionBg: string;
  readonly optionBorder: string;
  readonly optionHoverBg: string;
  readonly optionSelectedBg: string;
  readonly optionSelectedColor: string;
  readonly inputBorder: string;
  readonly inputBg: string;
  readonly inputColor: string;
  readonly nextBg: string;
  readonly nextColor: string;
  readonly nextPadding: string;
  readonly questionnaireGap: string;
}

interface AiQuestionnaireTokenControl {
  readonly key: keyof AiQuestionnaireTokens;
  readonly cssVar: string;
  readonly label: string;
  readonly inputType: 'color' | 'text';
  readonly defaultValue: string;
}

const DEFAULT_QUESTIONS: AiQuestion[] = [
  {
    id: 'destination',
    question: 'Where would you like to travel?',
    options: ['UK', 'USA', 'Germany'],
  },
  {
    id: 'topics',
    question: 'Which topics interest you?',
    options: ['Design', 'Engineering', 'Marketing'],
    multiSelect: true,
  },
];

const MULTI_SELECT_QUESTIONS: AiQuestion[] = [
  {
    id: 'skills',
    question: 'Pick your preferred tracks',
    options: ['Frontend', 'Backend', 'DevOps'],
  },
];

const QUESTIONNAIRE_TOKEN_DEFAULTS: AiQuestionnaireTokens = {
  questionnaireBg: '#ffffff',
  questionnaireBorderRadius: '12px',
  questionnairePadding: '1.5rem',
  questionColor: '#111827',
  questionSize: '1rem',
  optionBg: '#f9fafb',
  optionBorder: '1px solid #e5e7eb',
  optionHoverBg: '#eff6ff',
  optionSelectedBg: '#3b82f6',
  optionSelectedColor: '#ffffff',
  inputBorder: '1px solid #d1d5db',
  inputBg: '#ffffff',
  inputColor: '#111827',
  nextBg: '#2563eb',
  nextColor: '#ffffff',
  nextPadding: '0.5rem 1rem',
  questionnaireGap: '0.5rem',
};

const QUESTIONNAIRE_TOKEN_CONTROLS: readonly AiQuestionnaireTokenControl[] = [
  {
    key: 'questionnaireBg',
    cssVar: '--ai-questionnaire-bg',
    label: 'Container background',
    inputType: 'color',
    defaultValue: QUESTIONNAIRE_TOKEN_DEFAULTS.questionnaireBg,
  },
  {
    key: 'questionnaireBorderRadius',
    cssVar: '--ai-questionnaire-border-radius',
    label: 'Container radius',
    inputType: 'text',
    defaultValue: QUESTIONNAIRE_TOKEN_DEFAULTS.questionnaireBorderRadius,
  },
  {
    key: 'questionnairePadding',
    cssVar: '--ai-questionnaire-padding',
    label: 'Container padding',
    inputType: 'text',
    defaultValue: QUESTIONNAIRE_TOKEN_DEFAULTS.questionnairePadding,
  },
  {
    key: 'questionColor',
    cssVar: '--ai-questionnaire-question-color',
    label: 'Question color',
    inputType: 'color',
    defaultValue: QUESTIONNAIRE_TOKEN_DEFAULTS.questionColor,
  },
  {
    key: 'questionSize',
    cssVar: '--ai-questionnaire-question-size',
    label: 'Question size',
    inputType: 'text',
    defaultValue: QUESTIONNAIRE_TOKEN_DEFAULTS.questionSize,
  },
  {
    key: 'optionBg',
    cssVar: '--ai-questionnaire-option-bg',
    label: 'Option background',
    inputType: 'color',
    defaultValue: QUESTIONNAIRE_TOKEN_DEFAULTS.optionBg,
  },
  {
    key: 'optionBorder',
    cssVar: '--ai-questionnaire-option-border',
    label: 'Option border',
    inputType: 'text',
    defaultValue: QUESTIONNAIRE_TOKEN_DEFAULTS.optionBorder,
  },
  {
    key: 'optionHoverBg',
    cssVar: '--ai-questionnaire-option-hover-bg',
    label: 'Option hover background',
    inputType: 'color',
    defaultValue: QUESTIONNAIRE_TOKEN_DEFAULTS.optionHoverBg,
  },
  {
    key: 'optionSelectedBg',
    cssVar: '--ai-questionnaire-option-selected-bg',
    label: 'Selected option background',
    inputType: 'color',
    defaultValue: QUESTIONNAIRE_TOKEN_DEFAULTS.optionSelectedBg,
  },
  {
    key: 'optionSelectedColor',
    cssVar: '--ai-questionnaire-option-selected-color',
    label: 'Selected option color',
    inputType: 'color',
    defaultValue: QUESTIONNAIRE_TOKEN_DEFAULTS.optionSelectedColor,
  },
  {
    key: 'inputBorder',
    cssVar: '--ai-questionnaire-input-border',
    label: 'Input border',
    inputType: 'text',
    defaultValue: QUESTIONNAIRE_TOKEN_DEFAULTS.inputBorder,
  },
  {
    key: 'inputBg',
    cssVar: '--ai-questionnaire-input-bg',
    label: 'Input background',
    inputType: 'color',
    defaultValue: QUESTIONNAIRE_TOKEN_DEFAULTS.inputBg,
  },
  {
    key: 'inputColor',
    cssVar: '--ai-questionnaire-input-color',
    label: 'Input color',
    inputType: 'color',
    defaultValue: QUESTIONNAIRE_TOKEN_DEFAULTS.inputColor,
  },
  {
    key: 'nextBg',
    cssVar: '--ai-questionnaire-next-bg',
    label: 'Next button background',
    inputType: 'color',
    defaultValue: QUESTIONNAIRE_TOKEN_DEFAULTS.nextBg,
  },
  {
    key: 'nextColor',
    cssVar: '--ai-questionnaire-next-color',
    label: 'Next button color',
    inputType: 'color',
    defaultValue: QUESTIONNAIRE_TOKEN_DEFAULTS.nextColor,
  },
  {
    key: 'nextPadding',
    cssVar: '--ai-questionnaire-next-padding',
    label: 'Next button padding',
    inputType: 'text',
    defaultValue: QUESTIONNAIRE_TOKEN_DEFAULTS.nextPadding,
  },
  {
    key: 'questionnaireGap',
    cssVar: '--ai-questionnaire-gap',
    label: 'Options gap',
    inputType: 'text',
    defaultValue: QUESTIONNAIRE_TOKEN_DEFAULTS.questionnaireGap,
  },
];

const BASIC_USAGE_SNIPPET = `<ai-questionnaire
  [questions]="questions"
  [allowInput]="true"
  [multiSelect]="false"
  (answerSubmit)="onAnswerSubmit($event)"
  (completed)="onCompleted($event)"
></ai-questionnaire>`;

const TOKEN_USAGE_SNIPPET = `<ai-questionnaire
  style="--ai-questionnaire-bg: #f8fafc; --ai-questionnaire-option-selected-bg: #0f766e; --ai-questionnaire-next-bg: #0f766e;"
  [questions]="questions"
  [allowInput]="true"
  [multiSelect]="false"
></ai-questionnaire>`;

function buildQuestionnaireTokenStyles(tokens: AiQuestionnaireTokens): string {
  return [
    `--ai-questionnaire-bg: ${tokens.questionnaireBg}`,
    `--ai-questionnaire-border-radius: ${tokens.questionnaireBorderRadius}`,
    `--ai-questionnaire-padding: ${tokens.questionnairePadding}`,
    `--ai-questionnaire-question-color: ${tokens.questionColor}`,
    `--ai-questionnaire-question-size: ${tokens.questionSize}`,
    `--ai-questionnaire-option-bg: ${tokens.optionBg}`,
    `--ai-questionnaire-option-border: ${tokens.optionBorder}`,
    `--ai-questionnaire-option-hover-bg: ${tokens.optionHoverBg}`,
    `--ai-questionnaire-option-selected-bg: ${tokens.optionSelectedBg}`,
    `--ai-questionnaire-option-selected-color: ${tokens.optionSelectedColor}`,
    `--ai-questionnaire-input-border: ${tokens.inputBorder}`,
    `--ai-questionnaire-input-bg: ${tokens.inputBg}`,
    `--ai-questionnaire-input-color: ${tokens.inputColor}`,
    `--ai-questionnaire-next-bg: ${tokens.nextBg}`,
    `--ai-questionnaire-next-color: ${tokens.nextColor}`,
    `--ai-questionnaire-next-padding: ${tokens.nextPadding}`,
    `--ai-questionnaire-gap: ${tokens.questionnaireGap}`,
  ].join('; ');
}

function toJson(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

const meta: Meta = {
  title: 'UI/Questionnaire',
  component: AiQuestionnaireComponent,
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
    const tokenValues = signal<AiQuestionnaireTokens>(QUESTIONNAIRE_TOKEN_DEFAULTS);
    const tokenStyles = computed(() => buildQuestionnaireTokenStyles(tokenValues()));
    const eventLog = signal<readonly string[]>([]);

    const appendEvent = (label: string, payload: unknown): void => {
      const row = `${label}: ${toJson(payload)}`;
      eventLog.update((existing) => [row, ...existing].slice(0, 8));
    };

    return {
      props: {
        defaultQuestions: DEFAULT_QUESTIONS,
        multiSelectQuestions: MULTI_SELECT_QUESTIONS,
        tokenControls: QUESTIONNAIRE_TOKEN_CONTROLS,
        tokenValues,
        tokenStyles,
        eventLog,
        basicUsageSnippet: BASIC_USAGE_SNIPPET,
        tokenUsageSnippet: TOKEN_USAGE_SNIPPET,
        onAnswerSubmit: (answer: AiAnswer) => {
          appendEvent('answerSubmit', answer);
        },
        onCompleted: (answers: AiAnswer[]) => {
          appendEvent('completed', answers);
        },
        onTokenInputEvent: (key: keyof AiQuestionnaireTokens, event: Event): void => {
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
          .ai-questionnaire-docs {
            display: grid;
            gap: 1rem;
            color: #0f172a;
          }

          .ai-questionnaire-docs__section {
            border: 1px solid #cbd5e1;
            border-radius: 14px;
            padding: 1rem;
            background: #ffffff;
          }

          .ai-questionnaire-docs__title {
            margin: 0 0 0.5rem;
            font-size: 1.12rem;
          }

          .ai-questionnaire-docs__lead {
            margin: 0;
            color: #334155;
            line-height: 1.5;
          }

          .ai-questionnaire-docs__demo-grid {
            margin-top: 0.875rem;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 0.875rem;
          }

          .ai-questionnaire-docs__demo {
            border: 1px dashed #cbd5e1;
            border-radius: 10px;
            padding: 0.75rem;
            background: #f8fafc;
          }

          .ai-questionnaire-docs__demo-title {
            margin: 0 0 0.5rem;
            font-size: 0.9rem;
            color: #334155;
          }

          .ai-questionnaire-docs__event-log {
            margin: 0;
            padding-left: 1.125rem;
            color: #1e293b;
            font: 500 0.8rem/1.4 'Menlo', 'Monaco', monospace;
          }

          .ai-questionnaire-docs__event-empty {
            margin: 0;
            color: #475569;
            font-size: 0.9rem;
          }

          .ai-questionnaire-docs__table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 0.75rem;
          }

          .ai-questionnaire-docs__table th,
          .ai-questionnaire-docs__table td {
            border: 1px solid #d1d5db;
            padding: 0.625rem;
            text-align: left;
            vertical-align: top;
            font-size: 0.9rem;
          }

          .ai-questionnaire-docs__table thead {
            background: #f8fafc;
          }

          .ai-questionnaire-docs__code {
            margin: 0.65rem 0 0;
            border-radius: 10px;
            padding: 0.75rem;
            background: #0f172a;
            color: #e2e8f0;
            font: 500 0.78rem/1.45 'Menlo', 'Monaco', monospace;
            overflow-x: auto;
          }

          .ai-questionnaire-docs__tokens-layout {
            display: grid;
            grid-template-columns: minmax(320px, 1fr) minmax(300px, 1fr);
            gap: 1rem;
            align-items: start;
          }

          .ai-questionnaire-docs__token-fieldset {
            margin: 0;
            border: 0;
            padding: 0;
          }

          .ai-questionnaire-docs__token-grid {
            display: grid;
            gap: 0.625rem;
          }

          .ai-questionnaire-docs__token-row {
            display: grid;
            gap: 0.35rem;
          }

          .ai-questionnaire-docs__token-label {
            display: flex;
            justify-content: space-between;
            gap: 0.5rem;
            font-size: 0.88rem;
            font-weight: 600;
          }

          .ai-questionnaire-docs__token-label code {
            padding: 0.125rem 0.375rem;
            border-radius: 6px;
            background: #f1f5f9;
            font-size: 0.75rem;
          }

          .ai-questionnaire-docs__token-input {
            min-height: 2.1rem;
            width: 100%;
            border: 1px solid #94a3b8;
            border-radius: 8px;
            background: #ffffff;
            color: #0f172a;
            padding: 0.45rem 0.6rem;
          }

          .ai-questionnaire-docs__token-input[type='color'] {
            padding: 0.2rem;
          }

          .ai-questionnaire-docs__token-input:focus-visible {
            outline: 2px solid #1d4ed8;
            outline-offset: 2px;
          }

          .ai-questionnaire-docs__token-default {
            margin: 0;
            color: #475569;
            font-size: 0.78rem;
          }

          .ai-questionnaire-docs__token-preview {
            border: 1px dashed #cbd5e1;
            border-radius: 10px;
            background: #f8fafc;
            padding: 0.75rem;
          }

          @media (max-width: 920px) {
            .ai-questionnaire-docs__tokens-layout {
              grid-template-columns: 1fr;
            }
          }
        </style>

        <article class="ai-questionnaire-docs" aria-label="AiQuestionnaireComponent single-page documentation">
          <section class="ai-questionnaire-docs__section" aria-labelledby="ai-questionnaire-intro">
            <h2 id="ai-questionnaire-intro" class="ai-questionnaire-docs__title">AiQuestionnaireComponent</h2>
            <pre class="ai-questionnaire-docs__code"><code>import &#123;AiQuestionnaireComponent&#125; from '@ai-cdk/ui';</code></pre>
            <p class="ai-questionnaire-docs__lead">
              AiQuestionnaireComponent guides users through step-by-step question flows with single- or
              multi-select options, optional free-text input, and completion events.
            </p>
          </section>

          <section class="ai-questionnaire-docs__section" aria-labelledby="ai-questionnaire-functional">
            <h2 id="ai-questionnaire-functional" class="ai-questionnaire-docs__title">Functional API showcase</h2>
            <p class="ai-questionnaire-docs__lead">Default flow, multi-select flow, and output event logging.</p>

            <div class="ai-questionnaire-docs__demo-grid">
              <div class="ai-questionnaire-docs__demo">
                <h3 class="ai-questionnaire-docs__demo-title">Default flow (allowInput=true)</h3>
                <ai-questionnaire
                  [questions]="defaultQuestions"
                  [allowInput]="true"
                  [multiSelect]="false"
                  (answerSubmit)="onAnswerSubmit($event)"
                  (completed)="onCompleted($event)"
                ></ai-questionnaire>
              </div>

              <div class="ai-questionnaire-docs__demo">
                <h3 class="ai-questionnaire-docs__demo-title">Multi-select without text input</h3>
                <ai-questionnaire
                  [questions]="multiSelectQuestions"
                  [allowInput]="false"
                  [multiSelect]="true"
                  (answerSubmit)="onAnswerSubmit($event)"
                  (completed)="onCompleted($event)"
                ></ai-questionnaire>
              </div>
            </div>

            <h3 class="ai-questionnaire-docs__title">Event log</h3>
            @if (eventLog().length === 0) {
              <p class="ai-questionnaire-docs__event-empty">No events yet. Answer a question to inspect emitted payloads.</p>
            } @else {
              <ol class="ai-questionnaire-docs__event-log">
                @for (entry of eventLog(); track entry) {
                  <li>{{ entry }}</li>
                }
              </ol>
            }
          </section>

          <section class="ai-questionnaire-docs__section" aria-labelledby="ai-questionnaire-reference">
            <h2 id="ai-questionnaire-reference" class="ai-questionnaire-docs__title">Technical reference</h2>
            <table class="ai-questionnaire-docs__table">
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
                  <td><code>questions</code></td>
                  <td><code>AiQuestion[]</code></td>
                  <td><code>[]</code></td>
                  <td>Ordered question list shown to the user.</td>
                </tr>
                <tr>
                  <td>Input</td>
                  <td><code>allowInput</code></td>
                  <td><code>boolean</code></td>
                  <td><code>true</code></td>
                  <td>Enables free-text input for each question step.</td>
                </tr>
                <tr>
                  <td>Input</td>
                  <td><code>multiSelect</code></td>
                  <td><code>boolean</code></td>
                  <td><code>false</code></td>
                  <td>Sets default multi-select behavior unless overridden per question.</td>
                </tr>
                <tr>
                  <td>Output</td>
                  <td><code>answerSubmit</code></td>
                  <td><code>AiAnswer</code></td>
                  <td>n/a</td>
                  <td>Emits the answer for each submitted question.</td>
                </tr>
                <tr>
                  <td>Output</td>
                  <td><code>completed</code></td>
                  <td><code>AiAnswer[]</code></td>
                  <td>n/a</td>
                  <td>Emits once after the final question is submitted.</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section class="ai-questionnaire-docs__section" aria-labelledby="ai-questionnaire-snippets">
            <h2 id="ai-questionnaire-snippets" class="ai-questionnaire-docs__title">Usage snippets</h2>
            <pre class="ai-questionnaire-docs__code">{{ basicUsageSnippet }}</pre>
            <pre class="ai-questionnaire-docs__code">{{ tokenUsageSnippet }}</pre>
          </section>

          <section class="ai-questionnaire-docs__section" aria-labelledby="ai-questionnaire-tokens">
            <h2 id="ai-questionnaire-tokens" class="ai-questionnaire-docs__title">Style tokens playground</h2>
            <div class="ai-questionnaire-docs__tokens-layout">
              <fieldset class="ai-questionnaire-docs__token-fieldset">
                <legend>Live token editor</legend>
                <div class="ai-questionnaire-docs__token-grid">
                  @for (token of tokenControls; track token.key) {
                    <div class="ai-questionnaire-docs__token-row">
                      <label class="ai-questionnaire-docs__token-label" [attr.for]="'ai-questionnaire-token-' + token.key">
                        <span>{{ token.label }}</span>
                        <code>{{ token.cssVar }}</code>
                      </label>
                      <input
                        class="ai-questionnaire-docs__token-input"
                        [id]="'ai-questionnaire-token-' + token.key"
                        [type]="token.inputType"
                        [value]="tokenValues()[token.key]"
                        (input)="onTokenInputEvent(token.key, $event)"
                      />
                      <p class="ai-questionnaire-docs__token-default">Default: <code>{{ token.defaultValue }}</code></p>
                    </div>
                  }
                </div>
              </fieldset>

              <div class="ai-questionnaire-docs__token-preview">
                <ai-questionnaire
                  [style]="tokenStyles()"
                  [questions]="defaultQuestions"
                  [allowInput]="true"
                  [multiSelect]="false"
                  (answerSubmit)="onAnswerSubmit($event)"
                  (completed)="onCompleted($event)"
                ></ai-questionnaire>
              </div>
            </div>
          </section>
        </article>
      `,
    };
  },
};
