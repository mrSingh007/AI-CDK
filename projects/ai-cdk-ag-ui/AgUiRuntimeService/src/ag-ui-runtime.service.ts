import {
  AgentStateMutation,
  AgentSubscriber,
  HttpAgent,
  Message,
  RunAgentParameters,
  RunErrorEvent,
  RunStartedEvent,
  State,
  StateSnapshotEvent,
  TextMessageContentEvent,
  TextMessageEndEvent,
  TextMessageStartEvent,
  ToolCallArgsEvent,
  ToolCallEndEvent,
  ToolCallResultEvent,
  ToolCallStartEvent,
} from '@ag-ui/client';
import { computed, effect, EffectRef, inject, Injectable, Injector, signal } from '@angular/core';
import {
  AgentConfig,
  AgentContext,
  AgentHeadersSource,
  AgentInteractionResolutionOptions,
  AgentMessage,
  AgentMessagePart,
  AgentMessageRole,
  AgentMessageStatus,
  AgentOutboundMessage,
  AgentRenderMessagePart,
  AgentRuntime,
  AgentTool,
  AgentToolCallMessagePart,
  AgentToolResultMessagePart,
  ToolRenderRequest,
} from './agent.type';

interface ActiveToolCall {
  name: string;
  argsText: string;
  args?: Record<string, unknown>;
  parentMessageId: string;
}

interface WaitingInteraction {
  messageId: string;
  resolve: (result: unknown) => void;
}

/**
 * Service for managing AI agent communication and tool execution.
 * Stores a CopilotKit-style local message timeline while keeping a
 * provider-compatible runtime transcript for AG-UI transport calls.
 */
@Injectable({ providedIn: 'root' })
export class AgUiRuntimeService {
  private readonly injector = inject(Injector);

  private runtime: AgentRuntime | null = null;
  private headerSource?: AgentHeadersSource;
  private headerEffectRef: EffectRef | null = null;
  private readonly headerOverrides = signal<Record<string, string | null>>({});
  private readonly tools = new Map<string, AgentTool>();
  private readonly activeToolCalls = new Map<string, ActiveToolCall>();
  private readonly waitingInteractions = new Map<string, WaitingInteraction>();

  private initialized = signal(false);
  private runtimeMessages: Message[] = [];
  private currentRunId: string | undefined;
  private hasPendingFrontendToolResult = false;

  /** Signal containing all conversation messages. */
  readonly messages = signal<AgentMessage[]>([]);
  /** Signal indicating whether the agent is currently streaming a response. */
  readonly isStreaming = signal(false);
  /** Signal containing the latest application state snapshot. */
  readonly appState = signal<State>({});
  /** Signal containing the effective headers used for future requests. */
  readonly headers = computed(() => this.computeHeaders());

  /** Signal indicating whether a frontend tool is waiting for human interaction to continue. */
  readonly isAwaitingHumanFeedback = computed(() =>
    this.messages().some((message) =>
      message.parts.some(
        (part) => part.type === 'render' && part.mode === 'interrupt' && part.state === 'waiting',
      ),
    ),
  );

  /**
   * Initializes the agent service with tools and configuration.
   *
   * @param config Configuration used to initialize the runtime and local timeline.
   * @returns Void. Resets all transient state and prepares the runtime.
   */
  public initializeAgent(config: AgentConfig): void {
    this.destroyHeaderEffect();
    this.cleanupWaitingInteractions({ error: 'cancelled' });

    this.tools.clear();
    for (const tool of config.tools) {
      this.tools.set(tool.name, tool);
    }

    this.runtime = config.runtime ?? new HttpAgentRuntime(config);
    this.headerSource = config.headers;
    this.headerOverrides.set({});
    this.runtimeMessages = [...(config.initialMessages ?? [])];
    this.runtime.setMessages(this.runtimeMessages);

    const initialState = config.initialState ?? {};
    this.appState.set(initialState);
    this.runtime.setState(initialState);

    this.messages.set(this.mapTransportMessages(config.initialMessages ?? []));
    this.isStreaming.set(false);
    this.currentRunId = undefined;
    this.hasPendingFrontendToolResult = false;
    this.activeToolCalls.clear();
    this.waitingInteractions.clear();

    this.headerEffectRef = effect(
      () => {
        this.runtime?.setHeaders(this.headers());
      },
      { injector: this.injector },
    );

    this.initialized.set(true);
  }

