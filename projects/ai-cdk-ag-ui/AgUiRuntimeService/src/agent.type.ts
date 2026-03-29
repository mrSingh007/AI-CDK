import type { AgentSubscriber, Message, RunAgentParameters, State } from '@ag-ui/client';
import type { Signal } from '@angular/core';

export interface UiStreamData {
  name: string;
  props?: Record<string, unknown>;
  content?: string;
  slots?: Record<string, string>;
}

/** Tool render data excluding the tool name. */
export type ToolRenderData = Omit<UiStreamData, 'name'>;

/** Tool render data with the tool name included for message timeline rendering. */
export interface ToolRenderRequest extends UiStreamData {
  interactionId: string;
  toolCallId: string;
  toolName: string;
}

/** Context provided to tool render functions for UI rendering. */
export interface ToolRenderContext {
  /** Renders a component inline without waiting for user interaction. */
  renderComponent: (data: ToolRenderData) => void;
  /** Renders a component inline and waits for user interaction before continuing the run. */
  renderAndWait: (data: ToolRenderData) => Promise<unknown>;
}

/** Result returned from a tool execution. */
export interface ToolResult {
  content: unknown;
}

export interface AgentContext {
  value: string;
  description: string;
}

/** Configuration for an agent tool. */
export interface AgentTool {
  /** Unique name of the tool. */
  name: string;
  /** Description of what the tool does. */
  description: string;
  /** JSON schema defining tool parameters. */
  parameters: object;
  /** Render function that executes the tool and returns a result. */
  render: (args: Record<string, unknown>, ctx: ToolRenderContext) => Promise<ToolResult>;
}

/** Reactive source for request headers. */
export type AgentHeadersSource =
  | Record<string, string>
  | Signal<Record<string, string>>
  | (() => Record<string, string>);

/** Runtime contract used by the service. */
export interface AgentRuntime {
  /** Provider-compatible message history stored by the runtime. */
  messages: Message[];
  /** Replaces the runtime message history. */
  setMessages(messages: Message[]): void;
  /** Replaces the runtime state snapshot. */
  setState(state: State): void;
  /** Replaces the active request headers. */
  setHeaders(headers: Record<string, string>): void;
  /** Starts a run using the current runtime state. */
  runAgent(parameters?: RunAgentParameters, subscriber?: AgentSubscriber): Promise<void>;
  /** Aborts the current run if one is active. */
  abortRun(): void;
}

/** Configuration options for initializing the agent. */
export interface AgentConfig {
  /** URL of the default AG-UI backend endpoint. Required when `runtime` is not provided. */
  url?: string;
  /** Tools available to the agent runtime. */
  tools: readonly AgentTool[];
  agentId?: string;
  description?: string;
  threadId?: string;
  initialMessages?: Message[];
  debug?: boolean;
  /** Optional initial state for the agent. */
  initialState?: State;
  /** Optional request headers. */
  headers?: AgentHeadersSource;
  /** Optional runtime override for local testing or custom transports. */
  runtime?: AgentRuntime;
}

/** Role of a message stored in the UI timeline. */
export type AgentMessageRole = 'assistant' | 'developer' | 'system' | 'tool' | 'user';

/** Status of a message stored in the UI timeline. */
export type AgentMessageStatus = 'complete' | 'error' | 'streaming' | 'waiting';

/** Text message part used for chat content. */
export interface AgentTextMessagePart {
  type: 'text';
  text: string;
}

/** Tool call message part used to track streamed tool arguments. */
export interface AgentToolCallMessagePart {
  type: 'tool-call';
  toolCallId: string;
  toolName: string;
  argsText: string;
  args?: Record<string, unknown>;
  state: 'complete' | 'error' | 'streaming';
}

/** Tool result message part used for backend and frontend tool results. */
export interface AgentToolResultMessagePart {
  type: 'tool-result';
  toolCallId: string;
  toolName: string;
  result: unknown;
  error?: string;
}

/** Render message part used for inline UI payloads and human-in-the-loop interactions. */
export interface AgentRenderMessagePart {
  type: 'render';
  interactionId: string;
  toolCallId: string;
  toolName: string;
  request: UiStreamData;
  mode: 'inline' | 'interrupt';
  state: 'rendered' | 'resolved' | 'waiting';
  response?: unknown;
}

/** All supported message parts stored in the UI timeline. */
export type AgentMessagePart =
  | AgentRenderMessagePart
  | AgentTextMessagePart
  | AgentToolCallMessagePart
  | AgentToolResultMessagePart;

/** Message stored in the UI timeline. */
export interface AgentMessage {
  /** Unique identifier for the message. */
  id: string;
  /** Role of the message sender. */
  role: AgentMessageRole;
  /** Aggregated message status for rendering state. */
  status: AgentMessageStatus;
  /** Epoch timestamp when the message was created. */
  createdAt: number;
  /** Optional run identifier associated with the message. */
  runId?: string;
  /** Rich message parts used by the UI. */
  parts: AgentMessagePart[];
}

/** Outbound message part supported when sending user/system/developer messages. */
export interface AgentOutboundTextPart {
  type: 'text';
  text: string;
}

/** Outbound message sent to the service. */
export interface AgentOutboundMessage {
  role: 'developer' | 'system' | 'user';
  parts: AgentOutboundTextPart[];
}

/** Options used when resolving a waiting interaction. */
export interface AgentInteractionResolutionOptions {
  /** Optional local-only message appended to the UI timeline after resolving the interaction. */
  userMessage?: AgentOutboundMessage;
}
