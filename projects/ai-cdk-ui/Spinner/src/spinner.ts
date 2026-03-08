import { ChangeDetectionStrategy, Component } from '@angular/core';

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
}