  /**
   * Sends a message to the agent and processes the resulting stream.
   *
   * @param message Outbound message to append locally and send to the runtime.
   * @param context Optional AG-UI context items for the run.
   * @param forwardedProps Optional provider-specific forwarded props passed through to the runtime.
   * @returns Promise that resolves after the run and any local continuations finish.
   */
  public async sendMessage(
    message: AgentOutboundMessage,
    context?: AgentContext[],
    forwardedProps?: RunAgentParameters['forwardedProps'],
  ): Promise<void> {
    if (!this.initialized()) {
      throw new Error('AgUiRuntimeService not initialized. Call initializeAgent() first.');
    }

    if (this.isStreaming()) {
      throw new Error('AgUiRuntimeService is already processing a request.');
    }

    if (!this.runtime) {
      throw new Error('Agent runtime is unavailable.');
    }

    const timelineMessage = this.createTimelineMessage(message);
    this.messages.update((messages) => [...messages, timelineMessage]);

    const transportMessage = this.createTransportMessage(message);
    this.runtimeMessages = [...this.runtimeMessages, transportMessage];
    this.runtime.setMessages(this.runtimeMessages);

    this.isStreaming.set(true);
    this.hasPendingFrontendToolResult = false;
    this.currentRunId = undefined;

    try {
      await this.executeRun({ context, tools: this.getToolSchemas(), forwardedProps });
    } catch (error) {
      console.error('Error sending message:', error);
      this.cleanupWaitingInteractions({ error: 'cancelled' });
      this.appendErrorMessage('Sorry, an error occurred while processing your request.');
    } finally {
      this.runtimeMessages = [...(this.runtime.messages ?? this.runtimeMessages)];
      this.isStreaming.set(false);
      this.currentRunId = undefined;
    }
  }

  /**
   * Resolves a waiting interaction and resumes the current run through the local tool result.
   *
   * @param interactionId Interaction identifier emitted by the render part.
   * @param response Structured response returned from the UI.
   * @param options Optional local-only user message appended after resolution.
   * @returns Void. The waiting tool promise resolves immediately.
   */
  public resolveInteraction(
    interactionId: string,
    response: unknown,
    options?: AgentInteractionResolutionOptions,
  ): void {
    const waitingInteraction = this.waitingInteractions.get(interactionId);
    if (!waitingInteraction) {
      return;
    }

    this.updateRenderPart(interactionId, {
      response,
      state: 'resolved',
    });

    const userMessage = options?.userMessage;
    if (userMessage) {
      this.messages.update((messages) => [...messages, this.createTimelineMessage(userMessage)]);
    }

    waitingInteraction.resolve(response);
    this.waitingInteractions.delete(interactionId);
    this.refreshMessageStatus(waitingInteraction.messageId, 'complete');
  }

  /**
   * Applies header overrides for future requests.
   *
   * @param headers Header override map. Use `null` to remove a header key.
   * @returns Void. Recomputes the effective request headers.
   */
  public setHeaders(headers: Record<string, string | null>): void {
    this.headerOverrides.update((currentHeaders) => ({
      ...currentHeaders,
      ...headers,
    }));
  }

  /**
   * Clears header overrides for the provided names.
   *
   * @param names Header names to remove from the override map.
   * @returns Void. Recomputes the effective request headers.
   */
  public clearHeaders(names: string[]): void {
    this.headerOverrides.update((currentHeaders) => {
      const nextHeaders = { ...currentHeaders };
      for (const name of names) {
        delete nextHeaders[name];
      }
      return nextHeaders;
    });
  }

  /**
   * Cancels the current agent request if one is in progress.
   *
   * @returns Void. Aborts the runtime and resolves pending interactions as cancelled.
   */
  public cancelRequest(): void {
    this.runtime?.abortRun();
    this.cleanupWaitingInteractions({ error: 'cancelled' });
    this.isStreaming.set(false);
  }

