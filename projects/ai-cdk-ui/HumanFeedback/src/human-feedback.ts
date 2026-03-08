import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

let nextHumanFeedbackId = 0;

@Component({
  selector: 'ai-human-feedback',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ai-human-feedback-host',
  },
  templateUrl: './human-feedback.html',
  styleUrl: './human-feedback.scss',
})
export class AiHumanFeedbackComponent {
  private readonly instanceId = nextHumanFeedbackId++;

  /**
   * Stable description id used to associate prompt text with the action group.
   */
  readonly descriptionId = `ai-human-feedback-description-${this.instanceId}`;

  /**
   * Input: Prompt text describing the decision to the user.
   * Accepted values: string
   * Default: 'Should I proceed?'
   */
  readonly text = input('Should I proceed?');

  /**
   * Input: Label displayed on the confirm button.
   * Accepted values: string
   * Default: 'Confirm'
   */
  readonly approveButtonText = input('Confirm');

  /**
   * Input: Label displayed on the reject button.
   * Accepted values: string
   * Default: 'Reject'
   */
  readonly cancelButtonText = input('Reject');

  /**
   * Output: Fired when the confirm button is clicked.
   * Payload: void
   * Trigger: Click on the approve action button.
   */
  readonly confirmed = output<void>();

  /**
   * Output: Fired when the reject button is clicked.
   * Payload: void
   * Trigger: Click on the cancel action button.
   */
  readonly rejected = output<void>();

  /**
   * Handles confirm button clicks.
   *
   * @returns Void. Emits the `confirmed` output.
   */
  onConfirmClick(): void {
    this.confirmed.emit();
  }

  /**
   * Handles reject button clicks.
   *
   * @returns Void. Emits the `rejected` output.
   */
  onRejectClick(): void {
    this.rejected.emit();
  }
}
