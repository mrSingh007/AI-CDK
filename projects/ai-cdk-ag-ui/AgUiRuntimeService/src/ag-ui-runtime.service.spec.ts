import { TestBed } from '@angular/core/testing';
import type {
  AgentStateMutation,
  AgentSubscriber,
  Message,
  RunAgentParameters,
  State,
} from '@ag-ui/client';
import { AgUiRuntimeService } from './ag-ui-runtime.service';
import type {
  AgentMessage,
  AgentRenderMessagePart,
  AgentRuntime,
  AgentTool,
} from './agent.type';

interface Deferred<T> {
  promise: Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: unknown) => void;
}

interface MockRunContext {
  readonly parameters: RunAgentParameters | undefined;
  readonly runtime: MockRuntime;
  readonly subscriber: AgentSubscriber | undefined;
}

type MockRunHandler = (context: MockRunContext) => Promise<void> | void;

class MockRuntime implements AgentRuntime {
  messages: Message[] = [];
  state: State = {};
  headers: Record<string, string> = {};

  readonly setMessagesCalls: Message[][] = [];
  readonly setStateCalls: State[] = [];
  readonly setHeadersCalls: Record<string, string>[] = [];
  readonly parametersHistory: (RunAgentParameters | undefined)[] = [];

  abortCalls = 0;

  private readonly runHandlers: MockRunHandler[] = [];

  enqueueRun(handler: MockRunHandler): void {
    this.runHandlers.push(handler);
  }

  setMessages(messages: Message[]): void {
    this.messages = cloneMessages(messages);
    this.setMessagesCalls.push(cloneMessages(messages));
  }

  setState(state: State): void {
    this.state = cloneState(state);
    this.setStateCalls.push(cloneState(state));
  }

  setHeaders(headers: Record<string, string>): void {
    this.headers = { ...headers };
    this.setHeadersCalls.push({ ...headers });
  }

  async runAgent(parameters?: RunAgentParameters, subscriber?: AgentSubscriber): Promise<void> {
    this.parametersHistory.push(parameters);
    const handler = this.runHandlers.shift();
    if (!handler) {
      return;
    }

    await handler({
      parameters,
      runtime: this,
      subscriber,
    });
  }

  abortRun(): void {
    this.abortCalls += 1;
  }

  async emitRunStarted(
    subscriber: AgentSubscriber | undefined,
    parameters: RunAgentParameters | undefined,
    event: unknown,
  ): Promise<void> {
    await this.applyMutation(
      (await (subscriber?.onRunStartedEvent as ((value: unknown) => unknown) | undefined)?.(
        this.buildContext(parameters, event),
      )) as AgentStateMutation | void,
    );
  }

  async emitTextMessageStart(
    subscriber: AgentSubscriber | undefined,
    parameters: RunAgentParameters | undefined,
    event: unknown,
  ): Promise<void> {
    await this.applyMutation(
      (await (subscriber?.onTextMessageStartEvent as ((value: unknown) => unknown) | undefined)?.(
        this.buildContext(parameters, event),
      )) as AgentStateMutation | void,
    );
  }

  async emitTextMessageContent(
    subscriber: AgentSubscriber | undefined,
    parameters: RunAgentParameters | undefined,
    event: unknown,
  ): Promise<void> {
    await this.applyMutation(
      (await (
        subscriber?.onTextMessageContentEvent as ((value: unknown) => unknown) | undefined
      )?.({
        ...this.buildContext(parameters, event),
        textMessageBuffer: '',
      })) as AgentStateMutation | void,
    );
  }

  async emitTextMessageEnd(
    subscriber: AgentSubscriber | undefined,
    parameters: RunAgentParameters | undefined,
    event: unknown,
  ): Promise<void> {
    await this.applyMutation(
      (await (subscriber?.onTextMessageEndEvent as ((value: unknown) => unknown) | undefined)?.({
        ...this.buildContext(parameters, event),
        textMessageBuffer: '',
      })) as AgentStateMutation | void,
    );
  }