  /**
   * Resets the service to an uninitialized state.
   *
   * @returns Void. Clears all local messages, runtime messages, and transient state.
   */
  public reset(): void {
    this.destroyHeaderEffect();
    this.cleanupWaitingInteractions({ error: 'cancelled' });

    this.messages.set([]);
    this.runtimeMessages = [];
    this.isStreaming.set(false);
    this.appState.set({});
    this.currentRunId = undefined;
    this.hasPendingFrontendToolResult = false;
    this.activeToolCalls.clear();
    this.waitingInteractions.clear();
    this.tools.clear();
    this.runtime = null;
    this.headerSource = undefined;
    this.headerOverrides.set({});
    this.initialized.set(false);
  }

  /**
   * Updates the runtime state used for future requests.
   *
   * @param state New state snapshot to persist locally and in the runtime.
   * @returns Void. Replaces the current application state.
   */
  public updateState(state: State): void {
    this.appState.set(state);
    this.runtime?.setState(state);
  }

  /**
   * Executes a run and any follow-up continuation runs required by local frontend tools.
   *
   * @param parameters AG-UI run parameters for the current request.
   * @returns Promise that resolves after all continuations finish.
   */
  private async executeRun(parameters: RunAgentParameters): Promise<void> {
    if (!this.runtime) {
      return;
    }

    await this.runtime.runAgent(parameters, this.createSubscriber());
    this.runtimeMessages = [...this.runtime.messages];

    const maxContinuations = 5;
    let continuationCount = 0;

    while (this.hasPendingFrontendToolResult && continuationCount < maxContinuations) {
      continuationCount++;
      this.hasPendingFrontendToolResult = false;

      this.runtime.setMessages(this.runtimeMessages);
      await this.runtime.runAgent({ tools: this.getToolSchemas() }, this.createSubscriber());
      this.runtimeMessages = [...this.runtime.messages];
    }
  }

