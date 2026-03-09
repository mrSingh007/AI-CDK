import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Welcome/AI CDK',
  tags: ['autodocs'],
  parameters: {
    controls: {
      hideNoControlsWarning: true,
    },
    docs: {
      description: {
        component: 'Introduction to the AI CDK component libraries and their main usage focus.',
      },
    },
  },
  render: () => ({
    template: `
      <section
        aria-labelledby="ai-cdk-welcome-title"
        style="
          max-width: 760px;
          margin: 2rem auto;
          padding: 2rem;
          border: 1px solid #d1d5db;
          border-radius: 16px;
          background: #f8fafc;
          color: #0f172a;
          line-height: 1.55;
        "
      >
        <p style="margin: 0 0 0.75rem; font-size: 0.875rem; font-weight: 700; letter-spacing: 0.04em;">
          AI CDK
        </p>
        <h1 id="ai-cdk-welcome-title" style="margin: 0 0 1rem; font-size: 2rem; line-height: 1.2;">
          Welcome to the AI Component Library
        </h1>
        <p style="margin: 0 0 1rem;">
          This library is AI-based and designed for building AI chatbots and agent experiences.
        </p>
        <p style="margin: 0 0 1rem;">
          Use renderer component to render component inside your chatbot. AG-UI or Vercel-AI protocol, only json is required.
        </p>
        <p style="margin: 0 0 1rem;">
          Components can be composed to create conversational interfaces, tool workflows, and assistant UI flows.
        </p>
        <p style="margin: 0;">
          The library is highly flexible and can be customized through component APIs and design tokens. Open style stories and play with controls.
        </p>
      </section>
    `,
  }),
};

export default meta;

type Story = StoryObj;

export const Overview: Story = {
  name: 'Welcome',
};
