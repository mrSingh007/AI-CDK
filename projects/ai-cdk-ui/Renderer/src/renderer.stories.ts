import { signal } from '@angular/core';
import { AiCardComponent } from '@ai-cdk/ui/Card';
import { AiHumanFeedbackComponent } from '@ai-cdk/ui/HumanFeedback';
import { AiQuestion, AiQuestionnaireComponent } from '@ai-cdk/ui/Questionnaire';
import {
  AiPayloadComponentRegistration,
  AiPayloadRenderRequest,
  AiPayloadRendererComponent,
} from '@ai-cdk/ui/Renderer';
import type { Meta, StoryObj } from '@storybook/angular';
import {
  AiLoremCallbackComponent,
  AiModelBridgeDemoComponent,
  AiNativeClickSurfaceComponent,
} from './test-data/demo-components';

const ARIA_LIVE_OPTIONS = ['off', 'polite', 'assertive'] as const;

type AiAriaLiveMode = (typeof ARIA_LIVE_OPTIONS)[number];
type PayloadKey =
  | 'card'
  | 'questionnaire'
  | 'humanFeedback'
  | 'callbackInput'
  | 'nativeClick'
  | 'modelBridge';

interface PayloadShowcaseItem {
  readonly key: PayloadKey;
  readonly title: string;
  readonly description: string;
  readonly renderRequest: AiPayloadRenderRequest;
}

const QUESTIONNAIRE_ITEMS: AiQuestion[] = [
  {
    id: 'goal',
    question: 'What do you want help with?',
    options: ['Code review', 'Refactor', 'Debug'],
  },
  {
    id: 'priority',
    question: 'Priority?',
    options: ['Low', 'Medium', 'High'],
  },
];

const SHOWCASE_REGISTRY: readonly AiPayloadComponentRegistration[] = [
  {
    key: 'card',
    component: AiCardComponent,
    events: {
      cardClick: 'onCardClick',
    },
    contentSlots: ['header', '', 'footer'],
  },
  {
    key: 'questionnaire',
    component: AiQuestionnaireComponent,
    events: {
      answerSubmit: 'onAnswerSubmit',
      completed: 'onQuestionnaireCompleted',
    },
  },
  {
    key: 'humanFeedback',
    component: AiHumanFeedbackComponent,
    events: {
      confirmed: 'onConfirmed',
      rejected: 'onRejected',
    },
  },
  {
    key: 'callbackInput',
    component: AiLoremCallbackComponent,
    events: {
      onAction: 'onCallbackAction',
    },
  },
  {
    key: 'nativeClick',
    component: AiNativeClickSurfaceComponent,
    events: {
      click: 'onNativeClick',
    },
  },
  {
    key: 'modelBridge',
    component: AiModelBridgeDemoComponent,
    events: {
      ngModelChange: 'onModelChange',
    },
  },
];

const SHOWCASE_REGISTRY_VIEW = [
  {
    key: 'card',
    component: 'AiCardComponent',
    events: {
      cardClick: 'onCardClick',
    },
    contentSlots: ['header', '', 'footer'],
  },
  {
    key: 'questionnaire',
    component: 'AiQuestionnaireComponent',
    events: {
      answerSubmit: 'onAnswerSubmit',
      completed: 'onQuestionnaireCompleted',
    },
  },
  {
    key: 'humanFeedback',
    component: 'AiHumanFeedbackComponent',
    events: {
      confirmed: 'onConfirmed',
      rejected: 'onRejected',
    },
  },
  {
    key: 'callbackInput',
    component: 'AiLoremCallbackComponent',
    events: {
      onAction: 'onCallbackAction',
    },
  },
  {
    key: 'nativeClick',
    component: 'AiNativeClickSurfaceComponent',
    events: {
      click: 'onNativeClick',
    },
  },
  {
    key: 'modelBridge',
    component: 'AiModelBridgeDemoComponent',
    events: {
      ngModelChange: 'onModelChange',
    },
  },
] as const;

