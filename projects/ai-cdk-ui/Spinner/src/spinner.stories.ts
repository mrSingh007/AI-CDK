import type { Meta, StoryObj } from '@storybook/angular';
import { AiSpinnerComponent, type AiSpinnerSize } from '@ai-cdk/ui/Spinner';

const INPUTS_CATEGORY = 'Inputs';
const TOKENS_CATEGORY = 'SCSS Tokens';

const SPINNER_SIZES: AiSpinnerSize[] = ['xs', 'sm', 'md'];

interface AiSpinnerStoryArgs {
  readonly size: AiSpinnerSize;
}

interface AiSpinnerTokenStoryArgs {
  readonly spinnerColor: string;
  readonly spinnerTrackColor: string;
  readonly spinnerSizeXs: string;
  readonly spinnerSizeSm: string;
  readonly spinnerSizeMd: string;
  readonly spinnerStrokeWidth: string;
  readonly spinnerDuration: string;
}

function buildSpinnerTokenStyles(args: AiSpinnerTokenStoryArgs): string {
  return [
    `--ai-spinner-color: ${args.spinnerColor}`,
    `--ai-spinner-track-color: ${args.spinnerTrackColor}`,
    `--ai-spinner-size-xs: ${args.spinnerSizeXs}`,
    `--ai-spinner-size-sm: ${args.spinnerSizeSm}`,
    `--ai-spinner-size-md: ${args.spinnerSizeMd}`,
    `--ai-spinner-stroke-width: ${args.spinnerStrokeWidth}`,
    `--ai-spinner-duration: ${args.spinnerDuration}`,
  ].join('; ');
}

const meta: Meta<AiSpinnerStoryArgs> = {
  title: 'UI/Spinner',
  component: AiSpinnerComponent,
  tags: ['autodocs'],
  argTypes: {
    size: {
      options: SPINNER_SIZES,
      control: { type: 'select' },
      table: {
        category: INPUTS_CATEGORY,
        defaultValue: { summary: 'sm' },
      },
    },
  },
  args: {
    size: 'sm',
  },
};

export default meta;
type Story = StoryObj<AiSpinnerStoryArgs>;
type TokenStory = StoryObj<AiSpinnerStoryArgs & AiSpinnerTokenStoryArgs>;

export const Small: Story = {};

export const Medium: Story = {
  args: {
    size: 'md',
  },
};

export const CustomColorToken: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div style="--ai-spinner-inline-color: #ef4444;">
        <ai-spinner [size]="size"></ai-spinner>
      </div>
    `,
  }),
  args: {
    size: 'md',
  },
};

export const StyleTokens: TokenStory = {
  render: (args) => ({
    props: {
      ...args,
      tokenStyles: buildSpinnerTokenStyles(args),
    },
    template: `
      <ai-spinner [style]="tokenStyles" [size]="'md'"></ai-spinner>
    `,
  }),
  argTypes: {
    size: {
      control: false,
      table: { disable: true },
    },
    spinnerColor: {
      name: '--ai-spinner-color',
      control: { type: 'color' },
      table: {
        category: TOKENS_CATEGORY,
        defaultValue: { summary: '#3b82f6' },
      },
    },
    spinnerTrackColor: {
      name: '--ai-spinner-track-color',
      control: { type: 'color' },
      table: {
        category: TOKENS_CATEGORY,
        defaultValue: { summary: '#e5e7eb' },
      },
    },
    spinnerSizeXs: {
      name: '--ai-spinner-size-xs',
      control: { type: 'text' },
      table: {
        category: TOKENS_CATEGORY,
        defaultValue: { summary: '12px' },
      },
    },
    spinnerSizeSm: {
      name: '--ai-spinner-size-sm',
      control: { type: 'text' },
      table: {
        category: TOKENS_CATEGORY,
        defaultValue: { summary: '18px' },
      },
    },
    spinnerSizeMd: {
      name: '--ai-spinner-size-md',
      control: { type: 'text' },
      table: {
        category: TOKENS_CATEGORY,
        defaultValue: { summary: '24px' },
      },
    },
    spinnerStrokeWidth: {
      name: '--ai-spinner-stroke-width',
      control: { type: 'text' },
      table: {
        category: TOKENS_CATEGORY,
        defaultValue: { summary: '2.5px' },
      },
    },
    spinnerDuration: {
      name: '--ai-spinner-duration',
      control: { type: 'text' },
      table: {
        category: TOKENS_CATEGORY,
        defaultValue: { summary: '0.75s' },
      },
    },
  },
  args: {
    spinnerColor: '#3b82f6',
    spinnerTrackColor: '#e5e7eb',
    spinnerSizeXs: '12px',
    spinnerSizeSm: '18px',
    spinnerSizeMd: '24px',
    spinnerStrokeWidth: '2.5px',
    spinnerDuration: '0.75s',
  },
};