  /**
   * Builds the AG-UI subscriber used to update the local timeline from stream events.
   *
   * @returns Subscriber implementation for the active run.
   */
  private createSubscriber(): AgentSubscriber {
    return {
      onRunStartedEvent: ({ event }) => {
        this.currentRunId = (event as RunStartedEvent).runId;
      },

      onTextMessageStartEvent: ({ event }) => {
        const textEvent = event as TextMessageStartEvent;
        this.ensureMessage(
          textEvent.messageId,
          normalizeMessageRole(textEvent.role ?? 'assistant'),
          'streaming',
        );
      },

      onTextMessageContentEvent: ({ event }) => {
        const textEvent = event as TextMessageContentEvent;
        this.upsertTextPart(textEvent.messageId, textEvent.delta ?? '', true);
      },

      onTextMessageEndEvent: ({ event }) => {
        const textEvent = event as TextMessageEndEvent;
        this.refreshMessageStatus(textEvent.messageId, 'complete');
      },

      onToolCallStartEvent: ({ event }) => {
        const toolEvent = event as ToolCallStartEvent;
        const parentMessageId = toolEvent.parentMessageId ?? crypto.randomUUID();

        this.ensureMessage(parentMessageId, 'assistant', 'streaming');

        const toolCall: ActiveToolCall = {
          argsText: '',
          name: toolEvent.toolCallName,
          parentMessageId,
        };

        this.activeToolCalls.set(toolEvent.toolCallId, toolCall);
        this.upsertToolCallPart(parentMessageId, {
          argsText: '',
          state: 'streaming',
          toolCallId: toolEvent.toolCallId,
          toolName: toolEvent.toolCallName,
          type: 'tool-call',
        });
      },

      onToolCallArgsEvent: ({ event }) => {
        const toolEvent = event as ToolCallArgsEvent;
        const toolCall = this.activeToolCalls.get(toolEvent.toolCallId);
        if (!toolCall) {
          return;
        }

        toolCall.argsText += toolEvent.delta;
        toolCall.args = safeParseObject(toolCall.argsText);

        this.upsertToolCallPart(toolCall.parentMessageId, {
          args: toolCall.args,
          argsText: toolCall.argsText,
          state: 'streaming',
          toolCallId: toolEvent.toolCallId,
          toolName: toolCall.name,
          type: 'tool-call',
        });
      },

      onToolCallEndEvent: async ({
        event,
        messages,
        toolCallArgs,
      }): Promise<AgentStateMutation | void> => {
        const toolEvent = event as ToolCallEndEvent;
        const toolCall = this.activeToolCalls.get(toolEvent.toolCallId);
        if (!toolCall) {
          return;
        }

        this.upsertToolCallPart(toolCall.parentMessageId, {
          args: toolCallArgs,
          argsText: toolCall.argsText,
          state: 'complete',
          toolCallId: toolEvent.toolCallId,
          toolName: toolCall.name,
          type: 'tool-call',
        });

        const frontendTool = this.tools.get(toolCall.name);
        if (!frontendTool) {
          return;
        }

        try {
          const result = await frontendTool.render(toolCallArgs, {
            renderAndWait: (data) =>
              this.renderComponentAndWait({
                ...data,
                interactionId: crypto.randomUUID(),
                name: toolCall.name,
                toolCallId: toolEvent.toolCallId,
                toolName: toolCall.name,
              }),
            renderComponent: (data) =>
              this.renderComponent({
                ...data,
                interactionId: crypto.randomUUID(),
                name: toolCall.name,
                toolCallId: toolEvent.toolCallId,
                toolName: toolCall.name,
              }),
          });

          this.upsertToolResultPart(toolEvent.toolCallId, {
            result: result.content,
            toolCallId: toolEvent.toolCallId,
            toolName: toolCall.name,
            type: 'tool-result',
          });

          this.activeToolCalls.delete(toolEvent.toolCallId);
          this.hasPendingFrontendToolResult = true;

          const toolResultMessage: Message = {
            content: this.normalizeMessageContent(result.content),
            id: crypto.randomUUID(),
            role: 'tool',
            toolCallId: toolEvent.toolCallId,
          };

          return {
            messages: [...messages, toolResultMessage],
          };
        } catch (error) {
          console.error(`Failed to execute tool ${toolCall.name}:`, error);

          this.upsertToolCallPart(toolCall.parentMessageId, {
            args: toolCallArgs,
            argsText: toolCall.argsText,
            state: 'error',
            toolCallId: toolEvent.toolCallId,
            toolName: toolCall.name,
            type: 'tool-call',
          });

          const errorResult = {
            error: `Failed to execute ${toolCall.name}`,
          };

          this.upsertToolResultPart(toolEvent.toolCallId, {
            error: errorResult.error,
            result: errorResult,
            toolCallId: toolEvent.toolCallId,
            toolName: toolCall.name,
            type: 'tool-result',
          });

          this.activeToolCalls.delete(toolEvent.toolCallId);
          this.hasPendingFrontendToolResult = true;

          const errorMessage: Message = {
            content: JSON.stringify(errorResult),
            id: crypto.randomUUID(),
            role: 'tool',
            toolCallId: toolEvent.toolCallId,
          };

          return {
            messages: [...messages, errorMessage],
          };
        }
      },

      onToolCallResultEvent: ({ event }) => {
        const toolEvent = event as ToolCallResultEvent;
        const toolCall = this.activeToolCalls.get(toolEvent.toolCallId);

        this.upsertToolResultPart(toolEvent.toolCallId, {
          result: safeParseContent(toolEvent.content),
          toolCallId: toolEvent.toolCallId,
          toolName: toolCall?.name ?? 'tool',
          type: 'tool-result',
        });

        this.activeToolCalls.delete(toolEvent.toolCallId);
      },

      onStateSnapshotEvent: ({ event }) => {
        const snapshot = (event as StateSnapshotEvent).snapshot;
        if (snapshot) {
          this.appState.set(snapshot);
        }
      },

      onRunFinishedEvent: () => {
        this.finalizeStreamingMessages();
      },

      onRunErrorEvent: ({ event }) => {
        const runErrorEvent = event as RunErrorEvent;
        console.error('Run error:', runErrorEvent.message);
        this.cleanupWaitingInteractions({ error: 'cancelled' });
        this.appendErrorMessage(runErrorEvent.message);
        this.finalizeStreamingMessages();
      },
    };
  }

