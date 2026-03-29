import { TestBed } from '@angular/core/testing';
import { AiCardComponent } from './card';

describe('AiCardComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiCardComponent],
    }).compileComponents();
  });

  it('emits one click event when activated with Enter from the keyboard', () => {
    const fixture = TestBed.createComponent(AiCardComponent);
    fixture.componentRef.setInput('clickable', true);
    fixture.detectChanges();

    const cardClickSpy = vi.fn<(event: MouseEvent) => void>();
    fixture.componentInstance.cardClick.subscribe(cardClickSpy);

    const card = fixture.nativeElement.querySelector('.ai-card') as HTMLElement;
    card.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    fixture.detectChanges();

    expect(cardClickSpy).toHaveBeenCalledTimes(1);
    const event = cardClickSpy.mock.calls[0][0];
    expect(event).toBeInstanceOf(MouseEvent);
    expect(event.type).toBe('click');
    expect(event.target).toBe(card);
  });

  it('does not emit when the card is not clickable', () => {
    const fixture = TestBed.createComponent(AiCardComponent);
    fixture.detectChanges();

    const cardClickSpy = vi.fn<(event: MouseEvent) => void>();
    fixture.componentInstance.cardClick.subscribe(cardClickSpy);

    const card = fixture.nativeElement.querySelector('.ai-card') as HTMLElement;
    card.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    card.click();
    fixture.detectChanges();

    expect(cardClickSpy).not.toHaveBeenCalled();
  });
});
