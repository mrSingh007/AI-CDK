import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type AiSpinnerSize = 'xs' | 'sm' | 'md';

@Component({
  selector: 'ai-spinner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ai-spinner-host',
    'aria-hidden': 'true',
  },
  templateUrl: './spinner.html',
  styleUrl: './spinner.scss',
})
export class AiSpinnerComponent {
  readonly size = input<AiSpinnerSize>('sm');
}