  /**
   * Creates the schema array passed to the runtime.
   *
   * @returns Tool schema array containing name, description, and parameters.
   */
  private getToolSchemas(): { description: string; name: string; parameters: object }[] {
    return Array.from(this.tools.values()).map(({ description, name, parameters }) => ({
      description,
      name,
      parameters,
    }));
  }

  /**
   * Renders an inline component and stores it in the local tool message timeline.
   *
   * @param request Render request metadata for the inline component.
   * @returns Void. Appends or updates the target tool message.
   */
  private renderComponent(request: ToolRenderRequest): void {
    const renderPart: AgentRenderMessagePart = {
      interactionId: request.interactionId,
      mode: 'inline',
      request: toUiStreamData(request),
      state: 'rendered',
      toolCallId: request.toolCallId,
      toolName: request.toolName,
      type: 'render',
    };

    this.upsertToolMessagePart(request.toolCallId, renderPart, 'complete');
  }

  /**
   * Renders a component inline and waits for user interaction before continuing.
   *
   * @param request Render request metadata for the waiting interaction.
   * @returns Promise that resolves with the user interaction result.
   */
  private renderComponentAndWait(request: ToolRenderRequest): Promise<unknown> {
    const renderPart: AgentRenderMessagePart = {
      interactionId: request.interactionId,
      mode: 'interrupt',
      request: toUiStreamData(request),
      state: 'waiting',
      toolCallId: request.toolCallId,
      toolName: request.toolName,
      type: 'render',
    };

    this.upsertToolMessagePart(request.toolCallId, renderPart, 'waiting');

    return new Promise((resolve) => {
      this.waitingInteractions.set(request.interactionId, {
        messageId: toolMessageId(request.toolCallId),
        resolve,
      });
    });
  }

  /**
   * Computes the effective headers from the configured source and manual overrides.
   *
   * @returns Plain header object used for future requests.
   */
  private computeHeaders(): Record<string, string> {
    const baseHeaders = readHeaderSource(this.headerSource);
    const nextHeaders: Record<string, string> = { ...baseHeaders };

    for (const [name, value] of Object.entries(this.headerOverrides())) {
      if (value === null) {
        delete nextHeaders[name];
        continue;
      }
      nextHeaders[name] = value;
    }

    return nextHeaders;
  }

  /**
   * Tears down the active header synchronization effect.
   *
   * @returns Void. Safe to call multiple times.
   */
  private destroyHeaderEffect(): void {
    this.headerEffectRef?.destroy();
    this.headerEffectRef = null;
  }

  /**
   * Resolves pending interactions with the provided fallback result.
   *
   * @param result Result object used to resolve all pending interaction promises.
   * @returns Void. Marks all pending render parts as resolved.
   */
  private cleanupWaitingInteractions(result: unknown): void {
    for (const [interactionId, waitingInteraction] of this.waitingInteractions.entries()) {
      this.updateRenderPart(interactionId, {
        response: result,
        state: 'resolved',
      });
      waitingInteraction.resolve(result);
    }

    this.waitingInteractions.clear();
  }

  /**
   * Converts transport messages into the local message timeline shape.
   *
   * @param messages Provider-compatible transport messages.
   * @returns Local message timeline entries derived from transport state.
   */
  private mapTransportMessages(messages: Message[]): AgentMessage[] {
    return messages.map((message) => {
      if (message.role === 'tool') {
        const toolCallId = message.toolCallId ?? message.id;
        const toolMessage: AgentMessage = {
          createdAt: Date.now(),
          id: toolMessageId(toolCallId),
          parts: [
            {
              result: safeParseContent(message.content),
              toolCallId,
              toolName: 'tool',
              type: 'tool-result',
            },
          ],
          role: 'tool',
          status: 'complete',
        };

        return toolMessage;
      }

      const parts: AgentMessagePart[] = [];

      if (typeof message.content === 'string' && message.content.length > 0) {
        parts.push({
          text: message.content,
          type: 'text',
        });
      }

      if ('toolCalls' in message && Array.isArray(message.toolCalls)) {
        for (const toolCall of message.toolCalls) {
          parts.push({
            args: safeParseObject(toolCall.function.arguments),
            argsText: toolCall.function.arguments,
            state: 'complete',
            toolCallId: toolCall.id,
            toolName: toolCall.function.name,
            type: 'tool-call',
          });
        }
      }

      return {
        createdAt: Date.now(),
        id: message.id,
        parts,
        role: normalizeMessageRole(message.role),
        status: 'complete',
      };
    });
  }

