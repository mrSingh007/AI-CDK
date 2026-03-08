import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  DOCUMENT,
  OnDestroy,
  Type,
  ViewContainerRef,
  computed,
  effect,
  inject,
  input,
  viewChild,
} from '@angular/core';

const DEFAULT_SLOT_KEY = '';
const CONTROL_VALUE_ACCESSOR_INPUT = 'ngModel';
const CONTROL_VALUE_ACCESSOR_EVENT = 'ngModelChange';

export interface AiPayloadComponentRegistration {
  readonly key: string;
  readonly component: Type<unknown>;
  readonly events?: Readonly<Record<string, string>>;
  /**
   * Ordered slot names matching each `<ng-content>` position in template order.
   * Use '' for the unselectored default slot.
   */
  readonly contentSlots?: readonly string[];
}

export interface AiPayloadRenderRequest {
  readonly component: string;
  readonly props?: Readonly<Record<string, unknown>>;
  readonly content?: string;
  readonly slots?: Readonly<Record<string, string>>;
}

export type AiPayloadEventHandlerMap = Readonly<Record<string, (payload: unknown) => void>>;

interface AiSubscribableOutput {
  subscribe(listener: (payload: unknown) => void): { unsubscribe(): void };
}

@Component({
  selector: 'ai-payload-renderer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ai-payload-renderer-host',
    '[attr.aria-live]': 'ariaLiveMode()',
  },
  template: `<ng-container #container />`,
  styleUrl: './renderer.scss',
})
export class AiPayloadRendererComponent implements OnDestroy {
  readonly containerRef = viewChild.required('container', { read: ViewContainerRef });

  /**
   * Input: JSON request describing what registered component should render.
   * Accepted values: `AiPayloadRenderRequest`
   * Default: required input
   */
  readonly renderRequest = input.required<AiPayloadRenderRequest>();

  /**
   * Input: Registered component definitions available to the renderer.
   * Accepted values: `readonly AiPayloadComponentRegistration[]`
   * Default: required input
   */
  readonly registry = input.required<readonly AiPayloadComponentRegistration[]>();

  /**
   * Input: External event handlers keyed by handler id used in `registry.events`.
   * Accepted values: `AiPayloadEventHandlerMap`
   * Default: `{}`
   */
  readonly eventHandlers = input<AiPayloadEventHandlerMap>({});

  /**
   * Input: ARIA live politeness mode for dynamic render announcements.
   * Accepted values: 'off' | 'polite' | 'assertive'
   * Default: 'off'
   */
  readonly ariaLiveMode = input<'off' | 'polite' | 'assertive'>('off');

  private componentRef: ComponentRef<unknown> | null = null;
  private readonly cleanupFns: (() => void)[] = [];
  private readonly document = inject(DOCUMENT);

  private readonly registryLookup = computed(() => {
    const lookup = new Map<string, AiPayloadComponentRegistration>();
    for (const registration of this.registry()) {
      lookup.set(registration.key, registration);
    }
    return lookup;
  });

  constructor() {
    effect(() => {
      const request = this.renderRequest();
      const lookup = this.registryLookup();
      this.render(request, lookup);
    });
  }

  /** @inheritdoc */
  ngOnDestroy(): void {
    this.clearRender();
  }

  /**
   * Resolves the request against the registry and renders the resolved component.
   *
   * @param request The JSON-driven render request.
   * @param lookup Registry lookup map keyed by registration key.
   * @returns Void. Clears previous render and mounts the requested component when found.
   */
  private render(
    request: AiPayloadRenderRequest,
    lookup: ReadonlyMap<string, AiPayloadComponentRegistration>
  ): void {
    this.clearRender();

    const registration = lookup.get(request.component);
    if (!registration) {
      console.warn(
        `[AiPayloadRendererComponent] Unknown component key: "${request.component}". Skipping render.`
      );
      return;
    }

    const projectableNodes = this.buildProjectableNodes(request, registration);
    const componentRef = this.containerRef().createComponent(registration.component, {
      projectableNodes,
    });

    this.componentRef = componentRef;
    this.applyProps(componentRef, request.props);
    this.bindEvents(componentRef, registration.events);
  }

