import { AiCardComponent } from '@ai-cdk/ui/Card';
import { AiHumanFeedbackComponent } from '@ai-cdk/ui/HumanFeedback';
import { AiQuestion, AiQuestionnaireComponent } from '@ai-cdk/ui/Questionnaire';
import {
  AiPayloadComponentRegistration,
  AiPayloadRenderRequest,
  AiPayloadRendererComponent,
} from '@ai-cdk/ui/Renderer';
import { signal } from '@angular/core';
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
            font-family: 'Manrope', 'Avenir Next', 'Segoe UI', sans-serif;
            display: grid;
            gap: 1rem;
            color: #10233f;
            font-size: 0.95rem;
            line-height: 1.55;
          }

          .ai-payload-docs__section {
            border: 1px solid #d5e2f3;
            border-radius: 16px;
            padding: 1.1rem;
            background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
            box-shadow: 0 8px 20px rgba(15, 23, 42, 0.04);
          }

          .ai-payload-docs__title {
            margin: 0 0 0.5rem;
            font-size: 1.24rem;
            line-height: 1.3;
            color: #0b1f3a;
            letter-spacing: 0.01em;
          }

          .ai-payload-docs__subtitle {
            margin: 0.75rem 0 0.4rem;
            font-size: 1.02rem;
            line-height: 1.4;
            color: #11365e;
          }

          .ai-payload-docs__lead {
            margin: 0;
            color: #2a3f5e;
            line-height: 1.5;
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
            border: 1px solid #8ca8c8;
            border-radius: 8px;
            background: #ffffff;
            color: #0f2746;
            padding: 0.3rem 0.5rem;
          }

          .ai-payload-docs__select:focus-visible {
            outline: 2px solid #0f4ea0;
            outline-offset: 2px;
          }

          .ai-payload-docs__code {
            margin: 0;
            padding: 0.8rem 0.85rem;
            border-radius: 12px;
            border: 1px solid #22324b;
            background: #0f1a2c;
            color: #d7e5ff;
            font: 500 0.79rem/1.5 'JetBrains Mono', 'SFMono-Regular', 'Menlo', monospace;
            white-space: pre-wrap;
          }

          .ai-payload-docs__table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 0.75rem;
            font-size: 0.88rem;
          }

          .ai-payload-docs__table th,
          .ai-payload-docs__table td {
            border: 1px solid #ccdaea;
            padding: 0.6rem;
            text-align: left;
            vertical-align: top;
          }

          .ai-payload-docs__table thead {
            background: #edf5ff;
            color: #0f355f;
          }

          .ai-payload-docs__notes {
            margin: 0.75rem 0 0;
            padding-left: 1.1rem;
            color: #274667;
          }

          .ai-payload-docs__notes li + li {
            margin-top: 0.3rem;
          }

          .ai-payload-item {
            display: block;
            width: 100%;
            border: 1px solid #c7d8ec;
            border-radius: 12px;
            padding: 0.75rem;
            margin-bottom: 0.75rem;
            text-align: left;
            background: #f3f8ff;
            cursor: pointer;
          }

          .ai-payload-item--active {
            border-color: #1d4ed8;
            background: #e6f0ff;
          }

          .ai-payload-item__title {
            display: block;
            font-size: 0.95rem;
            font-weight: 600;
            color: #0f2746;
          }

          .ai-payload-item__description {
            display: block;
            margin-top: 0.25rem;
            margin-bottom: 0.5rem;
            font-size: 0.85rem;
            color: #355a80;
          }

          .ai-payload-docs__preview {
            border: 1px dashed #b9cbe3;
            border-radius: 12px;
            background: #f3f8ff;
            padding: 0.75rem;
          }

          .ai-payload-docs__event-panel {
            margin-top: 0.9rem;
            border: 1px solid #cad9ed;
            border-radius: 12px;
            background: #f7fbff;
            padding: 0.75rem;
          }

          .ai-payload-docs__event-log {
            margin: 0;
            padding-left: 1rem;
            font: 500 0.8rem/1.45 'JetBrains Mono', 'SFMono-Regular', 'Menlo', monospace;
            color: #0f2746;
          }

          .ai-payload-docs__event-log-empty {
            margin: 0;
            font-size: 0.85rem;
            color: #355174;
          }

          .ai-payload-docs__tokens-empty {
            margin: 0;
            border: 1px dashed #b9cbe3;
            border-radius: 12px;
            background: #f3f8ff;
            padding: 0.75rem;
            color: #274a74;
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
            <p class="ai-payload-docs__lead">
              AiPayloadRendererComponent resolves protocol payloads to registered components and bridges
              outputs, callback inputs, native click events, and CVA-style ngModel updates. 
              Not only ai-cdk components but any other angular components can be used with this renderer.
            </p>
            <pre class="ai-payload-docs__code"><code>import &#123; AiPayloadRendererComponent &#125; from '@ai-cdk/ui/Renderer';</code></pre>
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
            <ul class="ai-payload-docs__notes">
              <li>Supports output event mapping, callback-input mapping, native click mapping, and CVA bridging.</li>
              <li>Supports content projection with or without named slots using <code>contentSlots</code>.</li>
              <li>Unknown payload keys are skipped and reported in console diagnostics.</li>
            </ul>
          </section>

          <section class="ai-payload-docs__section" aria-labelledby="ai-payload-default">
            <h2 id="ai-payload-default" class="ai-payload-docs__title">Default showcase</h2>
            <p class="ai-payload-docs__lead">Default live preview using the currently selected payload and handler map.</p>

            <div class="ai-payload-docs__control-row">
              <label for="ai-payload-aria-live">ARIA live mode</label>
              <select
                id="ai-payload-aria-live"
                class="ai-payload-docs__select"
                [value]="ariaLiveMode()"
                (change)="onAriaLiveModeChange($event)"
              >
                @for (mode of ariaLiveOptions; track mode) {
                  <option [value]="mode">{{ mode }}</option>
                }
              </select>
            </div>

            <div class="ai-payload-docs__preview">
              <ai-payload-renderer
                [registry]="registry"
                [renderRequest]="getActiveRenderRequest()"
                [eventHandlers]="eventHandlers"
                [ariaLiveMode]="ariaLiveMode()"
              ></ai-payload-renderer>
            </div>

            <h3 class="ai-payload-docs__subtitle">Usage snippets</h3>
            <pre class="ai-payload-docs__code">{{ registrationCode }}</pre>
            <pre class="ai-payload-docs__code">{{ eventHandlersCode }}</pre>
            <pre class="ai-payload-docs__code">{{ hostBindingCode }}</pre>

            <div class="ai-payload-docs__event-panel" aria-live="polite">
              <h3 class="ai-payload-docs__subtitle">Event log</h3>
              @if (eventLog().length === 0) {
                <p class="ai-payload-docs__event-log-empty">No events yet. Interact with the rendered component.</p>
              } @else {
                <ol class="ai-payload-docs__event-log">
                  @for (entry of eventLog(); track entry) {
                    <li>{{ entry }}</li>
                  }
                </ol>
              }
            </div>
          </section>

          <section class="ai-payload-docs__section" aria-labelledby="ai-payload-variants">
            <h2 id="ai-payload-variants" class="ai-payload-docs__title">Examples</h2>
            <p class="ai-payload-docs__lead">
            Preview-only payload variants rendered through the same dynamic host.
            </p>

            <div class="ai-payload-docs__layout">
              <aside aria-label="Payload catalog">
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

              <div class="ai-payload-docs__preview" aria-label="Variant renderer output">
                <ai-payload-renderer
                  [registry]="registry"
                  [renderRequest]="getActiveRenderRequest()"
                  [eventHandlers]="eventHandlers"
                  [ariaLiveMode]="ariaLiveMode()"
                ></ai-payload-renderer>
              </div>
            </div>
          </section>

          <section class="ai-payload-docs__section" aria-labelledby="ai-payload-tokens">
            <h2 id="ai-payload-tokens" class="ai-payload-docs__title">Style tokens playground</h2>
            <p class="ai-payload-docs__tokens-empty">
              AiPayloadRendererComponent does not expose public CSS custom properties today. Styling is controlled
              by rendered target components and their own token APIs.
            </p>
          </section>
        </article>
      `,
    };
  },
};