  /**
   * Creates a local timeline message from an outbound message payload.
   *
   * @param message Outbound message sent by the consumer.
   * @returns Local timeline message appended before the run starts.
   */
  private createTimelineMessage(message: AgentOutboundMessage): AgentMessage {
    return {
      createdAt: Date.now(),
      id: crypto.randomUUID(),
      parts: message.parts.map((part) => ({
        text: part.text,
        type: 'text',
      })),
      role: message.role,
      status: 'complete',
    };
  }

  /**
   * Converts an outbound message into the provider-compatible transport shape.
   *
   * @param message Outbound message payload.
   * @returns Transport message sent to the runtime.
   */
  private createTransportMessage(message: AgentOutboundMessage): Message {
    return {
      content: message.parts.map((part) => part.text).join('\n\n'),
      id: crypto.randomUUID(),
      role: message.role,
    } as Message;
  }

  /**
   * Ensures a message exists in the local timeline.
   *
   * @param messageId Message identifier to create or reuse.
   * @param role Role assigned when creating the message.
   * @param status Initial or replacement status for the message.
   * @returns Void. Creates the message when missing.
   */
  private ensureMessage(
    messageId: string,
    role: AgentMessageRole,
    status: AgentMessageStatus,
  ): void {
    this.messages.update((messages) => {
      const existingMessage = messages.find((message) => message.id === messageId);
      if (existingMessage) {
        return messages.map((message) =>
          message.id === messageId ? { ...message, runId: this.currentRunId, status } : message,
        );
      }

      return [
        ...messages,
        {
          createdAt: Date.now(),
          id: messageId,
          parts: [],
          role,
          runId: this.currentRunId,
          status,
        },
      ];
    });
  }

  /**
   * Upserts the text part for a message by appending streamed deltas.
   *
   * @param messageId Target message identifier.
   * @param delta Text delta to append.
   * @param streaming Whether the message should stay in streaming state.
   * @returns Void. Creates the text part when missing.
   */
  private upsertTextPart(messageId: string, delta: string, streaming: boolean): void {
    this.messages.update((messages) =>
      messages.map((message) => {
        if (message.id !== messageId) {
          return message;
        }

        const textPartIndex = message.parts.findIndex((part) => part.type === 'text');
        if (textPartIndex === -1) {
          return {
            ...message,
            parts: [...message.parts, { text: delta, type: 'text' }],
            status: streaming ? 'streaming' : message.status,
          };
        }

        const nextParts = [...message.parts];
        const textPart = nextParts[textPartIndex];
        if (textPart.type !== 'text') {
          return message;
        }
        nextParts[textPartIndex] = {
          text: `${textPart.text}${delta}`,
          type: 'text',
        };

        return {
          ...message,
          parts: nextParts,
          status: streaming ? 'streaming' : message.status,
        };
      }),
    );
  }

  /**
   * Upserts a tool-call part on the given assistant message.
   *
   * @param messageId Assistant message identifier that owns the tool call.
   * @param part Tool call part payload.
   * @returns Void. Replaces the existing part with the same tool call id when present.
   */
  private upsertToolCallPart(messageId: string, part: AgentToolCallMessagePart): void {
    this.ensureMessage(
      messageId,
      'assistant',
      part.state === 'streaming' ? 'streaming' : 'complete',
    );
    this.messages.update((messages) =>
      messages.map((message) => {
        if (message.id !== messageId) {
          return message;
        }

        const partIndex = message.parts.findIndex(
          (messagePart) =>
            messagePart.type === 'tool-call' && messagePart.toolCallId === part.toolCallId,
        );

        const nextParts = [...message.parts];
        if (partIndex === -1) {
          nextParts.push(part);
        } else {
          nextParts[partIndex] = part;
        }

        return {
          ...message,
          parts: nextParts,
          status: part.state === 'streaming' ? 'streaming' : message.status,
        };
      }),
    );
  }

