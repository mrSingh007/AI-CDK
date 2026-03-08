import { TestBed } from '@angular/core/testing';
import { AiSidebarComponent } from '../SideBar/src/sidebar';

describe('AiSidebarComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiSidebarComponent],
    }).compileComponents();
  });

  it('renders custom placeholder text', () => {
    const fixture = TestBed.createComponent(AiSidebarComponent);
    fixture.componentRef.setInput('path', '/api/chat-stream');
    fixture.componentRef.setInput('placeholder', 'Ask the assistant');
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('.ai-sidebar__input') as HTMLInputElement;
    expect(input.placeholder).toBe('Ask the assistant');
  });

  it('emits clear and close outputs when toolbar buttons are clicked', () => {
    const fixture = TestBed.createComponent(AiSidebarComponent);
    fixture.componentRef.setInput('path', '/api/chat-stream');
    const component = fixture.componentInstance;
    const clearSpy = vi.fn();
    const closeSpy = vi.fn();

    component.clearClicked.subscribe(clearSpy);
    component.xClicked.subscribe(closeSpy);
    fixture.detectChanges();

    const clearButton = fixture.nativeElement.querySelector(
      'button[aria-label="Clear conversation"]',
    ) as HTMLButtonElement;
    const closeButton = fixture.nativeElement.querySelector(
      'button[aria-label="Close sidebar"]',
    ) as HTMLButtonElement;

    clearButton.click();
    closeButton.click();

    expect(clearSpy).toHaveBeenCalledTimes(1);
    expect(closeSpy).toHaveBeenCalledTimes(1);
  });
});
