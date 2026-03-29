import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'ai-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ai-card-host',
  },
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class AiCardComponent {
  /**
   * Input: Controls whether the card behaves as an interactive surface.
   * Accepted values: boolean
   * Default: false
   */
  readonly clickable = input(false, { transform: booleanAttribute });

  /**
   * Output: Fired when card activation occurs via click or keyboard.
   * Payload: MouseEvent
   * Trigger: Card click, Enter key, or Space key while clickable is true.
   */
  readonly cardClick = output<MouseEvent>();

  /**
   * Handles pointer activation for clickable cards.
   *
   * @param event Native click event from the card container.
   * @returns Void. Emits `cardClick` when clickable is enabled.
   */
  onCardClick(event: MouseEvent): void {
    if (!this.clickable()) {
      return;
    }

    this.cardClick.emit(event);
  }

  /**
   * Handles keyboard activation semantics for clickable cards.
   *
   * @param event Keyboard event from the card container.
   * @returns Void. Emits `cardClick` for Enter and Space keys when clickable is enabled.
   */
  onCardKeydown(event: KeyboardEvent): void {
    if (!this.clickable()) {
      return;
    }

    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    const target = event.currentTarget;
    if (target instanceof HTMLElement) {
      target.click();
    }
  }
}
