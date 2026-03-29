import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { startWith } from 'rxjs';
import { AiHumanFeedbackComponent } from '@ai-cdk/ui/HumanFeedback';
import {
  AiPayloadComponentRegistration,
  AiPayloadEventHandlerMap,
  AiPayloadRendererComponent,
} from '@ai-cdk/ui/Renderer';
import type { State } from '@ag-ui/client';
import { AgUiRuntimeService } from './ag-ui-runtime.service';
import { AgentMessage, AgentMessagePart, AgentRenderMessagePart, AgentTool } from './agent.type';

interface HeaderEntry {
  key: string;
  value: string;
}

interface HeaderRowForm {
  key: FormControl<string>;
  value: FormControl<string>;
}

interface DemoCard {
  title: string;
  note: string;
}

const DEFAULT_BACKEND_URL = 'http://localhost:3000';
const DEFAULT_PROMPT =
  'Ask me to confirm a confirm something and tell me if i confirmed or rejected.';

@Component({
  selector: 'ai-ag-ui-runtime-service-story-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, AiPayloadRendererComponent],
  providers: [AgUiRuntimeService],
  styles: [
    `
      :host {
        display: block;
      }

      .ai-agent-demo {
        display: grid;
        gap: 1rem;
        color: #14263f;
        font-family: 'Manrope', 'Avenir Next', 'Segoe UI', sans-serif;
      }

      .ai-agent-demo__hero {
        border: 1px solid #d6e2ef;
        border-radius: 20px;
        padding: 1.15rem;
        background:
          radial-gradient(circle at top right, rgb(182 219 255 / 45%), transparent 30%),
          linear-gradient(180deg, #ffffff 0%, #f6fbff 100%);
        box-shadow: 0 16px 32px rgb(15 23 42 / 6%);
      }

      .ai-agent-demo__eyebrow {
        margin: 0 0 0.35rem;
        color: #355f8b;
        font-size: 0.8rem;
        font-weight: 800;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }

      .ai-agent-demo__title {
        margin: 0;
        color: #0d2240;
        font-size: clamp(1.7rem, 3vw, 2.35rem);
        line-height: 1.08;
      }

      .ai-agent-demo__lead {
        margin: 0.75rem 0 0;
        max-width: 48rem;
        color: #35506f;
        line-height: 1.6;
      }

      .ai-agent-demo__layout {
        display: grid;
        grid-template-columns: minmax(320px, 0.9fr) minmax(320px, 1.1fr);
        gap: 1rem;
      }

      .ai-agent-demo__panel {
        border: 1px solid #d6e2ef;
        border-radius: 18px;
        padding: 1rem;
        background: linear-gradient(180deg, #ffffff 0%, #f8fbfe 100%);
        box-shadow: 0 10px 24px rgb(15 23 42 / 4%);
      }

      .ai-agent-demo__panel-title {
        margin: 0 0 0.8rem;
        color: #12355b;
        font-size: 1rem;
      }

      .ai-agent-demo__field {
        display: grid;
        gap: 0.4rem;
        margin-bottom: 0.85rem;
      }

      .ai-agent-demo__label {
        color: #48688c;
        font-size: 0.78rem;
        font-weight: 800;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .ai-agent-demo__helper {
        margin: 0 0 0.85rem;
        color: #4d6787;
        font-size: 0.9rem;
        line-height: 1.5;
      }

      .ai-agent-demo__input,
      .ai-agent-demo__textarea {
        width: 100%;
        border: 1px solid #9eb6d0;
        border-radius: 12px;
        background: #ffffff;
        color: #10233f;
        font: inherit;
        padding: 0.8rem 0.9rem;
      }

      .ai-agent-demo__input:focus,
      .ai-agent-demo__textarea:focus,
      .ai-agent-demo__button:focus {
        outline: 2px solid #2875c7;
        outline-offset: 2px;
      }

      .ai-agent-demo__header-list {
        display: grid;
        gap: 0.7rem;
      }

      .ai-agent-demo__header-row {
        display: grid;
        grid-template-columns: minmax(150px, 1fr) minmax(180px, 1.3fr) auto;
        gap: 0.6rem;
        align-items: center;
      }

      .ai-agent-demo__toolbar,
      .ai-agent-demo__actions,
      .ai-agent-demo__status {
        display: flex;
        flex-wrap: wrap;
        gap: 0.65rem;
        align-items: center;
      }

      .ai-agent-demo__toolbar {
        justify-content: space-between;
        margin-bottom: 0.8rem;
      }

      .ai-agent-demo__button {
        border: 1px solid #9bb6d2;
        border-radius: 999px;
        background: #eef6ff;
        color: #13365a;
        cursor: pointer;
        font: inherit;
        font-weight: 700;
        padding: 0.72rem 1rem;
      }

      .ai-agent-demo__button--primary {
        border-color: #155fa7;
        background: linear-gradient(180deg, #1971c2 0%, #155fa7 100%);
        color: #f7fbff;
      }

      .ai-agent-demo__button--compact {
        border-radius: 12px;
        padding: 0.65rem 0.8rem;
      }

      .ai-agent-demo__button:disabled,
      .ai-agent-demo__input:disabled,
      .ai-agent-demo__textarea:disabled {
        cursor: not-allowed;
        opacity: 0.62;
      }

      .ai-agent-demo__status-pill {
        border-radius: 999px;
        background: #eaf3fe;
        color: #1e4f81;
        font-size: 0.82rem;
        font-weight: 700;
        padding: 0.42rem 0.72rem;
      }

      .ai-agent-demo__cards {
        display: grid;
        gap: 0.7rem;
        margin-top: 0.85rem;
      }

      .ai-agent-demo__card {
        border: 1px solid #cfe0f3;
        border-radius: 14px;
        background: #f4f9ff;
        padding: 0.8rem 0.9rem;
      }

      .ai-agent-demo__card-title {
        margin: 0 0 0.35rem;
        color: #103960;
        font-size: 0.95rem;
      }

      .ai-agent-demo__card-note {
        margin: 0;
        color: #3e5c7e;
        font-size: 0.9rem;
        line-height: 1.5;
      }

      .ai-agent-demo__messages {
        display: grid;
        gap: 0.85rem;
      }

      .ai-agent-demo__message {
        border: 1px solid #d5e2ef;
        border-left: 4px solid #7aa6d6;
        border-radius: 16px;
        background: #fcfdff;
        padding: 0.9rem;
      }

      .ai-agent-demo__message--assistant {
        border-left-color: #1f73c7;
      }

      .ai-agent-demo__message--tool {
        border-left-color: #2f8d68;
      }

      .ai-agent-demo__message--user {
        border-left-color: #88631f;
      }

      .ai-agent-demo__message-header,
      .ai-agent-demo__render-meta {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 0.5rem;
        margin-bottom: 0.65rem;
        color: #567392;
        font-size: 0.76rem;
        font-weight: 800;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .ai-agent-demo__parts {
        display: grid;
        gap: 0.75rem;
      }

      .ai-agent-demo__render {
        display: grid;
        gap: 0.7rem;
      }

      .ai-agent-demo__empty {
        margin: 0;
        color: #4a6686;
      }

      .ai-agent-demo__debug-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 0.8rem;
      }

      .ai-agent-demo__debug-card {
        display: grid;
        gap: 0.45rem;
      }

      .ai-agent-demo__code {
        margin: 0;
        overflow: auto;
        border-radius: 14px;
        border: 1px solid #1b2f49;
        background: #0f1b2d;
        color: #d8e6fb;
        padding: 0.85rem;
        font:
          500 0.78rem/1.55 'JetBrains Mono',
          'SFMono-Regular',
          'Menlo',
          monospace;
      }

      @media (max-width: 900px) {
        .ai-agent-demo__layout {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 640px) {
        .ai-agent-demo__header-row {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
  template: `
    <section class="ai-agent-demo" aria-label="AgUiRuntimeService example demo">
      <header class="ai-agent-demo__hero">
        <p class="ai-agent-demo__eyebrow">Interactive Example</p>
        <h2 class="ai-agent-demo__title">Backend-driven AgUiRuntimeService sandbox</h2>
        <p class="ai-agent-demo__lead">
          Point this demo at your AG-UI backend, add request headers, send a prompt, and inspect how
          transcript messages, tool renders, and shared state evolve through the service.
        </p>
      </header>

      <div class="ai-agent-demo__layout">
        <div class="ai-agent-demo__panel">
          <h3 class="ai-agent-demo__panel-title">Connection and prompt</h3>

          <label class="ai-agent-demo__field">
            <span class="ai-agent-demo__label">Backend URL</span>
            <input
              class="ai-agent-demo__input"
              [formControl]="backendUrlControl"
              type="text"
              autocomplete="off"
            />
          </label>

          <label class="ai-agent-demo__field">
            <span class="ai-agent-demo__label">Prompt</span>
            <textarea
              class="ai-agent-demo__textarea"
              [formControl]="promptControl"
              rows="4"
            ></textarea>
          </label>

          <div class="ai-agent-demo__toolbar">
            <span class="ai-agent-demo__label">Request headers</span>
            <button
              class="ai-agent-demo__button ai-agent-demo__button--compact"
              type="button"
              (click)="addHeaderRow()"
            >
              Add header
            </button>
          </div>

          <div class="ai-agent-demo__header-list">
            @for (headerRow of headerRows.controls; track $index) {
              <div class="ai-agent-demo__header-row">
                <input
                  class="ai-agent-demo__input"
                  [formControl]="headerRow.controls.key"
                  type="text"
                  placeholder="Header name"
                />
                <input
                  class="ai-agent-demo__input"
                  [formControl]="headerRow.controls.value"
                  type="text"
                  placeholder="Header value"
                />
                <button
                  class="ai-agent-demo__button ai-agent-demo__button--compact"
                  type="button"
                  (click)="removeHeaderRow($index)"
                  [attr.aria-label]="'Remove header ' + ($index + 1)"
                >
                  Remove
                </button>
              </div>
            }
          </div>

          <p class="ai-agent-demo__helper">
            The demo registers a <code>ui_request_confirmation</code> frontend tool. If your backend
            emits that tool call, the human-feedback UI renders inline and resumes the run when the
            interaction resolves.
          </p>

          <div class="ai-agent-demo__actions">
            <button
              class="ai-agent-demo__button ai-agent-demo__button--primary"
              type="button"
              (click)="connectDemo()"
            >
              Reconnect
            </button>
            <button
              class="ai-agent-demo__button ai-agent-demo__button--primary"
              type="button"
              (click)="sendPrompt()"
              [disabled]="isPromptDisabled()"
            >
              Send prompt
            </button>
            <button class="ai-agent-demo__button" type="button" (click)="cancelRun()">
              Cancel run
            </button>
            <button class="ai-agent-demo__button" type="button" (click)="resetDemo()">
              Reset demo
            </button>
            <button class="ai-agent-demo__button" type="button" (click)="addStateCard()">
              Add shared-state card
            </button>
          </div>

          <div class="ai-agent-demo__status" aria-label="AgUiRuntimeService runtime status">
            <span class="ai-agent-demo__status-pill"
              >streaming: {{ agentService.isStreaming() }}</span
            >
            <span class="ai-agent-demo__status-pill">
              waiting: {{ agentService.isAwaitingHumanFeedback() }}
            </span>
            <span class="ai-agent-demo__status-pill">messages: {{ messages().length }}</span>
          </div>

          <div class="ai-agent-demo__cards">
            @if (cardsState().length === 0) {
              <p class="ai-agent-demo__empty">
                Shared state is empty. Add a card or let a tool do it.
              </p>
            } @else {
              @for (card of cardsState(); track trackCard(card, $index)) {
                <article class="ai-agent-demo__card">
                  <h4 class="ai-agent-demo__card-title">{{ card.title }}</h4>
                  <p class="ai-agent-demo__card-note">{{ card.note }}</p>
                </article>
              }
            }
          </div>
        </div>

        <div class="ai-agent-demo__panel">
          <h3 class="ai-agent-demo__panel-title">Structured timeline</h3>

          @if (messages().length === 0) {
            <p class="ai-agent-demo__empty">
              Connect to a backend and send a prompt to inspect the local message timeline.
            </p>
          } @else {
            <div class="ai-agent-demo__messages">
              @for (message of messages(); track message.id) {
                @if (shouldDisplayMessage(message)) {
                  <article
                    class="ai-agent-demo__message"
                    [class.ai-agent-demo__message--assistant]="message.role === 'assistant'"
                    [class.ai-agent-demo__message--tool]="message.role === 'tool'"
                    [class.ai-agent-demo__message--user]="message.role === 'user'"
                  >
                    <header class="ai-agent-demo__message-header">
                      <span>{{ message.role }}</span>
                      <span>{{ message.status }}</span>
                    </header>

                    <div class="ai-agent-demo__parts">
                      @for (part of message.parts; track $index) {
                        @if (shouldDisplayPart(message, part)) {
                          @if (isRenderPart(part)) {
                            <section class="ai-agent-demo__render">
                              <div class="ai-agent-demo__render-meta">
                                <span>{{ part.toolName }}</span>
                                <span>{{ part.mode }}</span>
                                <span>{{ part.state }}</span>
                              </div>

                              <ai-payload-renderer
                                [ariaLiveMode]="'polite'"
                                [eventHandlers]="getEventHandlers(part)"
                                [registry]="registry"
                                [renderRequest]="part.request"
                              />
                            </section>
                          } @else {
                            <pre class="ai-agent-demo__code">{{ formatPart(part) }}</pre>
                          }
                        }
                      }
                    </div>
                  </article>
                }
              }
            </div>
          }
        </div>
      </div>

      <div class="ai-agent-demo__panel">
        <h3 class="ai-agent-demo__panel-title">Debug state</h3>
        <div class="ai-agent-demo__debug-grid">
          <section class="ai-agent-demo__debug-card" aria-labelledby="ai-agent-demo-headers">
            <span id="ai-agent-demo-headers" class="ai-agent-demo__label">Effective headers</span>
            <pre class="ai-agent-demo__code">{{ toJson(agentService.headers()) }}</pre>
          </section>

          <section class="ai-agent-demo__debug-card" aria-labelledby="ai-agent-demo-state">
            <span id="ai-agent-demo-state" class="ai-agent-demo__label">Shared app state</span>
            <pre class="ai-agent-demo__code">{{ toJson(agentService.appState()) }}</pre>
          </section>
        </div>
      </div>
    </section>
  `,
})
export class AiAgUiRuntimeServiceStoryDemoComponent {
  readonly agentService = inject(AgUiRuntimeService);

  readonly backendUrlControl = new FormControl(DEFAULT_BACKEND_URL, {
    nonNullable: true,
  });
  readonly promptControl = new FormControl(DEFAULT_PROMPT, {
    nonNullable: true,
  });
  readonly headerRows = new FormArray<FormGroup<HeaderRowForm>>([
    this.createHeaderRow('Authorization', 'Bearer demo-token'),
  ]);

  private readonly headerEntries = signal<readonly HeaderEntry[]>(this.readHeaderEntries());
  private readonly interactionHandlerCache = new Map<string, AiPayloadEventHandlerMap>();

  readonly messages = computed(() => this.agentService.messages());
  readonly cardsState: Signal<readonly DemoCard[]> = computed(() =>
    readCards(this.agentService.appState()['cards']),
  );
  readonly isPromptDisabled = computed(
    () => this.agentService.isStreaming() || this.agentService.isAwaitingHumanFeedback(),
  );

  readonly registry: readonly AiPayloadComponentRegistration[] = [
    {
      component: AiHumanFeedbackComponent,
      events: { confirmed: 'onConfirmed', rejected: 'onRejected' },
      key: 'ui_request_confirmation',
    },
  ];

  /**
   * Frontend tools registered with `AgUiRuntimeService`.
   * Accepted values: `readonly AgentTool[]`
   * Default: a single `ui_request_confirmation` example tool
   */
  readonly tools: readonly AgentTool[] = [
    {
      description:
        'Request user confirmation before continuing a risky action and persist the decision into shared state.',
      name: 'ui_request_confirmation',
      parameters: {
        properties: {
          approveButtonText: {
            description: 'Text displayed on the approval action.',
            type: 'string',
          },
          cancelButtonText: {
            description: 'Text displayed on the rejection action.',
            type: 'string',
          },
          text: {
            description: 'Message shown to the user for the confirmation request.',
            type: 'string',
          },
        },
        required: ['text', 'approveButtonText', 'cancelButtonText'],
        type: 'object',
      },
      render: async (args, ctx) => {
        const response = await ctx.renderAndWait({
          props: {
            approveButtonText: toStringValue(args['approveButtonText'], 'Approve'),
            cancelButtonText: toStringValue(args['cancelButtonText'], 'Reject'),
            text: toStringValue(
              args['text'],
              'The backend requested confirmation before continuing.',
            ),
          },
        });

        this.pushStateCard({
          note: `Resolved with ${this.describeResponse(response)}.`,
          title: 'Human feedback result',
        });

        return {
          content: {
            response,
          },
        };
      },
    },
  ];

  constructor() {
    this.headerRows.valueChanges
      .pipe(startWith(this.headerRows.getRawValue()), takeUntilDestroyed())
      .subscribe(() => {
        this.headerEntries.set(this.readHeaderEntries());
      });

    effect(() => {
      const disabled = this.isPromptDisabled();
      if (disabled && this.promptControl.enabled) {
        this.promptControl.disable({ emitEvent: false });
        return;
      }

      if (!disabled && this.promptControl.disabled) {
        this.promptControl.enable({ emitEvent: false });
      }
    });

    this.connectDemo();
  }

  /**
   * Reinitializes the service using the current backend URL and reactive headers.
   *
   * @returns Void. Clears old transient state and reconnects to the configured runtime.
   */
  connectDemo(): void {
    this.interactionHandlerCache.clear();
    this.agentService.initializeAgent({
      headers: () => this.requestHeaders(),
      tools: this.tools,
      url: this.backendUrlControl.getRawValue().trim() || DEFAULT_BACKEND_URL,
    });
  }

  /**
   * Sends the current prompt to the configured backend.
   *
   * @returns Promise that resolves when the backend run has finished.
   */
  async sendPrompt(): Promise<void> {
    if (this.isPromptDisabled()) {
      return;
    }

    const prompt = this.promptControl.getRawValue().trim();
    if (!prompt) {
      return;
    }

    await this.agentService.sendMessage({
      parts: [{ text: prompt, type: 'text' }],
      role: 'user',
    });
  }

  /**
   * Cancels the active run if one is in progress.
   *
   * @returns Void. Pending human-feedback interactions resolve as cancelled.
   */
  cancelRun(): void {
    this.agentService.cancelRequest();
  }

  /**
   * Resets the local service state and reconnects the demo to the current backend URL.
   *
   * @returns Void. The timeline and local interaction cache are cleared.
   */
  resetDemo(): void {
    this.agentService.reset();
    this.connectDemo();
  }

  /**
   * Adds a header row to the editable request header list.
   *
   * @returns Void. The new row starts empty.
   */
  addHeaderRow(): void {
    this.headerRows.push(this.createHeaderRow());
    this.headerEntries.set(this.readHeaderEntries());
  }

  /**
   * Removes a header row from the editable request header list.
   *
   * @param index Zero-based row index.
   * @returns Void. No-op when the index is out of bounds.
   */
  removeHeaderRow(index: number): void {
    if (index < 0 || index >= this.headerRows.length) {
      return;
    }

    this.headerRows.removeAt(index);
    this.headerEntries.set(this.readHeaderEntries());
  }

  /**
   * Adds a demo card to shared app state.
   *
   * @returns Void. The card becomes visible through `cardsState()`.
   */
  addStateCard(): void {
    this.pushStateCard({
      note: 'Written through `updateState()` and read back from `appState()`.',
      title: `Card ${this.cardsState().length + 1}`,
    });
  }

  /**
   * Resolves renderer callbacks for a specific waiting interaction.
   *
   * @param part Render part emitted by a frontend tool.
   * @returns Event handler map consumed by `AiPayloadRendererComponent`.
   */
  getEventHandlers(part: AgentRenderMessagePart): AiPayloadEventHandlerMap {
    const cachedHandlers = this.interactionHandlerCache.get(part.interactionId);
    if (cachedHandlers) {
      return cachedHandlers;
    }

    const handlers: AiPayloadEventHandlerMap = {
      onConfirmed: () => this.agentService.resolveInteraction(part.interactionId, 'Confirmed'),
      onRejected: () => this.agentService.resolveInteraction(part.interactionId, 'Rejected'),
    };

    this.interactionHandlerCache.set(part.interactionId, handlers);
    return handlers;
  }

  /**
   * Determines whether a timeline message should be visible in the transcript panel.
   *
   * @param message Timeline message candidate.
   * @returns True when the message contains user-facing text or render content.
   */
  shouldDisplayMessage(message: AgentMessage): boolean {
    return message.parts.some((part) => this.shouldDisplayPart(message, part));
  }

  /**
   * Determines whether a message part should be rendered in the transcript panel.
   *
   * @param message Parent timeline message.
   * @param part Timeline part candidate.
   * @returns True for text parts and tool render parts.
   */
  shouldDisplayPart(message: AgentMessage, part: AgentMessagePart): boolean {
    if (part.type === 'text') {
      return true;
    }

    if (part.type !== 'render') {
      return false;
    }

    return message.role === 'tool';
  }

  /**
   * Formats a message part for the transcript panel.
   *
   * @param part Timeline part to format.
   * @returns Text content or formatted JSON depending on the part type.
   */
  formatPart(part: AgentMessagePart): string {
    if (part.type === 'text') {
      return part.text;
    }

    return this.toJson(part);
  }

  /**
   * Type guard used by the template to identify render parts.
   *
   * @param part Timeline part candidate.
   * @returns True when the part is a render payload.
   */
  isRenderPart(part: AgentMessagePart): part is AgentRenderMessagePart {
    return part.type === 'render';
  }

  /**
   * Produces a stable tracking key for shared-state cards.
   *
   * @param card Shared-state card.
   * @param index Fallback list index.
   * @returns Stable key for `@for`.
   */
  trackCard(card: DemoCard, index: number): string {
    return `${card.title}:${card.note}:${index}`;
  }

  /**
   * Pretty-prints a value for debug panels.
   *
   * @param value JSON-compatible value to serialize.
   * @returns Formatted JSON or a string fallback.
   */
  toJson(value: unknown): string {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }

  private createHeaderRow(key = '', value = ''): FormGroup<HeaderRowForm> {
    return new FormGroup<HeaderRowForm>({
      key: new FormControl(key, { nonNullable: true }),
      value: new FormControl(value, { nonNullable: true }),
    });
  }

  private readHeaderEntries(): HeaderEntry[] {
    return this.headerRows.controls.map((row) => ({
      key: row.controls.key.getRawValue().trim(),
      value: row.controls.value.getRawValue().trim(),
    }));
  }

  private requestHeaders(): Record<string, string> {
    const headers: Record<string, string> = {};

    for (const entry of this.headerEntries()) {
      if (!entry.key || !entry.value) {
        continue;
      }

      headers[entry.key] = entry.value;
    }

    return headers;
  }

  private pushStateCard(card: DemoCard): void {
    const nextState: State = {
      ...this.agentService.appState(),
      cards: [...this.cardsState(), card],
    };
    this.agentService.updateState(nextState);
  }

  private describeResponse(value: unknown): string {
    return typeof value === 'string' ? value : this.toJson(value);
  }
}

function toStringValue(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim().length > 0 ? value : fallback;
}

function isDemoCard(value: unknown): value is DemoCard {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return typeof candidate['title'] === 'string' && typeof candidate['note'] === 'string';
}

function readCards(value: unknown): DemoCard[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isDemoCard);
}