const PAYLOAD_ITEMS: readonly PayloadShowcaseItem[] = [
  {
    key: 'card',
    title: 'Card payload with named slots',
    description: 'Projects header/body/footer content into AiCardComponent.',
    renderRequest: {
      component: 'card',
      props: {
        clickable: true,
      },
      content: 'Main body content from payload JSON.',
      slots: {
        header: 'Agent summary',
        footer: 'Source: stream event #42',
      },
    },
  },
  {
    key: 'questionnaire',
    title: 'Output() events payload',
    description: 'Passes complex props into AiQuestionnaireComponent and handles outputs.',
    renderRequest: {
      component: 'questionnaire',
      props: {
        questions: QUESTIONNAIRE_ITEMS,
        allowInput: true,
        multiSelect: false,
      },
    },
  },
  {
    key: 'humanFeedback',
    title: 'Human feedback payload',
    description: 'Renders approval controls and maps confirmed/rejected outputs.',
    renderRequest: {
      component: 'humanFeedback',
      props: {
        text: 'Should we execute deployment plan?',
        approveButtonText: 'Approve',
        cancelButtonText: 'Reject',
      },
    },
  },
  {
    key: 'callbackInput',
    title: 'Callback input bridge payload',
    description: 'Maps events.onAction to callback-style input on a dynamic component.',
    renderRequest: {
      component: 'callbackInput',
      props: {
        buttonText: 'Emit lorem callback payload',
        summary: 'Click to call input callback bound by AiPayloadRendererComponent.',
      },
    },
  },
  {
    key: 'nativeClick',
    title: 'Native host click payload',
    description: 'Uses reserved events.click to subscribe to host native click events.',
    renderRequest: {
      component: 'nativeClick',
      props: {
        label: 'Any click inside this component bubbles to the host listener.',
      },
    },
  },
  {
    key: 'modelBridge',
    title: 'ControlValueAccessor bridge payload',
    description: 'Bridges ngModel and ngModelChange using CVA-style methods.',
    renderRequest: {
      component: 'modelBridge',
      props: {
        label: 'Renderer sets writeValue via ngModel then listens to ngModelChange.',
        ngModel: 'initial payload model',
      },
    },
  },
];

const REGISTRATION_CODE = `const registry: readonly AiPayloadComponentRegistration[] = [
  { key: 'card', component: AiCardComponent, events: { cardClick: 'onCardClick' }, contentSlots: ['header', '', 'footer'] },
  { key: 'questionnaire', component: AiQuestionnaireComponent, events: { answerSubmit: 'onAnswerSubmit', completed: 'onQuestionnaireCompleted' } },
  { key: 'humanFeedback', component: AiHumanFeedbackComponent, events: { confirmed: 'onConfirmed', rejected: 'onRejected' } },
  { key: 'callbackInput', component: AiLoremCallbackComponent, events: { onAction: 'onCallbackAction' } },
  { key: 'nativeClick', component: AiNativeClickSurfaceComponent, events: { click: 'onNativeClick' } },
  { key: 'modelBridge', component: AiModelBridgeDemoComponent, events: { ngModelChange: 'onModelChange' } }
];`;

const EVENT_HANDLERS_CODE = `const eventHandlers = {
  onCardClick: (event: unknown) => console.log('cardClick', event),
  onAnswerSubmit: (answer: unknown) => console.log('answerSubmit', answer),
  onQuestionnaireCompleted: (answers: unknown) => console.log('completed', answers),
  onConfirmed: () => console.log('confirmed'),
  onRejected: () => console.log('rejected'),
  onCallbackAction: (payload: unknown) => console.log('callback-input', payload),
  onNativeClick: (event: unknown) => console.log('native-click', event),
  onModelChange: (value: unknown) => console.log('ngModelChange', value)
};`;

const HOST_BINDING_CODE = `<ai-payload-renderer
  [registry]="registry"
  [renderRequest]="renderRequest"
  [eventHandlers]="eventHandlers"
  [ariaLiveMode]="'polite'"
/>`;

