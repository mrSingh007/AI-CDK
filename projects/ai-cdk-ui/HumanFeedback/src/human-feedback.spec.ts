import { TestBed } from '@angular/core/testing';
import { AiHumanFeedbackComponent } from './human-feedback';

describe('AiHumanFeedbackComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiHumanFeedbackComponent],
    }).compileComponents();
  });

  it('renders input text and button labels', () => {
    const fixture = TestBed.createComponent(AiHumanFeedbackComponent);

    fixture.componentRef.setInput('text', 'The agent wants to run this action. Continue?');
    fixture.componentRef.setInput('approveButtonText', 'Approve');
    fixture.componentRef.setInput('cancelButtonText', 'Cancel');
    fixture.detectChanges();

    const host: HTMLElement = fixture.nativeElement;
    const description = host.querySelector('.ai-human-feedback__text');
    const approveButton = host.querySelector('.ai-human-feedback__button--approve');
    const rejectButton = host.querySelector('.ai-human-feedback__button--reject');

    expect(description?.textContent?.trim()).toBe('The agent wants to run this action. Continue?');
    expect(approveButton?.textContent?.trim()).toBe('Approve');
    expect(rejectButton?.textContent?.trim()).toBe('Cancel');
  });

  it('emits confirmed once when approve button is clicked', () => {
    const fixture = TestBed.createComponent(AiHumanFeedbackComponent);
    const component = fixture.componentInstance;
    const confirmedSpy = vi.fn();

    component.confirmed.subscribe(confirmedSpy);
    fixture.detectChanges();

    const approveButton = fixture.nativeElement.querySelector(
      '.ai-human-feedback__button--approve',
    ) as HTMLButtonElement;
    approveButton.click();

    expect(confirmedSpy).toHaveBeenCalledTimes(1);
  });

  it('emits rejected once when cancel button is clicked', () => {
    const fixture = TestBed.createComponent(AiHumanFeedbackComponent);
    const component = fixture.componentInstance;
    const rejectedSpy = vi.fn();

    component.rejected.subscribe(rejectedSpy);
    fixture.detectChanges();

    const rejectButton = fixture.nativeElement.querySelector(
      '.ai-human-feedback__button--reject',
    ) as HTMLButtonElement;
    rejectButton.click();

    expect(rejectedSpy).toHaveBeenCalledTimes(1);
  });

  it('uses semantic button type attributes', () => {
    const fixture = TestBed.createComponent(AiHumanFeedbackComponent);
    fixture.detectChanges();

    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll('.ai-human-feedback__button'),
    ) as HTMLButtonElement[];

    expect(buttons).toHaveLength(2);
    expect(buttons[0].getAttribute('type')).toBe('button');
    expect(buttons[1].getAttribute('type')).toBe('button');
  });

  it('exposes description and labels action group for assistive technologies', () => {
    const fixture = TestBed.createComponent(AiHumanFeedbackComponent);
    fixture.detectChanges();

    const host: HTMLElement = fixture.nativeElement;
    const container = host.querySelector('.ai-human-feedback') as HTMLElement;
    const description = host.querySelector('.ai-human-feedback__text') as HTMLElement;
    const actions = host.querySelector('.ai-human-feedback__actions') as HTMLElement;
    const approveButton = host.querySelector('.ai-human-feedback__button--approve') as HTMLElement;
    const rejectButton = host.querySelector('.ai-human-feedback__button--reject') as HTMLElement;

    expect(container.getAttribute('role')).toBe('group');
    expect(description.id.length).toBeGreaterThan(0);
    expect(container.getAttribute('aria-labelledby')).toBe(description.id);
    expect(actions.getAttribute('role')).toBe('group');
    expect(actions.getAttribute('aria-describedby')).toBe(description.id);
    expect(actions.getAttribute('aria-label')).toBe('Approval actions');
    expect(approveButton.textContent?.trim().length).toBeGreaterThan(0);
    expect(rejectButton.textContent?.trim().length).toBeGreaterThan(0);
  });
});
