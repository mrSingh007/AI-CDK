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

  readonly path = input.required<string>();
  readonly placeholder = input('Type a message...');
  readonly disabled = input(false, { transform: booleanAttribute });

  readonly xClicked = output<void>();
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

  onMessageInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.inputMessage.set(input.value);
  }

  onEnterPress(event: KeyboardEvent): void {
    if (event.key !== 'Enter') {
      return;
    }

    event.preventDefault();
    this.sendMessage();
  }

  onCloseClick(): void {
    this.xClicked.emit();
  }

  onClearClick(): void {
    this.disconnectStream();
    this.isStreaming.set(false);
    this.activeAiMessageId = null;
    this.messages.set([]);
    this.clearClicked.emit();
  }

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

  private markError(message: string): void {
    this.updateActiveAiMessage((current) => ({
      ...current,
      text: current.text ? `${current.text}\n${message}` : message,
      error: true,
      streaming: false,
    }));

    this.finishStream();
  }

  private finishStream(): void {
    this.updateActiveAiMessage((message) => ({
      ...message,
      streaming: false,
    }));

    this.disconnectStream();
    this.isStreaming.set(false);
    this.activeAiMessageId = null;
  }

  private disconnectStream(): void {
    if (!this.stream) {
      return;
    }

    this.stream.close();
    this.stream = null;
  }

  private appendMessage(message: AiSidebarMessage): void {
    this.messages.update((messages) => [...messages, message]);
  }

  private updateActiveAiMessage(
    update: (message: AiSidebarMessage) => AiSidebarMessage,
  ): void {
    const activeId = this.activeAiMessageId;
    if (activeId === null) {
      return;
    }

    this.messages.update((messages) =>
      messages.map((message) => (message.id === activeId ? update(message) : message)),
    );
  }

  private nextId(): number {
    const id = this.nextMessageId;
    this.nextMessageId += 1;
    return id;
  }

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

function extractToken(data: string): string {
  try {
    const parsed = JSON.parse(data) as { token?: string; text?: string; content?: string };
    return parsed.token ?? parsed.text ?? parsed.content ?? data;
  } catch {
    return data;
  }
}