  /**
   * Upserts a tool-result part in the tool message associated with a tool call.
   *
   * @param toolCallId Tool call identifier used to locate the tool message.
   * @param part Tool result part payload.
   * @returns Void. Creates the tool message when missing.
   */
  private upsertToolResultPart(toolCallId: string, part: AgentToolResultMessagePart): void {
    this.upsertToolMessagePart(toolCallId, part, part.error ? 'error' : 'complete');
  }

  /**
   * Upserts a tool-scoped message part in the timeline.
   *
   * @param toolCallId Tool call identifier used to derive the tool message id.
   * @param part Message part appended or replaced inside the tool message.
   * @param status Status applied to the tool message after the update.
   * @returns Void. Creates the tool message when missing.
   */
  private upsertToolMessagePart(
    toolCallId: string,
    part: AgentMessagePart,
    status: AgentMessageStatus,
  ): void {
    const messageId = toolMessageId(toolCallId);

    this.messages.update((messages) => {
      const existingMessage = messages.find((message) => message.id === messageId);
      if (!existingMessage) {
        return [
          ...messages,
          {
            createdAt: Date.now(),
            id: messageId,
            parts: [part],
            role: 'tool',
            runId: this.currentRunId,
            status,
          },
        ];
      }

      const nextParts = upsertToolScopedPart(existingMessage.parts, part);
      return messages.map((message) =>
        message.id === messageId
          ? {
              ...message,
              parts: nextParts,
              runId: this.currentRunId,
              status,
            }
          : message,
      );
    });
  }

  /**
   * Updates a render part by interaction identifier.
   *
   * @param interactionId Target interaction identifier.
   * @param updates Partial updates applied to the render part.
   * @returns Void. No-ops when the interaction is not present.
   */
  private updateRenderPart(
    interactionId: string,
    updates: Partial<Pick<AgentRenderMessagePart, 'response' | 'state'>>,
  ): void {
    this.messages.update((messages) =>
      messages.map((message) => {
        const nextParts = message.parts.map((part) => {
          if (part.type !== 'render' || part.interactionId !== interactionId) {
            return part;
          }

          return {
            ...part,
            ...updates,
          };
        });

        return {
          ...message,
          parts: nextParts,
        };
      }),
    );
  }

  /**
   * Recomputes a message status after a streaming or waiting update.
   *
   * @param messageId Message identifier to refresh.
   * @param fallback Status used when no special message parts require streaming or waiting state.
   * @returns Void. Updates the message status in place.
   */
  private refreshMessageStatus(messageId: string, fallback: AgentMessageStatus): void {
    this.messages.update((messages) =>
      messages.map((message) => {
        if (message.id !== messageId) {
          return message;
        }

        const nextStatus = deriveMessageStatus(message.parts, fallback);
        return {
          ...message,
          status: nextStatus,
        };
      }),
    );
  }

  /**
   * Marks any remaining streaming messages as complete at the end of a run.
   *
   * @returns Void. Leaves waiting messages untouched.
   */
  private finalizeStreamingMessages(): void {
    this.messages.update((messages) =>
      messages.map((message) => {
        if (message.status !== 'streaming') {
          return message;
        }

        return {
          ...message,
          status: deriveMessageStatus(message.parts, 'complete'),
        };
      }),
    );
  }

  /**
   * Appends an assistant error message to the local timeline.
   *
   * @param text Error text displayed to the user.
   * @returns Void. Always appends a fresh assistant message.
   */
  private appendErrorMessage(text: string): void {
    this.messages.update((messages) => [
      ...messages,
      {
        createdAt: Date.now(),
        id: crypto.randomUUID(),
        parts: [{ text, type: 'text' }],
        role: 'assistant',
        runId: this.currentRunId,
        status: 'error',
      },
    ]);
  }

