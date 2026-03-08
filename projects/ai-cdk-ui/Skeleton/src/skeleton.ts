import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  input,
} from '@angular/core';

@Component({
  selector: 'ai-skeleton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ai-skeleton-host',
    'aria-hidden': 'true',
  },
  templateUrl: './skeleton.html',
  styleUrl: './skeleton.scss',
})
export class AiSkeletonComponent {
  /**
   * Input: Enables or disables shimmer animation.
   * Accepted values: boolean
   * Default: true
   */
  readonly animate = input(true, { transform: booleanAttribute });
}
