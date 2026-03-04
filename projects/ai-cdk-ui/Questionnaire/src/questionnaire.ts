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

  readonly questions = input<AiQuestion[]>([]);
  readonly allowInput = input(true, { transform: booleanAttribute });
  readonly multiSelect = input(false, { transform: booleanAttribute });

  readonly answerSubmit = output<AiAnswer>();
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

  isOptionSelected(option: string): boolean {
    return this.selectedOptions().includes(option);
  }

  onSingleOptionSelect(option: string): void {
    this.selectedOptions.set([option]);

    if (!this.allowInput() && !this.currentMultiSelect()) {
      this.submitCurrentAnswer();
    }
  }

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

  onMultiOptionChange(option: string, event: Event): void {
    const input = event.target as HTMLInputElement | null;
    this.onMultiOptionToggle(option, Boolean(input?.checked));
  }

  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.freeText.set(input.value);
  }

  submitCurrentAnswer(): void {
    const question = this.currentQuestion();
    if (!question) {
      return;
    }

    const nextAnswer: AiAnswer = {
      questionId: question.id,
      selected: [...this.selectedOptions()],
      ...(this.allowInput() && this.freeText().trim().length > 0
        ? { text: this.freeText().trim() }
        : {}),
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
