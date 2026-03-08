import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

@Component({
  selector: 'ai-lorem-callback',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ai-lorem-callback',
  },
  template: `
    <article class="ai-lorem-callback__content">
      <p class="ai-lorem-callback__lead">{{ summary() }}</p>
      <button type="button" class="ai-lorem-callback__button" (click)="emitAction()">
        {{ buttonText() }}
      </button>
    </article>
  `,
  styles: `
      :host {
        display: block;
        border: 1px solid #cbd5e1;
        border-radius: 10px;
        padding: 0.75rem;
        background: #f8fafc;
      }
  
      .ai-lorem-callback__content {
        display: grid;
        gap: 0.625rem;
      }
  
      .ai-lorem-callback__lead {
        margin: 0;
        color: #334155;
        line-height: 1.35;
      }
  
      .ai-lorem-callback__button {
        border: 1px solid #0f766e;
        border-radius: 8px;
        padding: 0.5rem 0.75rem;
        background: #ccfbf1;
        color: #134e4a;
        font-weight: 600;
        cursor: pointer;
      }
    `,
})
export class AiLoremCallbackComponent {
  /**
   * Input: Label shown on the interactive callback trigger button.
   * Accepted values: any non-empty string
   * Default: 'Emit callback payload'
   */
  readonly buttonText = input('Emit callback payload');

  /**
   * Input: Text shown above the trigger button.
   * Accepted values: any string
   * Default: 'Callback-style input bridge example.'
   */
  readonly summary = input('Callback-style input bridge example.');

  /**
   * Input: Callback-style handler consumed by `AiPayloadRendererComponent`.
   * Accepted values: `(payload: { id: string; text: string; sequence: number }) => void`
   * Default: no-op function
   */
  readonly onAction = input<(payload: { id: string; text: string; sequence: number }) => void>(
    () => undefined
  );

  private sequence = 0;

  private readonly loremMessages = [
    'Lorem ipsum payload generated from callback input.',
    'Dolor sit amet callback payload from renderer bridge.',
    'Consectetur adipiscing callback event for consumer handler.',
  ];

  /**
   * Emits the next callback payload into the externally provided input handler.
   *
   * @returns Void. Invokes `onAction` with sequence metadata and lorem text.
   */
  emitAction(): void {
    this.sequence += 1;
    const text = this.loremMessages[(this.sequence - 1) % this.loremMessages.length];

    this.onAction()({
      id: `lorem-${this.sequence}`,
      text,
      sequence: this.sequence,
    });
  }
}

@Component({
  selector: 'ai-native-click-surface',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ai-native-click-surface',
  },
  template: `
    <article>
      <p>{{ label() }}</p>
      <button type="button">Native click target</button>
    </article>
  `,
  styles: `
      :host {
        display: block;
        border: 1px solid #cbd5e1;
        border-radius: 10px;
        padding: 0.75rem;
        background: #f8fafc;
      }
  
      p {
        margin: 0 0 0.5rem;
        color: #334155;
      }
  
      button {
        border: 1px solid #334155;
        border-radius: 8px;
        padding: 0.45rem 0.75rem;
        background: #ffffff;
        color: #0f172a;
        cursor: pointer;
      }
    `,
})
export class AiNativeClickSurfaceComponent {
  /**
   * Input: Description text shown above the native click button.
   * Accepted values: any string
   * Default: 'Renderer maps registry event key "click" to host native click listeners.'
   */
  readonly label = input(
    'Renderer maps registry event key "click" to host native click listeners.'
  );
}

@Component({
  selector: 'ai-model-bridge-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ai-model-bridge-demo',
  },
  template: `
    <article class="ai-model-bridge-demo__layout">
      <p>{{ label() }}</p>
      <p class="ai-model-bridge-demo__value">Current value: {{ value() }}</p>
      <button type="button" (click)="emitNextValue()">Emit ngModelChange</button>
    </article>
  `,
  styles: `
      :host {
        display: block;
        border: 1px solid #cbd5e1;
        border-radius: 10px;
        padding: 0.75rem;
        background: #f8fafc;
      }
  
      .ai-model-bridge-demo__layout {
        display: grid;
        gap: 0.625rem;
      }
  
      p {
        margin: 0;
        color: #334155;
      }
  
      .ai-model-bridge-demo__value {
        font-family: 'Menlo', 'Monaco', monospace;
        color: #0f172a;
      }
  
      button {
        width: fit-content;
        border: 1px solid #1d4ed8;
        border-radius: 8px;
        padding: 0.45rem 0.75rem;
        background: #dbeafe;
        color: #1e3a8a;
        cursor: pointer;
      }
    `,
})
export class AiModelBridgeDemoComponent {
  /**
   * Input: Description text shown above the model state line.
   * Accepted values: any string
   * Default: 'CVA bridge demo using ngModel and ngModelChange.'
   */
  readonly label = input('CVA bridge demo using ngModel and ngModelChange.');

  readonly value = signal('');

  private onModelChange: (value: unknown) => void = () => undefined;

  /**
   * Implements CVA-style value writing used by the renderer when `props.ngModel` exists.
   *
   * @param value Incoming model value from payload props.
   * @returns Void. Normalizes and stores the current value.
   */
  writeValue(value: unknown): void {
    this.value.set(typeof value === 'string' ? value : String(value ?? ''));
  }

  /**
   * Registers the CVA-style change callback used for `ngModelChange` bridging.
   *
   * @param fn Change callback provided by the renderer.
   * @returns Void. Saves callback for user-triggered value changes.
   */
  registerOnChange(fn: (value: unknown) => void): void {
    this.onModelChange = fn;
  }

  /**
   * Emits the next value through registered `ngModelChange` callback.
   *
   * @returns Void. Updates local value and dispatches the CVA change callback.
   */
  emitNextValue(): void {
    const nextValue = `${this.value()} ✓`;
    this.value.set(nextValue);
    this.onModelChange(nextValue);
  }
}
