import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';

export interface AiQuestion {
  readonly id: string;
  readonly question: string;
  readonly options: string[];
  readonly multiSelect?: boolean;
}

export interface AiAnswer {
  readonly questionId: string;
  readonly selected: string[];
  readonly text?: string;
}

let nextQuestionnaireId = 0;

@Component({
  selector: 'ai-questionnaire',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ai-questionnaire-host',
  },
  templateUrl: './questionnaire.html',
  styleUrl: './questionnaire.scss',
})
export class AiQuestionnaireComponent {
  private readonly instanceId = nextQuestionnaireId++;

  /**
   * Input: Ordered question list displayed by the questionnaire.
   * Accepted values: `AiQuestion[]`
   * Default: `[]`
   */
  readonly questions = input<AiQuestion[]>([]);

  /**
   * Input: Enables free-text input for each question.
   * Accepted values: boolean
   * Default: true
   */
  readonly allowInput = input(true, { transform: booleanAttribute });

  /**
   * Input: Enables multi-select mode unless overridden per-question.
   * Accepted values: boolean
   * Default: false
   */
  readonly multiSelect = input(false, { transform: booleanAttribute });

  /**
   * Output: Fired whenever an answer is submitted for the current question.
   * Payload: `AiAnswer`
   * Trigger: Option click auto-submit or explicit submit action.
   */
  readonly answerSubmit = output<AiAnswer>();

  /**
   * Output: Fired after all questions have been answered.
   * Payload: `AiAnswer[]`
   * Trigger: Submission of the final question.
   */
  readonly completed = output<AiAnswer[]>();

  readonly currentIndex = signal(0);
  readonly answersByQuestion = signal<Record<string, AiAnswer>>({});
  readonly selectedOptions = signal<string[]>([]);
  readonly freeText = signal('');
  readonly inputId = `ai-questionnaire-input-${this.instanceId}`;

  readonly currentQuestion = computed(() => this.questions()[this.currentIndex()] ?? null);

  readonly currentMultiSelect = computed(() => {
    const question = this.currentQuestion();
    if (!question) {
      return false;
    }

    return question.multiSelect ?? this.multiSelect();
  });

  readonly showNextButton = computed(() => {
    if (!this.currentQuestion()) {
      return false;
    }

    return this.allowInput() || this.currentMultiSelect();
  });
  readonly singleSelectWithInput = computed(() => this.allowInput() && !this.currentMultiSelect());
  readonly canSubmitCurrentAnswer = computed(() => {
    if (!this.currentQuestion()) {
      return false;
    }

    return this.selectedOptions().length > 0 || this.freeText().trim().length > 0;
  });
  readonly isFinalQuestion = computed(() => {
    const questionCount = this.questions().length;
    return questionCount > 0 && this.currentIndex() === questionCount - 1;
  });

  constructor() {
    effect(() => {
      this.questions();
      this.currentIndex.set(0);
      this.answersByQuestion.set({});
      this.selectedOptions.set([]);
      this.freeText.set('');
    });

    effect(() => {
      const question = this.currentQuestion();
      if (!question) {
        this.selectedOptions.set([]);
        this.freeText.set('');
        return;
      }

      const existing = this.answersByQuestion()[question.id];
      this.selectedOptions.set(existing ? [...existing.selected] : []);
      this.freeText.set(existing?.text ?? '');
    });
  }

  /**
   * Checks whether an option is currently selected in local state.
   *
   * @param option Option label to evaluate.
   * @returns `true` when the option is selected; otherwise `false`.
   */
  isOptionSelected(option: string): boolean {
    return this.selectedOptions().includes(option);
  }

  /**
   * Handles single-select option interactions.
   *
   * @param option Option label selected by the user.
   * @returns Void. Updates selected state and may auto-submit.
   */
  onSingleOptionSelect(option: string): void {
    this.selectedOptions.set([option]);
    if (this.singleSelectWithInput()) {
      this.freeText.set('');
    }

    if (!this.allowInput() && !this.currentMultiSelect()) {
      this.submitCurrentAnswer();
    }
  }

  /**
   * Updates multi-select state for a specific option.
   *
   * @param option Option label to toggle.
   * @param checked Whether the option should be selected.
   * @returns Void. Updates `selectedOptions` using immutable signal updates.
   */
  onMultiOptionToggle(option: string, checked: boolean): void {
    this.selectedOptions.update((existing) => {
      if (checked) {
        if (existing.includes(option)) {
          return existing;
        }

        return [...existing, option];
      }

      return existing.filter((item) => item !== option);
    });
  }

  /**
   * Maps checkbox DOM events to multi-select state updates.
   *
   * @param option Option label tied to the changed checkbox.
   * @param event Native checkbox change event.
   * @returns Void. Delegates to `onMultiOptionToggle`.
   */
  onMultiOptionChange(option: string, event: Event): void {
    const input = event.target as HTMLInputElement | null;
    this.onMultiOptionToggle(option, Boolean(input?.checked));
  }

  /**
   * Updates the free-text signal from the input field.
   *
   * @param event Native input event from the text control.
   * @returns Void. Stores the current input value.
   */
  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    this.freeText.set(value);

    if (this.singleSelectWithInput() && value.trim().length > 0) {
      this.selectedOptions.set([]);
    }
  }

  /**
   * Persists and emits the current answer, then advances or completes the flow.
   *
   * @returns Void. Emits `answerSubmit` and optionally `completed`.
   */
  submitCurrentAnswer(): void {
    const question = this.currentQuestion();
    if (!question || !this.canSubmitCurrentAnswer()) {
      return;
    }

    const normalizedFreeText = this.freeText().trim();
    const normalizedSelected =
      this.singleSelectWithInput() && normalizedFreeText.length > 0
        ? []
        : [...this.selectedOptions()];

    const nextAnswer: AiAnswer = {
      questionId: question.id,
      selected: normalizedSelected,
      ...(this.allowInput() && normalizedFreeText.length > 0 ? { text: normalizedFreeText } : {}),
    };

    const updatedAnswers = {
      ...this.answersByQuestion(),
      [question.id]: nextAnswer,
    };

    this.answersByQuestion.set(updatedAnswers);
    this.answerSubmit.emit(nextAnswer);

    const nextIndex = this.currentIndex() + 1;
    if (nextIndex >= this.questions().length) {
      const completedAnswers = this.questions()
        .map((item) => updatedAnswers[item.id])
        .filter((item): item is AiAnswer => Boolean(item));

      this.currentIndex.set(this.questions().length);
      this.completed.emit(completedAnswers);
      return;
    }

    this.currentIndex.set(nextIndex);
  }
}
