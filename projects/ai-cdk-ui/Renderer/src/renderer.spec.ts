import { Component, forwardRef, input, output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  AiPayloadComponentRegistration,
  AiPayloadEventHandlerMap,
  AiPayloadRenderRequest,
  AiPayloadRendererComponent,
} from './renderer';

@Component({
  selector: 'ai-stub-simple',
  template: `<span>{{ label() }}</span>`,
})
class StubSimpleComponent {
  readonly label = input('');
}

@Component({
  selector: 'ai-stub-default-slot',
  template: `<div class="slot"><ng-content /></div>`,
})
class StubDefaultSlotComponent {}

@Component({
  selector: 'ai-stub-named-slots',
  template: `
    <header><ng-content select="[slot=header]" /></header>
    <main><ng-content /></main>
    <footer><ng-content select="[slot=footer]" /></footer>
  `,
})
class StubNamedSlotsComponent {}

@Component({
  selector: 'ai-stub-click',
  template: `<button type="button">Click me</button>`,
})
class StubClickComponent {}

@Component({
  selector: 'ai-stub-output',
  template: ``,
})
class StubOutputComponent {
  readonly valueChange = output<string>();
}

class StubSubscribableValueChange {
  private readonly listeners = new Set<(value: unknown) => void>();

  subscribe(listener: (value: unknown) => void): { unsubscribe(): void } {
    this.listeners.add(listener);
    return {
      unsubscribe: () => {
        this.listeners.delete(listener);
      },
    };
  }

  emit(value: unknown): void {
    for (const listener of this.listeners) {
      listener(value);
    }
  }
}

@Component({
  selector: 'ai-stub-subscribable-output',
  template: ``,
})
class StubSubscribableOutputComponent {
  readonly valueChange = new StubSubscribableValueChange();
}

@Component({
  selector: 'ai-stub-callback-input',
  template: `<button type="button" (click)="onClick()('clicked')">Go</button>`,
})
class StubCallbackInputComponent {
  readonly onClick = input<(value: string) => void>(() => undefined);
}

@Component({
  selector: 'ai-stub-cva',
  template: `<input />`,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => StubCvaComponent), multi: true },
  ],
})
class StubCvaComponent implements ControlValueAccessor {
  value: unknown = null;

  private changeFn: (value: unknown) => void = () => undefined;
  private touchedFn: () => void = () => undefined;

  writeValue(value: unknown): void {
    this.value = value;
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.changeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.touchedFn = fn;
  }

  simulateChange(value: unknown): void {
    this.changeFn(value);
  }
}

function createFixture(
  renderRequest: AiPayloadRenderRequest,
  registry: readonly AiPayloadComponentRegistration[],
  eventHandlers: AiPayloadEventHandlerMap = {}
): ComponentFixture<AiPayloadRendererComponent> {
  const fixture = TestBed.createComponent(AiPayloadRendererComponent);
  fixture.componentRef.setInput('renderRequest', renderRequest);
  fixture.componentRef.setInput('registry', registry);
  fixture.componentRef.setInput('eventHandlers', eventHandlers);
  fixture.detectChanges();
  return fixture;
}