  async emitToolCallStart(
    subscriber: AgentSubscriber | undefined,
    parameters: RunAgentParameters | undefined,
    event: unknown,
  ): Promise<void> {
    await this.applyMutation(
      (await (subscriber?.onToolCallStartEvent as ((value: unknown) => unknown) | undefined)?.(
        this.buildContext(parameters, event),
      )) as AgentStateMutation | void,
    );
  }

  async emitToolCallArgs(
    subscriber: AgentSubscriber | undefined,
    parameters: RunAgentParameters | undefined,
    event: unknown,
  ): Promise<void> {
    await this.applyMutation(
      (await (subscriber?.onToolCallArgsEvent as ((value: unknown) => unknown) | undefined)?.({
        ...this.buildContext(parameters, event),
        partialToolCallArgs: {},
        toolCallBuffer: '',
        toolCallName: '',
      })) as AgentStateMutation | void,
    );
  }

  async emitToolCallEnd(
    subscriber: AgentSubscriber | undefined,
    parameters: RunAgentParameters | undefined,
    event: unknown,
    toolCallArgs: Record<string, unknown>,
  ): Promise<void> {
    await this.applyMutation(
      (await (subscriber?.onToolCallEndEvent as ((value: unknown) => unknown) | undefined)?.({
        ...this.buildContext(parameters, event),
        toolCallArgs,
        toolCallName: '',
      })) as AgentStateMutation | void,
    );
  }

  async emitToolCallResult(
    subscriber: AgentSubscriber | undefined,
    parameters: RunAgentParameters | undefined,
    event: unknown,
  ): Promise<void> {
    await this.applyMutation(
      (await (subscriber?.onToolCallResultEvent as ((value: unknown) => unknown) | undefined)?.(
        this.buildContext(parameters, event),
      )) as AgentStateMutation | void,
    );
  }

  async emitStateSnapshot(
    subscriber: AgentSubscriber | undefined,
    parameters: RunAgentParameters | undefined,
    event: unknown,
  ): Promise<void> {
    await this.applyMutation(
      (await (subscriber?.onStateSnapshotEvent as ((value: unknown) => unknown) | undefined)?.(
        this.buildContext(parameters, event),
      )) as AgentStateMutation | void,
    );
  }

  async emitRunFinished(
    subscriber: AgentSubscriber | undefined,
    parameters: RunAgentParameters | undefined,
    event: unknown,
  ): Promise<void> {
    await this.applyMutation(
      (await (subscriber?.onRunFinishedEvent as ((value: unknown) => unknown) | undefined)?.({
        ...this.buildContext(parameters, event),
        result: undefined,
      })) as AgentStateMutation | void,
    );
  }

  async emitRunError(
    subscriber: AgentSubscriber | undefined,
    parameters: RunAgentParameters | undefined,
    event: unknown,
  ): Promise<void> {
    await this.applyMutation(
      (await (subscriber?.onRunErrorEvent as ((value: unknown) => unknown) | undefined)?.(
        this.buildContext(parameters, event),
      )) as AgentStateMutation | void,
    );
  }

  private async applyMutation(mutation: AgentStateMutation | void): Promise<void> {
    if (!mutation) {
      return;
    }

    if (mutation.messages) {
      this.messages = cloneMessages(mutation.messages);
    }

    if (mutation.state) {
      this.state = cloneState(mutation.state);
    }
  }

  private buildContext(
    parameters: RunAgentParameters | undefined,
    event: unknown,
  ): {
    agent: unknown;
    event: unknown;
    input: unknown;
    messages: Message[];
    state: State;
  } {
    return {
      agent: {} as object,
      event,
      input: {
        messages: this.messages,
        threadId: 'mock-thread',
        ...parameters,
      },
      messages: this.messages,
      state: this.state,
    };
  }
}