  /**
   * Applies request props to the rendered component instance.
   *
   * @param componentRef Newly created component reference.
   * @param props Optional property bag from the render request.
   * @returns Void. Uses `setInput` for regular bindings and `writeValue` for `ngModel`.
   */
  private applyProps(
    componentRef: ComponentRef<unknown>,
    props?: Readonly<Record<string, unknown>>
  ): void {
    if (!props) {
      return;
    }

    const instance = componentRef.instance as Record<string, unknown>;

    for (const [key, value] of Object.entries(props)) {
      if (key === CONTROL_VALUE_ACCESSOR_INPUT) {
        const writeValue = instance['writeValue'];
        if (typeof writeValue === 'function') {
          writeValue.call(componentRef.instance, value);
        }
        continue;
      }

      componentRef.setInput(key, value);
    }
  }

  /**
   * Wires configured component events to external handlers.
   *
   * @param componentRef Rendered component reference.
   * @param eventMap Optional component event-to-handler map.
   * @returns Void. Registers listeners/subscriptions and tracks cleanup callbacks.
   * 
   * Callback-style `@Input` (e.g. `btnClick`) — set via `setInput` as a function.
   */
  private bindEvents(
    componentRef: ComponentRef<unknown>,
    eventMap?: Readonly<Record<string, string>>
  ): void {
    if (!eventMap) {
      return;
    }

    const handlerMap = this.eventHandlers();
    const instance = componentRef.instance as Record<string, unknown>;

    for (const [eventName, handlerKey] of Object.entries(eventMap)) {
      const handler = handlerMap[handlerKey];
      if (!handler) {
        continue;
      }

      if (eventName === 'click') {
        this.bindNativeClick(componentRef, handler);
        continue;
      }

      if (eventName === CONTROL_VALUE_ACCESSOR_EVENT) {
        const registerOnChange = instance['registerOnChange'];
        if (typeof registerOnChange === 'function') {
          registerOnChange.call(componentRef.instance, (value: unknown) => {
            handler(value);
          });
        }
        continue;
      }

      const maybeOutput = instance[eventName];
      if (isSubscribableOutput(maybeOutput)) {
        const subscription = maybeOutput.subscribe((value: unknown) => {
          handler(value);
        });
        this.cleanupFns.push(() => subscription.unsubscribe());
        continue;
      }

      componentRef.setInput(eventName, (value: unknown) => {
        handler(value);
      });
    }
  }

  /**
   * Binds a native click listener on the rendered component host element.
   *
   * @param componentRef Rendered component reference.
   * @param handler External click handler.
   * @returns Void. Stores listener cleanup callback.
   */
  private bindNativeClick(
    componentRef: ComponentRef<unknown>,
    handler: (payload: unknown) => void
  ): void {
    const hostElement = componentRef.location.nativeElement;
    if (!(hostElement instanceof Element)) {
      return;
    }

    const listener = (event: Event): void => {
      handler(event);
    };

    hostElement.addEventListener('click', listener);
    this.cleanupFns.push(() => {
      hostElement.removeEventListener('click', listener);
    });
  }

  /**
   * Builds content projection nodes from default and named slot text payloads.
   *
   * @param request The active render request.
   * @param registration Component registration metadata.
   * @returns `Node[][]` for `createComponent` projection, or `undefined` when no content exists.
   */
  private buildProjectableNodes(
    request: AiPayloadRenderRequest,
    registration: AiPayloadComponentRegistration
  ): Node[][] | undefined {
    if (!registration.contentSlots) {
      return request.content ? [[this.document.createTextNode(request.content)]] : undefined;
    }

    const hasNamedSlots = Object.keys(request.slots ?? {}).length > 0;
    if (!request.content && !hasNamedSlots) {
      return undefined;
    }

    return registration.contentSlots.map((slotName) => {
      const text =
        slotName === DEFAULT_SLOT_KEY ? request.content ?? '' : request.slots?.[slotName] ?? '';
      return text ? [this.document.createTextNode(text)] : [];
    });
  }

  /**
   * Tears down the current render cycle.
   *
   * @returns Void. Runs listener cleanups, destroys component ref, and clears container.
   */
  private clearRender(): void {
    for (const cleanupFn of this.cleanupFns) {
      cleanupFn();
    }
    this.cleanupFns.length = 0;

    this.componentRef?.destroy();
    this.componentRef = null;
    this.containerRef().clear();
  }
}

function isSubscribableOutput(value: unknown): value is AiSubscribableOutput {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as { subscribe?: unknown };
  return typeof candidate.subscribe === 'function';
}
