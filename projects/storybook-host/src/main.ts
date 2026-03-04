import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

@Component({
  selector: 'ai-storybook-host-root',
  template: '',
})
class StorybookHostRootComponent {}

bootstrapApplication(StorybookHostRootComponent).catch((error: unknown) => {
  // Storybook host bootstrap errors should still surface in terminal output.
  console.error(error);
});