describe('AgUiRuntimeService', () => {
  let service: AgUiRuntimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AgUiRuntimeService],
    });

    service = TestBed.inject(AgUiRuntimeService);
  });

  it('initializes runtime state, maps initial messages, and clears prior overrides', () => {
    const firstRuntime = new MockRuntime();
    service.initializeAgent({
      headers: () => ({ Authorization: 'Bearer first' }),
      initialState: { phase: 'first' },
      runtime: firstRuntime,
      tools: [],
    });

    service.setHeaders({ 'x-debug': 'enabled' });
    TestBed.flushEffects();

    const runtime = new MockRuntime();
    const initialMessages: Message[] = [
      {
        content: 'Previously sent prompt',
        id: 'user-1',
        role: 'user',
      },
      {
        content: '{"ok":true}',
        id: 'tool-message',
        role: 'tool',
        toolCallId: 'tool-1',
      },
    ];

    service.initializeAgent({
      headers: () => ({ Authorization: 'Bearer second', 'x-trace-id': 'trace-42' }),
      initialMessages,
      initialState: { cards: [{ title: 'Existing', note: 'Seeded from init' }] },
      runtime,
      tools: [],
    });
    TestBed.flushEffects();

    expect(runtime.setMessagesCalls.at(-1)).toEqual(initialMessages);
    expect(runtime.setStateCalls.at(-1)).toEqual({
      cards: [{ note: 'Seeded from init', title: 'Existing' }],
    });
    expect(runtime.setHeadersCalls.at(-1)).toEqual({
      Authorization: 'Bearer second',
      'x-trace-id': 'trace-42',
    });
    expect(service.headers()).toEqual({
      Authorization: 'Bearer second',
      'x-trace-id': 'trace-42',
    });
    expect(service.appState()).toEqual({
      cards: [{ note: 'Seeded from init', title: 'Existing' }],
    });
    expect(service.messages()).toEqual([
      {
        createdAt: expect.any(Number),
        id: 'user-1',
        parts: [{ text: 'Previously sent prompt', type: 'text' }],
        role: 'user',
        status: 'complete',
      },
      {
        createdAt: expect.any(Number),
        id: 'tool:tool-1',
        parts: [
          {
            result: { ok: true },
            toolCallId: 'tool-1',
            toolName: 'tool',
            type: 'tool-result',
          },
        ],
        role: 'tool',
        status: 'complete',
      },
    ]);
  });

  it('throws when sendMessage is called before initializeAgent', async () => {
    await expect(
      service.sendMessage({
        parts: [{ text: 'Hello', type: 'text' }],
        role: 'user',
      }),
    ).rejects.toThrow('AgUiRuntimeService not initialized');
  });

  it('rejects concurrent sendMessage calls while a run is active', async () => {
    const runtime = new MockRuntime();
    const deferred = createDeferred<void>();

    runtime.enqueueRun(async () => {
      await deferred.promise;
    });

    service.initializeAgent({
      runtime,
      tools: [],
    });

    const firstRun = service.sendMessage({
      parts: [{ text: 'First request', type: 'text' }],
      role: 'user',
    });

    expect(service.isStreaming()).toBe(true);

    await expect(
      service.sendMessage({
        parts: [{ text: 'Second request', type: 'text' }],
        role: 'user',
      }),
    ).rejects.toThrow('already processing');

    deferred.resolve();
    await firstRun;
    expect(service.isStreaming()).toBe(false);
  });

  it('maps text events and state snapshots into public signals', async () => {
    const runtime = new MockRuntime();

    runtime.enqueueRun(async ({ parameters, runtime: activeRuntime, subscriber }) => {
      await activeRuntime.emitRunStarted(subscriber, parameters, { runId: 'run-text' });
      await activeRuntime.emitTextMessageStart(subscriber, parameters, {
        messageId: 'assistant-1',
        role: 'assistant',
      });
      await activeRuntime.emitTextMessageContent(subscriber, parameters, {
        delta: 'Hello',
        messageId: 'assistant-1',
      });
      await activeRuntime.emitTextMessageContent(subscriber, parameters, {
        delta: ' world',
        messageId: 'assistant-1',
      });
      await activeRuntime.emitStateSnapshot(subscriber, parameters, {
        snapshot: { cards: [{ title: 'Synced', note: 'From state snapshot' }] },
      });
      await activeRuntime.emitTextMessageEnd(subscriber, parameters, {
        messageId: 'assistant-1',
      });
      await activeRuntime.emitRunFinished(subscriber, parameters, { runId: 'run-text' });
    });

    service.initializeAgent({
      runtime,
      tools: [],
    });

    await service.sendMessage({
      parts: [{ text: 'Hi backend', type: 'text' }],
      role: 'user',
    });

    expect(service.isStreaming()).toBe(false);
    expect(service.appState()).toEqual({
      cards: [{ note: 'From state snapshot', title: 'Synced' }],
    });

    const assistantMessage = service.messages().find((message) => message.id === 'assistant-1');
    expect(assistantMessage).toEqual({
      createdAt: expect.any(Number),
      id: 'assistant-1',
      parts: [{ text: 'Hello world', type: 'text' }],
      role: 'assistant',
      runId: 'run-text',
      status: 'complete',
    });
  });

  it('renders inline frontend tools and runs a continuation pass', async () => {
    const runtime = new MockRuntime();
    const toolRender = vi.fn<AgentTool['render']>(async (_args, ctx) => {
      ctx.renderComponent({
        props: {
          text: 'Inline render from a frontend tool.',
        },
      });

      return {
        content: {
          rendered: true,
        },
      };
    });

    runtime.enqueueRun(async ({ parameters, runtime: activeRuntime, subscriber }) => {
      await activeRuntime.emitRunStarted(subscriber, parameters, { runId: 'run-inline' });
      await activeRuntime.emitToolCallStart(subscriber, parameters, {
        parentMessageId: 'assistant-inline',
        toolCallId: 'tool-inline',
        toolCallName: 'ui_request_confirmation',
      });
      await activeRuntime.emitToolCallArgs(subscriber, parameters, {
        delta: '{"text":"Inline render from a frontend tool."}',
        toolCallId: 'tool-inline',
      });
      await activeRuntime.emitToolCallEnd(
        subscriber,
        parameters,
        { toolCallId: 'tool-inline' },
        { text: 'Inline render from a frontend tool.' },
      );
      await activeRuntime.emitRunFinished(subscriber, parameters, { runId: 'run-inline' });
    });

    runtime.enqueueRun(async ({ parameters, runtime: activeRuntime, subscriber }) => {
      await activeRuntime.emitRunStarted(subscriber, parameters, { runId: 'run-inline-cont' });
      await activeRuntime.emitRunFinished(subscriber, parameters, { runId: 'run-inline-cont' });
    });

    service.initializeAgent({
      runtime,
      tools: [
        {
          description: 'Render an inline confirmation component.',
          name: 'ui_request_confirmation',
          parameters: { type: 'object' },
          render: toolRender,
        },
      ],
    });

    await service.sendMessage({
      parts: [{ text: 'Trigger inline tool', type: 'text' }],
      role: 'user',
    });

    expect(toolRender).toHaveBeenCalledTimes(1);
    expect(runtime.parametersHistory).toHaveLength(2);
    expect(runtime.parametersHistory[1]).toEqual({
      tools: [
        {
          description: 'Render an inline confirmation component.',
          name: 'ui_request_confirmation',
          parameters: { type: 'object' },
        },
      ],
    });

    const assistantMessage = service.messages().find((message) => message.id === 'assistant-inline');
    expect(assistantMessage?.parts).toContainEqual({
      args: { text: 'Inline render from a frontend tool.' },
      argsText: '{"text":"Inline render from a frontend tool."}',
      state: 'complete',
      toolCallId: 'tool-inline',
      toolName: 'ui_request_confirmation',
      type: 'tool-call',
    });

    const toolMessage = service.messages().find((message) => message.id === 'tool:tool-inline');
    expect(toolMessage?.status).toBe('complete');
    expect(toolMessage?.parts).toContainEqual({
      interactionId: expect.any(String),
      mode: 'inline',
      request: {
        content: undefined,
        name: 'ui_request_confirmation',
        props: {
          text: 'Inline render from a frontend tool.',
        },
        slots: undefined,
      },
      state: 'rendered',
      toolCallId: 'tool-inline',
      toolName: 'ui_request_confirmation',
      type: 'render',
    });
    expect(toolMessage?.parts).toContainEqual({
      result: { rendered: true },
      toolCallId: 'tool-inline',
      toolName: 'ui_request_confirmation',
      type: 'tool-result',
    });
  });

  it('waits for resolveInteraction, appends the optional user message, and resumes the run', async () => {
    const runtime = new MockRuntime();

    runtime.enqueueRun(async ({ parameters, runtime: activeRuntime, subscriber }) => {
      await activeRuntime.emitRunStarted(subscriber, parameters, { runId: 'run-wait' });
      await activeRuntime.emitToolCallStart(subscriber, parameters, {
        parentMessageId: 'assistant-waiting',
        toolCallId: 'tool-waiting',
        toolCallName: 'ui_request_confirmation',
      });
      await activeRuntime.emitToolCallEnd(subscriber, parameters, { toolCallId: 'tool-waiting' }, {});
      await activeRuntime.emitRunFinished(subscriber, parameters, { runId: 'run-wait' });
    });

    runtime.enqueueRun(async ({ parameters, runtime: activeRuntime, subscriber }) => {
      await activeRuntime.emitRunStarted(subscriber, parameters, { runId: 'run-wait-cont' });
      await activeRuntime.emitTextMessageStart(subscriber, parameters, {
        messageId: 'assistant-after-wait',
        role: 'assistant',
      });
      await activeRuntime.emitTextMessageContent(subscriber, parameters, {
        delta: 'Decision recorded.',
        messageId: 'assistant-after-wait',
      });
      await activeRuntime.emitTextMessageEnd(subscriber, parameters, {
        messageId: 'assistant-after-wait',
      });
      await activeRuntime.emitRunFinished(subscriber, parameters, { runId: 'run-wait-cont' });
    });

    service.initializeAgent({
      runtime,
      tools: [
        {
          description: 'Wait for a confirmation before continuing.',
          name: 'ui_request_confirmation',
          parameters: { type: 'object' },
          render: async (_args, ctx) => {
            const response = await ctx.renderAndWait({
              props: {
                approveButtonText: 'Approve',
                cancelButtonText: 'Reject',
                text: 'Continue?',
              },
            });

            return {
              content: { response },
            };
          },
        },
      ],
    });

    const sendPromise = service.sendMessage({
      parts: [{ text: 'Need confirmation', type: 'text' }],
      role: 'user',
    });

    await waitForCondition(() => service.isAwaitingHumanFeedback());

    const waitingRender = findRenderPart(service.messages(), 'tool:tool-waiting');

    service.resolveInteraction(waitingRender.interactionId, 'Confirmed', {
      userMessage: {
        parts: [{ text: 'Approved in UI', type: 'text' }],
        role: 'user',
      },
    });

    await sendPromise;

    expect(service.isAwaitingHumanFeedback()).toBe(false);

    const toolMessage = service.messages().find((message) => message.id === 'tool:tool-waiting');
    expect(toolMessage?.status).toBe('complete');
    expect(findRenderPart(service.messages(), 'tool:tool-waiting')).toEqual({
      ...waitingRender,
      response: 'Confirmed',
      state: 'resolved',
    });
    expect(toolMessage?.parts).toContainEqual({
      result: { response: 'Confirmed' },
      toolCallId: 'tool-waiting',
      toolName: 'ui_request_confirmation',
      type: 'tool-result',
    });
    expect(service.messages()).toContainEqual({
      createdAt: expect.any(Number),
      id: expect.any(String),
      parts: [{ text: 'Approved in UI', type: 'text' }],
      role: 'user',
      status: 'complete',
    });
    expect(service.messages()).toContainEqual({
      createdAt: expect.any(Number),
      id: 'assistant-after-wait',
      parts: [{ text: 'Decision recorded.', type: 'text' }],
      role: 'assistant',
      runId: 'run-wait-cont',
      status: 'complete',
    });
  });

  it('recomputes headers and updates shared state through public methods', () => {
    const runtime = new MockRuntime();

    service.initializeAgent({
      headers: () => ({
        Authorization: 'Bearer original',
        'x-base': 'base-header',
      }),
      runtime,
      tools: [],
    });
    TestBed.flushEffects();

    service.setHeaders({
      Authorization: null,
      'x-extra': 'extra-header',
    });
    TestBed.flushEffects();

    expect(service.headers()).toEqual({
      'x-base': 'base-header',
      'x-extra': 'extra-header',
    });
    expect(runtime.setHeadersCalls.at(-1)).toEqual({
      'x-base': 'base-header',
      'x-extra': 'extra-header',
    });

    service.clearHeaders(['x-extra']);
    TestBed.flushEffects();

    expect(service.headers()).toEqual({
      'x-base': 'base-header',
    });

    service.updateState({
      cards: [{ title: 'Card', note: 'Updated through public API' }],
    });

    expect(service.appState()).toEqual({
      cards: [{ note: 'Updated through public API', title: 'Card' }],
    });
    expect(runtime.setStateCalls.at(-1)).toEqual({
      cards: [{ note: 'Updated through public API', title: 'Card' }],
    });
  });

  it('cancels waiting interactions and resets back to an uninitialized state', async () => {
    const runtime = new MockRuntime();

    runtime.enqueueRun(async ({ parameters, runtime: activeRuntime, subscriber }) => {
      await activeRuntime.emitRunStarted(subscriber, parameters, { runId: 'run-cancel' });
      await activeRuntime.emitToolCallStart(subscriber, parameters, {
        parentMessageId: 'assistant-cancel',
        toolCallId: 'tool-cancel',
        toolCallName: 'ui_request_confirmation',
      });
      await activeRuntime.emitToolCallEnd(subscriber, parameters, { toolCallId: 'tool-cancel' }, {});
      await activeRuntime.emitRunFinished(subscriber, parameters, { runId: 'run-cancel' });
    });

    runtime.enqueueRun(async ({ parameters, runtime: activeRuntime, subscriber }) => {
      await activeRuntime.emitRunStarted(subscriber, parameters, { runId: 'run-cancel-cont' });
      await activeRuntime.emitRunFinished(subscriber, parameters, { runId: 'run-cancel-cont' });
    });

    service.initializeAgent({
      runtime,
      tools: [
        {
          description: 'Wait for human confirmation.',
          name: 'ui_request_confirmation',
          parameters: { type: 'object' },
          render: async (_args, ctx) => {
            const response = await ctx.renderAndWait({
              props: {
                approveButtonText: 'Approve',
                cancelButtonText: 'Reject',
                text: 'Proceed?',
              },
            });

            return {
              content: { response },
            };
          },
        },
      ],
    });

    const sendPromise = service.sendMessage({
      parts: [{ text: 'Start cancellable request', type: 'text' }],
      role: 'user',
    });

    await waitForCondition(() => service.isAwaitingHumanFeedback());

    service.cancelRequest();
    await sendPromise;

    expect(runtime.abortCalls).toBe(1);
    expect(service.isStreaming()).toBe(false);
    expect(findRenderPart(service.messages(), 'tool:tool-cancel').response).toEqual({
      error: 'cancelled',
    });

    service.reset();

    expect(service.messages()).toEqual([]);
    expect(service.appState()).toEqual({});
    expect(service.headers()).toEqual({});
    expect(service.isStreaming()).toBe(false);

    await expect(
      service.sendMessage({
        parts: [{ text: 'After reset', type: 'text' }],
        role: 'user',
      }),
    ).rejects.toThrow('AgUiRuntimeService not initialized');
  });
});

function createDeferred<T>(): Deferred<T> {
  let resolve!: Deferred<T>['resolve'];
  let reject!: Deferred<T>['reject'];
  const promise = new Promise<T>((promiseResolve, promiseReject) => {
    resolve = promiseResolve;
    reject = promiseReject;
  });

  return {
    promise,
    reject,
    resolve,
  };
}

async function waitForCondition(predicate: () => boolean): Promise<void> {
  for (let attempt = 0; attempt < 25; attempt += 1) {
    if (predicate()) {
      return;
    }

    await Promise.resolve();
  }

  throw new Error('Timed out waiting for condition.');
}

function findRenderPart(messages: readonly AgentMessage[], messageId: string): AgentRenderMessagePart {
  const message = messages.find((candidate) => candidate.id === messageId);
  if (!message) {
    throw new Error(`Message ${messageId} not found.`);
  }

  const renderPart = message.parts.find((part) => part.type === 'render');
  if (!renderPart || renderPart.type !== 'render') {
    throw new Error(`Render part not found for ${messageId}.`);
  }

  return renderPart;
}

function cloneMessages(messages: readonly Message[]): Message[] {
  return [...structuredClone(messages)];
}

function cloneState(state: State): State {
  return structuredClone(state);
}