function prettyJson(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

function findPayloadByKey(key: PayloadKey): PayloadShowcaseItem {
  return PAYLOAD_ITEMS.find((item) => item.key === key) ?? PAYLOAD_ITEMS[0];
}

function isAriaLiveMode(value: string): value is AiAriaLiveMode {
  return ARIA_LIVE_OPTIONS.includes(value as AiAriaLiveMode);
}

const meta: Meta = {
  title: 'UI/Renderer',
  component: AiPayloadRendererComponent,
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
    const activePayloadKey = signal<PayloadKey>('card');
    const ariaLiveMode = signal<AiAriaLiveMode>('polite');
    const eventLog = signal<readonly string[]>([]);

    const appendLog = (label: string, payload?: unknown): void => {
      const line = payload === undefined ? label : `${label}: ${prettyJson(payload)}`;
      eventLog.update((existing) => [line, ...existing].slice(0, 8));
    };

    return {
      props: {
        payloadItems: PAYLOAD_ITEMS,
        ariaLiveOptions: ARIA_LIVE_OPTIONS,
        registry: SHOWCASE_REGISTRY,
        registryViewJson: prettyJson(SHOWCASE_REGISTRY_VIEW),
        registrationCode: REGISTRATION_CODE,
        hostBindingCode: HOST_BINDING_CODE,
        eventHandlersCode: EVENT_HANDLERS_CODE,
        activePayloadKey,
        ariaLiveMode,
        eventLog,
        toJson: prettyJson,
        getActiveRenderRequest: () => findPayloadByKey(activePayloadKey()).renderRequest,
        selectPayload: (key: PayloadKey) => {
          activePayloadKey.set(key);
        },
        onAriaLiveModeChange: (event: Event): void => {
          const target = event.target;
          if (!(target instanceof HTMLSelectElement)) {
            return;
          }

          if (isAriaLiveMode(target.value)) {
            ariaLiveMode.set(target.value);
          }
        },
        eventHandlers: {
          onCardClick: (payload: unknown) => {
            appendLog('cardClick', payload);
          },
          onAnswerSubmit: (payload: unknown) => {
            appendLog('answerSubmit', payload);
          },
          onQuestionnaireCompleted: (payload: unknown) => {
            appendLog('completed', payload);
          },
          onConfirmed: () => {
            appendLog('confirmed');
          },
          onRejected: () => {
            appendLog('rejected');
          },
          onCallbackAction: (payload: unknown) => {
            appendLog('callback-input', payload);
          },
          onNativeClick: (payload: unknown) => {
            appendLog('native-click', payload);
          },
          onModelChange: (payload: unknown) => {
            appendLog('ngModelChange', payload);
          },
        },
      },
      template: `
        <style>
          .ai-payload-docs {
            display: grid;
            gap: 1rem;
            color: #0f172a;
          }

          .ai-payload-docs__section {
            border: 1px solid #d1d5db;
            border-radius: 12px;
            padding: 0.875rem;
            background: #ffffff;
          }

          .ai-payload-docs__title {
            margin: 0 0 0.5rem;
            font-size: 1.05rem;
          }

          .ai-payload-docs__lead {
            margin: 0;
            color: #334155;
            line-height: 1.45;
          }

          .ai-payload-docs__layout {
            display: grid;
            grid-template-columns: minmax(320px, 1fr) minmax(340px, 1fr);
            gap: 1rem;
            align-items: start;
          }

          .ai-payload-docs__control-row {
            margin-top: 0.75rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .ai-payload-docs__select {
            min-height: 2.1rem;
            border: 1px solid #94a3b8;
            border-radius: 8px;
            background: #ffffff;
            color: #0f172a;
            padding: 0.3rem 0.5rem;
          }

          .ai-payload-docs__select:focus-visible {
            outline: 2px solid #1d4ed8;
            outline-offset: 2px;
          }

          .ai-payload-docs__code-title {
            margin: 0.75rem 0 0.4rem;
            font-size: 0.9rem;
            color: #0f172a;
          }

          .ai-payload-docs__code {
            margin: 0;
            padding: 0.625rem;
            border-radius: 8px;
            background: #0f172a;
            color: #e2e8f0;
            font: 500 0.75rem/1.4 'Menlo', 'Monaco', monospace;
            white-space: pre-wrap;
          }

          .ai-payload-docs__table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 0.75rem;
          }

          .ai-payload-docs__table th,
          .ai-payload-docs__table td {
            border: 1px solid #d1d5db;
            padding: 0.625rem;
            text-align: left;
            vertical-align: top;
            font-size: 0.9rem;
          }

          .ai-payload-docs__table thead {
            background: #f8fafc;
          }

          .ai-payload-item {
            display: block;
            width: 100%;
            border: 1px solid #cbd5e1;
            border-radius: 10px;
            padding: 0.75rem;
            margin-bottom: 0.75rem;
            text-align: left;
            background: #f8fafc;
            cursor: pointer;
          }

          .ai-payload-item--active {
            border-color: #0f766e;
            background: #ecfeff;
          }

          .ai-payload-item__title {
            display: block;
            font-size: 0.95rem;
            font-weight: 600;
            color: #0f172a;
          }

          .ai-payload-item__description {
            display: block;
            margin-top: 0.25rem;
            margin-bottom: 0.5rem;
            font-size: 0.85rem;
            color: #475569;
          }

          .ai-payload-docs__render-target {
            min-height: 240px;
            margin-bottom: 0.75rem;
            padding: 0.5rem;
            border: 1px dashed #cbd5e1;
            border-radius: 10px;
            background: #f8fafc;
          }

          .ai-payload-docs__event-log {
            margin: 0;
            padding-left: 1rem;
            font: 500 0.8rem/1.35 'Menlo', 'Monaco', monospace;
            color: #1e293b;
          }

          .ai-payload-docs__event-log-empty {
            margin: 0;
            font-size: 0.85rem;
            color: #64748b;
          }

          @media (max-width: 900px) {
            .ai-payload-docs__layout {
              grid-template-columns: 1fr;
            }
          }
        </style>

        <article class="ai-payload-docs" aria-label="AiPayloadRendererComponent single-page documentation">
          <section class="ai-payload-docs__section" aria-labelledby="ai-payload-intro">
            <h2 id="ai-payload-intro" class="ai-payload-docs__title">AiPayloadRendererComponent</h2>
            <pre class="ai-payload-docs__code"><code>import &#123;AiPayloadRendererComponent&#125; from '@ai-cdk/ui';</code></pre>
            <p class="ai-payload-docs__lead">
              AiPayloadRendererComponent resolves protocol payloads to registered components and bridges
              outputs, callback inputs, native click events, and CVA-style ngModel updates.
            </p>
            <div class="ai-payload-docs__control-row">
              <label for="ai-payload-aria-live">aria-live mode</label>
              <select
                id="ai-payload-aria-live"
                class="ai-payload-docs__select"
                [value]="ariaLiveMode()"
                (change)="onAriaLiveModeChange($event)"
              >
                @for (option of ariaLiveOptions; track option) {
                  <option [value]="option">{{ option }}</option>
                }
              </select>
            </div>
            <h3 class="ai-payload-docs__code-title">Registry snapshot</h3>
            <pre class="ai-payload-docs__code">{{ registryViewJson }}</pre>
          </section>

          <section class="ai-payload-docs__section" aria-labelledby="ai-payload-reference">
            <h2 id="ai-payload-reference" class="ai-payload-docs__title">Technical reference</h2>
            <table class="ai-payload-docs__table">
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
                  <td><code>renderRequest</code></td>
                  <td><code>AiPayloadRenderRequest</code></td>
                  <td>required</td>
                  <td>JSON request that declares which component and props to render.</td>
                </tr>
                <tr>
                  <td>Input</td>
                  <td><code>registry</code></td>
                  <td><code>readonly AiPayloadComponentRegistration[]</code></td>
                  <td>required</td>
                  <td>Maps payload keys to Angular components and event bridges.</td>
                </tr>
                <tr>
                  <td>Input</td>
                  <td><code>eventHandlers</code></td>
                  <td><code>AiPayloadEventHandlerMap</code></td>
                  <td><code>&#123;&#125;</code></td>
                  <td>External handlers referenced by registry event map values.</td>
                </tr>
                <tr>
                  <td>Input</td>
                  <td><code>ariaLiveMode</code></td>
                  <td><code>'off' | 'polite' | 'assertive'</code></td>
                  <td><code>'off'</code></td>
                  <td>Controls aria-live politeness mode on renderer host.</td>
                </tr>
              </tbody>
            </table>
          </section>

          <div class="ai-payload-docs__layout">
            <aside class="ai-payload-docs__section" aria-label="Payload catalog">
              <h2 class="ai-payload-docs__title">Payload catalog (JSON)</h2>
              @for (item of payloadItems; track item.key) {
                <button
                  type="button"
                  class="ai-payload-item"
                  [class.ai-payload-item--active]="item.key === activePayloadKey()"
                  [attr.aria-pressed]="item.key === activePayloadKey()"
                  (click)="selectPayload(item.key)"
                >
                  <span class="ai-payload-item__title">{{ item.title }}</span>
                  <span class="ai-payload-item__description">{{ item.description }}</span>
                  <pre class="ai-payload-docs__code">{{ toJson(item.renderRequest) }}</pre>
                </button>
              }
            </aside>

            <section class="ai-payload-docs__section" aria-label="Live renderer output">
              <h2 class="ai-payload-docs__title">Live renderer output</h2>

              <div class="ai-payload-docs__render-target">
                <ai-payload-renderer
                  [registry]="registry"
                  [renderRequest]="getActiveRenderRequest()"
                  [eventHandlers]="eventHandlers"
                  [ariaLiveMode]="ariaLiveMode()"
                ></ai-payload-renderer>
              </div>

              <h3 class="ai-payload-docs__title">Event log</h3>
              @if (eventLog().length === 0) {
                <p class="ai-payload-docs__event-log-empty">No events yet. Interact with the rendered component.</p>
              } @else {
                <ol class="ai-payload-docs__event-log">
                  @for (entry of eventLog(); track entry) {
                    <li>{{ entry }}</li>
                  }
                </ol>
              }
            </section>
          </div>

          <section class="ai-payload-docs__section" aria-labelledby="ai-payload-snippets">
            <h2 id="ai-payload-snippets" class="ai-payload-docs__title">Consumer setup snippets</h2>
            <h3 class="ai-payload-docs__code-title">Registry</h3>
            <pre class="ai-payload-docs__code">{{ registrationCode }}</pre>
            <h3 class="ai-payload-docs__code-title">Event handlers map</h3>
            <pre class="ai-payload-docs__code">{{ eventHandlersCode }}</pre>
            <h3 class="ai-payload-docs__code-title">Host usage</h3>
            <pre class="ai-payload-docs__code">{{ hostBindingCode }}</pre>
          </section>
        </article>
      `,
    };
  },
};