  /**
   * Normalizes runtime content into a safe string for tool-result transport messages.
   *
   * @param content Content to normalize.
   * @returns String content compatible with AG-UI transport messages.
   */
  private normalizeMessageContent(content: unknown): string {
    if (typeof content === 'string') {
      return content;
    }

    if (content == null) {
      return '';
    }

    try {
      return JSON.stringify(content);
    } catch {
      return String(content);
    }
  }
}

class HttpAgentRuntime implements AgentRuntime {
  private readonly agent: HttpAgent;

  constructor(config: AgentConfig) {
    if (!config.url) {
      throw new Error('AgentConfig.url is required when a custom runtime is not provided.');
    }

    this.agent = new HttpAgent({
      agentId: config.agentId,
      debug: config.debug,
      description: config.description,
      headers: readHeaderSource(config.headers),
      initialMessages: config.initialMessages,
      initialState: config.initialState,
      threadId: config.threadId ?? 'default-thread',
      url: config.url,
    });
  }

  get messages(): Message[] {
    return this.agent.messages;
  }

  setHeaders(headers: Record<string, string>): void {
    this.agent.headers = headers;
  }

  setMessages(messages: Message[]): void {
    this.agent.setMessages(messages);
  }

  setState(state: State): void {
    this.agent.setState(state);
  }

  async runAgent(parameters?: RunAgentParameters, subscriber?: AgentSubscriber): Promise<void> {
    await this.agent.runAgent(parameters, subscriber);
  }

  abortRun(): void {
    this.agent.abortRun();
  }
}

function readHeaderSource(source?: AgentHeadersSource): Record<string, string> {
  if (!source) {
    return {};
  }

  if (typeof source === 'function') {
    return { ...source() };
  }

  return { ...source };
}

function normalizeMessageRole(role: string): AgentMessageRole {
  if (
    role === 'assistant' ||
    role === 'developer' ||
    role === 'system' ||
    role === 'tool' ||
    role === 'user'
  ) {
    return role;
  }

  return 'assistant';
}

function toolMessageId(toolCallId: string): string {
  return `tool:${toolCallId}`;
}

function safeParseObject(value: string): Record<string, unknown> | undefined {
  if (!value) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(value) as unknown;
    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
  } catch {
    return undefined;
  }

  return undefined;
}

function safeParseContent(value: string): unknown {
  if (!value) {
    return '';
  }

  try {
    return JSON.parse(value) as unknown;
  } catch {
    return value;
  }
}

function upsertToolScopedPart(
  parts: readonly AgentMessagePart[],
  nextPart: AgentMessagePart,
): AgentMessagePart[] {
  if (nextPart.type === 'render') {
    const renderPartIndex = parts.findIndex(
      (part) => part.type === 'render' && part.interactionId === nextPart.interactionId,
    );

    if (renderPartIndex === -1) {
      return [...parts, nextPart];
    }

    const nextParts = [...parts];
    nextParts[renderPartIndex] = nextPart;
    return nextParts;
  }

  if (nextPart.type === 'tool-result') {
    const resultPartIndex = parts.findIndex(
      (part) => part.type === 'tool-result' && part.toolCallId === nextPart.toolCallId,
    );

    if (resultPartIndex === -1) {
      return [...parts, nextPart];
    }

    const nextParts = [...parts];
    nextParts[resultPartIndex] = nextPart;
    return nextParts;
  }

  return [...parts, nextPart];
}

function deriveMessageStatus(
  parts: readonly AgentMessagePart[],
  fallback: AgentMessageStatus,
): AgentMessageStatus {
  if (parts.some((part) => part.type === 'render' && part.state === 'waiting')) {
    return 'waiting';
  }

  if (parts.some((part) => part.type === 'tool-call' && part.state === 'streaming')) {
    return 'streaming';
  }

  if (
    parts.some(
      (part) =>
        (part.type === 'tool-call' && part.state === 'error') ||
        (part.type === 'tool-result' && typeof part.error === 'string' && part.error.length > 0),
    )
  ) {
    return 'error';
  }

  return fallback;
}

function toUiStreamData(request: ToolRenderRequest) {
  return {
    content: request.content,
    name: request.name,
    props: request.props,
    slots: request.slots,
  };
}
