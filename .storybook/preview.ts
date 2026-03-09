import type { Preview } from '@storybook/angular';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    options: {
      storySort: {
        order: [
          'Getting Started',
          ['Introduction', 'Installation', 'AI-Protocol Examples'],
          'UI',
          'Chat',
        ],
      },
      theme: {
        base: 'dark',
        brandTitle: 'AI CDK',
        brandUrl: './',
      },
      showPanel: false,
    },
  },
};

export default preview;
