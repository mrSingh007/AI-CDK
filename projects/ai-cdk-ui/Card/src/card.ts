import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  input,
  output,
} from '@angular/core';

export type AiCardElevation = 'none' | 'sm' | 'md' | 'lg';

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
  readonly elevation = input<AiCardElevation>('md');
  readonly clickable = input(false, { transform: booleanAttribute });

  readonly cardClick = output<MouseEvent>();

  onCardClick(event: MouseEvent): void {
    if (!this.clickable()) {
      return;
    }

    this.cardClick.emit(event);
  }

  onCardKeydown(event: KeyboardEvent): void {
    if (!this.clickable()) {
      return;
    }

    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    this.cardClick.emit(new MouseEvent('click'));
  }
}
