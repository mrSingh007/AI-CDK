import { bootstrapApplication } from '@angular/platform-browser';
import { AiSandboxComponent } from './sandbox';

bootstrapApplication(AiSandboxComponent).catch((error: unknown) => {
  // Storybook host bootstrap errors should still surface in terminal output.
  console.error(error);
});
