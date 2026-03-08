import { TestBed } from '@angular/core/testing';
import { type AiAnswer, type AiQuestion, AiQuestionnaireComponent } from './questionnaire';

const SINGLE_SELECT_WITH_INPUT_QUESTION: AiQuestion[] = [
  {
    id: 'destination',
    question: 'Choose destination',
    options: ['UK', 'USA', 'Germany'],
  },
];

const MULTI_SELECT_WITH_INPUT_QUESTION: AiQuestion[] = [
  {
    id: 'topics',
    question: 'Select topics',
    options: ['Design', 'Engineering', 'Marketing'],
    multiSelect: true,
  },
];

describe('AiQuestionnaireComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiQuestionnaireComponent],
    }).compileComponents();
  });

  it('clears text when selecting an option in single-select input mode', () => {
    const fixture = TestBed.createComponent(AiQuestionnaireComponent);
    fixture.componentRef.setInput('questions', SINGLE_SELECT_WITH_INPUT_QUESTION);
    fixture.componentRef.setInput('allowInput', true);
    fixture.componentRef.setInput('multiSelect', false);
    fixture.detectChanges();

    const inputElement = fixture.nativeElement.querySelector(
      '.ai-questionnaire__input',
    ) as HTMLInputElement;
    inputElement.value = 'Free text';
    inputElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const optionButton = fixture.nativeElement.querySelector(
      '.ai-questionnaire__option',
    ) as HTMLButtonElement;
    optionButton.click();
    fixture.detectChanges();

    expect(inputElement.value).toBe('');
    expect(fixture.componentInstance.freeText()).toBe('');
  });

  it('clears selected option when typing in single-select input mode', () => {
    const fixture = TestBed.createComponent(AiQuestionnaireComponent);
    fixture.componentRef.setInput('questions', SINGLE_SELECT_WITH_INPUT_QUESTION);
    fixture.componentRef.setInput('allowInput', true);
    fixture.componentRef.setInput('multiSelect', false);
    fixture.detectChanges();

    const optionButton = fixture.nativeElement.querySelector(
      '.ai-questionnaire__option',
    ) as HTMLButtonElement;
    optionButton.click();
    fixture.detectChanges();

    const inputElement = fixture.nativeElement.querySelector(
      '.ai-questionnaire__input',
    ) as HTMLInputElement;
    inputElement.value = 'My custom response';
    inputElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(fixture.componentInstance.selectedOptions()).toEqual([]);
  });

  it('normalizes submitted answers to input-only in single-select input mode', () => {
    const fixture = TestBed.createComponent(AiQuestionnaireComponent);
    fixture.componentRef.setInput('questions', SINGLE_SELECT_WITH_INPUT_QUESTION);
    fixture.componentRef.setInput('allowInput', true);
    fixture.componentRef.setInput('multiSelect', false);
    fixture.detectChanges();

    const submittedSpy = vi.fn<(answer: AiAnswer) => void>();
    fixture.componentInstance.answerSubmit.subscribe(submittedSpy);

    fixture.componentInstance.selectedOptions.set(['UK']);
    fixture.componentInstance.freeText.set('User provided input');
    fixture.componentInstance.submitCurrentAnswer();

    expect(submittedSpy).toHaveBeenCalledWith({
      questionId: 'destination',
      selected: [],
      text: 'User provided input',
    });
  });

  it('does not clear multi-select options when typing', () => {
    const fixture = TestBed.createComponent(AiQuestionnaireComponent);
    fixture.componentRef.setInput('questions', MULTI_SELECT_WITH_INPUT_QUESTION);
    fixture.componentRef.setInput('allowInput', true);
    fixture.componentRef.setInput('multiSelect', false);
    fixture.detectChanges();

    const checkbox = fixture.nativeElement.querySelector(
      '.ai-questionnaire__multi-input',
    ) as HTMLInputElement;
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    const inputElement = fixture.nativeElement.querySelector(
      '.ai-questionnaire__input',
    ) as HTMLInputElement;
    inputElement.value = 'Also include data science';
    inputElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(fixture.componentInstance.selectedOptions()).toEqual(['Design']);
  });
});
