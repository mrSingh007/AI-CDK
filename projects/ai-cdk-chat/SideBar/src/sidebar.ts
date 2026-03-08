import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  booleanAttribute,
  effect,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';

interface AiSidebarMessage {
  readonly id: number;
  readonly role: 'user' | 'ai';
  readonly text: string;
  readonly streaming: boolean;
  readonly error: boolean;
}
/***
 * This component is not ready, do not consider/use it.
 */
@Component({
  selector: 'ai-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ai-sidebar-host',
  },
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class AiSidebarComponent {
  private stream: EventSource | null = null;
  private activeAiMessageId: number | null = null;
  private nextMessageId = 0;

  readonly messagesContainer = viewChild<ElementRef<HTMLElement>>('messagesContainer');

  /**
   * Input: Server endpoint path used for SSE chat streaming.
   * Accepted values: string
   * Default: required input (no default).
   */
  readonly path = input.required<string>();

  /**
   * Input: Placeholder text shown in the message input field.
   * Accepted values: string
   * Default: 'Type a message...'
   */
  readonly placeholder = input('Component in WIP. Do not use it');

  /**
   * Input: Disables input and send operations when true.
   * Accepted values: boolean
   * Default: false
   */
  readonly disabled = input(false, { transform: booleanAttribute });

  /**
   * Output: Fired when the close button is clicked.
   * Payload: void
   * Trigger: User activates the sidebar close action.
   */
  readonly xClicked = output<void>();

  /**
   * Output: Fired after the clear action resets local chat state.
   * Payload: void
   * Trigger: User activates the clear chat action.
   */
  readonly clearClicked = output<void>();

  readonly inputMessage = signal('');
  readonly isStreaming = signal(false);
  readonly messages = signal<AiSidebarMessage[]>([]);

  constructor() {
    effect(() => {
      this.messages();
      queueMicrotask(() => {
        const container = this.messagesContainer()?.nativeElement;
        if (!container) {
          return;
        }

        container.scrollTop = container.scrollHeight;
      });
    });
  }

  /**
   * Updates local draft text from the message input field.
   *
   * @param event Native input event for the message field.
   * @returns Void. Sets the current `inputMessage` signal.
   */
  onMessageInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.inputMessage.set(input.value);
  }

  /**
   * Submits the message when Enter is pressed.
   *
   * @param event Keyboard event from the message input.
   * @returns Void. Prevents default newline behavior and triggers `sendMessage`.
   */
  onEnterPress(event: KeyboardEvent): void {
    if (event.key !== 'Enter') {
      return;
    }

    event.preventDefault();
    this.sendMessage();
  }

  /**
   * Handles close action clicks.
   *
   * @returns Void. Emits `xClicked`.
   */
  onCloseClick(): void {
    this.xClicked.emit();
  }

  /**
   * Clears chat messages and active stream state.
   *
   * @returns Void. Emits `clearClicked` after reset.
   */
  onClearClick(): void {
    this.disconnectStream();
    this.isStreaming.set(false);
    this.activeAiMessageId = null;
    this.messages.set([]);
    this.clearClicked.emit();
  }

  /**
   * Sends the current message and starts an SSE stream for AI response tokens.
   *
   * @returns Void. Updates local message state and streaming lifecycle.
   */
  sendMessage(): void {
    if (this.disabled() || this.isStreaming()) {
      return;
    }

    const trimmedMessage = this.inputMessage().trim();
    if (!trimmedMessage) {
      return;
    }

    this.appendMessage({
      id: this.nextId(),
      role: 'user',
      text: trimmedMessage,
      streaming: false,
      error: false,
    });

    this.inputMessage.set('');

    const aiMessageId = this.nextId();
    this.activeAiMessageId = aiMessageId;
    this.appendMessage({
      id: aiMessageId,
      role: 'ai',
      text: '',
      streaming: true,
      error: false,
    });

    const streamUrl = this.buildStreamUrl(trimmedMessage);
    if (!streamUrl || typeof EventSource === 'undefined') {
      this.markError('Unable to start stream.');
      return;
    }

    this.isStreaming.set(true);
    this.disconnectStream();

    this.stream = new EventSource(streamUrl);

    this.stream.onmessage = (event) => {
      if (event.data === '[DONE]') {
        this.finishStream();
        return;
      }

      const token = extractToken(event.data);
      this.updateActiveAiMessage((message) => ({
        ...message,
        text: `${message.text}${token}`,
      }));
    };

    this.stream.onerror = () => {
      this.markError('Connection error. Please try again.');
    };
  }

  /**
   * Marks the active AI message as an error state with a fallback message.
   *
   * @param message Error text appended to the active AI message.
   * @returns Void. Finalizes the current stream session.
   */
  private markError(message: string): void {
    this.updateActiveAiMessage((current) => ({
      ...current,
      text: current.text ? `${current.text}\n${message}` : message,
      error: true,
      streaming: false,
    }));

    this.finishStream();
  }

  /**
   * Finalizes the active stream and clears transient streaming state.
   *
   * @returns Void. Stops SSE and clears `activeAiMessageId`.
   */
  private finishStream(): void {
    this.updateActiveAiMessage((message) => ({
      ...message,
      streaming: false,
    }));

    this.disconnectStream();
    this.isStreaming.set(false);
    this.activeAiMessageId = null;
  }

  /**
   * Closes the current SSE connection when present.
   *
   * @returns Void. Resets `stream` to `null`.
   */
  private disconnectStream(): void {
    if (!this.stream) {
      return;
    }

    this.stream.close();
    this.stream = null;
  }

  /**
   * Appends a message entry to the local message list.
   *
   * @param message Message entity to append.
   * @returns Void. Updates `messages` signal immutably.
   */
  private appendMessage(message: AiSidebarMessage): void {
    this.messages.update((messages) => [...messages, message]);
  }

  /**
   * Applies an update function to the currently active AI message.
   *
   * @param update Pure update function for a single message.
   * @returns Void. No-op when there is no active AI message id.
   */
  private updateActiveAiMessage(update: (message: AiSidebarMessage) => AiSidebarMessage): void {
    const activeId = this.activeAiMessageId;
    if (activeId === null) {
      return;
    }

    this.messages.update((messages) =>
      messages.map((message) => (message.id === activeId ? update(message) : message)),
    );
  }

  /**
   * Produces a monotonically increasing message identifier.
   *
   * @returns Next numeric message id.
   */
  private nextId(): number {
    const id = this.nextMessageId;
    this.nextMessageId += 1;
    return id;
  }

  /**
   * Constructs a stream URL including the current user message as a query param.
   *
   * @param message User message text to send to the backend.
   * @returns A resolved URL string, or an empty string if path input is blank.
   */
  private buildStreamUrl(message: string): string {
    const rawPath = this.path().trim();
    if (!rawPath) {
      return '';
    }

    try {
      const baseUrl = typeof window === 'undefined' ? 'http://localhost' : window.location.origin;
      const url = new URL(rawPath, baseUrl);
      url.searchParams.set('message', message);
      return url.toString();
    } catch {
      const separator = rawPath.includes('?') ? '&' : '?';
      return `${rawPath}${separator}message=${encodeURIComponent(message)}`;
    }
  }
}

/**
 * Parses token payloads returned from SSE responses.
 *
 * @param data Raw SSE `event.data` string.
 * @returns Extracted token text from known JSON shapes, or raw data on parse fallback.
 */
function extractToken(data: string): string {
  try {
    const parsed = JSON.parse(data) as { token?: string; text?: string; content?: string };
    return parsed.token ?? parsed.text ?? parsed.content ?? data;
  } catch {
    return data;
  }
}