describe('AiPayloadRendererComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AiPayloadRendererComponent],
    });
  });

  it('renders a registered component', () => {
    const registry: AiPayloadComponentRegistration[] = [
      { key: 'simple', component: StubSimpleComponent },
    ];

    const fixture = createFixture({ name: 'simple', props: { label: 'Hello' } }, registry);

    const rendered = fixture.nativeElement.querySelector('ai-stub-simple');
    expect(rendered).toBeTruthy();
    expect(rendered.textContent).toContain('Hello');
  });

  it('warns and skips when the component key is missing in registry', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const registry: AiPayloadComponentRegistration[] = [
      { key: 'simple', component: StubSimpleComponent },
    ];

    const fixture = createFixture({ name: 'unknown-widget' }, registry);

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Unknown component key: "unknown-widget"')
    );
    expect(fixture.nativeElement.querySelector('ai-stub-simple')).toBeNull();
    warnSpy.mockRestore();
  });

  it('re-renders when renderRequest changes', () => {
    const registry: AiPayloadComponentRegistration[] = [
      { key: 'simple', component: StubSimpleComponent },
    ];

    const fixture = createFixture({ name: 'simple', props: { label: 'First' } }, registry);
    expect(fixture.nativeElement.textContent).toContain('First');

    fixture.componentRef.setInput('renderRequest', { name: 'simple', props: { label: 'Second' } });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Second');
  });

  it('applies props via setInput', () => {
    const registry: AiPayloadComponentRegistration[] = [
      { key: 'simple', component: StubSimpleComponent },
    ];

    const fixture = createFixture({ name: 'simple', props: { label: 'Test Value' } }, registry);

    expect(fixture.nativeElement.textContent).toContain('Test Value');
  });

  it('handles ngModel prop via writeValue for CVA components', () => {
    const registry: AiPayloadComponentRegistration[] = [
      { key: 'cva', component: StubCvaComponent },
    ];

    const fixture = createFixture({ name: 'cva', props: { ngModel: 'initial' } }, registry);
    const cvaInstance = fixture.debugElement.children[0]?.componentInstance as StubCvaComponent;

    expect(cvaInstance.value).toBe('initial');
  });

  it('wires native click events', () => {
    const handler = vi.fn();
    const registry: AiPayloadComponentRegistration[] = [
      { key: 'clickable', component: StubClickComponent, events: { click: 'onClick' } },
    ];

    const fixture = createFixture({ name: 'clickable' }, registry, { onClick: handler });
    const hostElement = fixture.nativeElement.querySelector('ai-stub-click') as HTMLElement;
    hostElement.click();

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(expect.any(Event));
  });

  it('subscribes to output() events', () => {
    const handler = vi.fn();
    const registry: AiPayloadComponentRegistration[] = [
      { key: 'output', component: StubOutputComponent, events: { valueChange: 'onValueChange' } },
    ];

    const fixture = createFixture({ name: 'output' }, registry, { onValueChange: handler });
    const instance = fixture.debugElement.children[0].componentInstance as StubOutputComponent;

    instance.valueChange.emit('hello');

    expect(handler).toHaveBeenCalledWith('hello');
  });

  it('wires callback-style inputs as handlers', () => {
    const handler = vi.fn();
    const registry: AiPayloadComponentRegistration[] = [
      { key: 'callback', component: StubCallbackInputComponent, events: { onClick: 'onAction' } },
    ];

    const fixture = createFixture({ name: 'callback' }, registry, { onAction: handler });
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    button.click();
    fixture.detectChanges();

    expect(handler).toHaveBeenCalledWith('clicked');
  });

  it('wires ngModelChange via registerOnChange', () => {
    const handler = vi.fn();
    const registry: AiPayloadComponentRegistration[] = [
      { key: 'cva', component: StubCvaComponent, events: { ngModelChange: 'onModelChange' } },
    ];

    const fixture = createFixture({ name: 'cva' }, registry, { onModelChange: handler });
    const cvaInstance = fixture.debugElement.children[0].componentInstance as StubCvaComponent;

    cvaInstance.simulateChange('new value');

    expect(handler).toHaveBeenCalledWith('new value');
  });

  it('projects default slot content when no contentSlots are defined', () => {
    const registry: AiPayloadComponentRegistration[] = [
      { key: 'slot', component: StubDefaultSlotComponent },
    ];

    const fixture = createFixture({ name: 'slot', content: 'Projected text' }, registry);

    const slotElement = fixture.nativeElement.querySelector('.slot');
    expect(slotElement.textContent).toContain('Projected text');
  });

  it('projects named slots in template order via contentSlots', () => {
    const registry: AiPayloadComponentRegistration[] = [
      {
        key: 'named',
        component: StubNamedSlotsComponent,
        contentSlots: ['header', '', 'footer'],
      },
    ];

    const fixture = createFixture(
      {
        name: 'named',
        content: 'Body text',
        slots: { header: 'Header text', footer: 'Footer text' },
      },
      registry
    );

    const element = fixture.nativeElement;
    expect(element.querySelector('header').textContent).toContain('Header text');
    expect(element.querySelector('main').textContent).toContain('Body text');
    expect(element.querySelector('footer').textContent).toContain('Footer text');
  });

  it('cleans up subscriptions and listeners on destroy', () => {
    const handler = vi.fn();
    const registry: AiPayloadComponentRegistration[] = [
      {
        key: 'output',
        component: StubSubscribableOutputComponent,
        events: { valueChange: 'onValueChange' },
      },
    ];

    const fixture = createFixture({ name: 'output' }, registry, { onValueChange: handler });
    const instance = fixture.debugElement.children[0]
      .componentInstance as StubSubscribableOutputComponent;

    fixture.destroy();
    instance.valueChange.emit('after destroy');

    expect(handler).not.toHaveBeenCalled();
  });
});
