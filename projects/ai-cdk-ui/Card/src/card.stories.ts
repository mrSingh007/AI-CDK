import type { Meta, StoryObj } from '@storybook/angular';
import { AiCardComponent, type AiCardElevation } from '@ai-cdk/ui/Card';

const INPUTS_CATEGORY = 'Inputs';
const OUTPUTS_CATEGORY = 'Outputs';
const TOKENS_CATEGORY = 'SCSS Tokens';

const CARD_SIZES: AiCardElevation[] = ['none', 'sm', 'md', 'lg'];

interface AiCardStoryArgs {
  readonly size: AiCardElevation;
  readonly clickable: boolean;
  readonly cardClick: (event: MouseEvent) => void;
}

interface AiCardTokenStoryArgs {
  readonly cardBg: string;
  readonly cardBorder: string;
  readonly cardBorderRadius: string;
  readonly cardPadding: string;
  readonly cardShadowSm: string;
  readonly cardShadowMd: string;
  readonly cardShadowLg: string;
  readonly cardHoverShadow: string;
  readonly cardColor: string;
}

function buildCardTokenStyles(args: AiCardTokenStoryArgs): string {
  return [
    `--ai-card-bg: ${args.cardBg}`,
    `--ai-card-border: ${args.cardBorder}`,
    `--ai-card-border-radius: ${args.cardBorderRadius}`,
    `--ai-card-padding: ${args.cardPadding}`,
    `--ai-card-shadow-sm: ${args.cardShadowSm}`,
    `--ai-card-shadow-md: ${args.cardShadowMd}`,
    `--ai-card-shadow-lg: ${args.cardShadowLg}`,
    `--ai-card-hover-shadow: ${args.cardHoverShadow}`,
    `--ai-card-color: ${args.cardColor}`,
  ].join('; ');
}

const meta: Meta<AiCardStoryArgs> = {
  title: 'UI/Card',
  component: AiCardComponent,
  tags: ['autodocs'],
  render: (args) => ({
    props: args,
    template: `
      <ai-card
        [elevation]="size"
        [clickable]="clickable"
        (cardClick)="cardClick($event)"
      >
        <h3 slot="header">Card Header</h3>
        <p>Main card body content.</p>
        <small slot="footer">Footer area</small>
      </ai-card>
    `,
  }),
  argTypes: {
    size: {
      options: CARD_SIZES,
      control: { type: 'select' },
      description: 'Card size variant (maps to the `elevation` input).',
      table: {
        category: INPUTS_CATEGORY,
        defaultValue: { summary: 'md' },
      },
    },
    clickable: {
      control: { type: 'boolean' },
      table: {
        category: INPUTS_CATEGORY,
      },
    },
    cardClick: {
      action: 'cardClick',
      control: false,
      table: {
        category: OUTPUTS_CATEGORY,
      },
    },
  },
  args: {
    size: 'md',
    clickable: false,
  },
};

export default meta;
type Story = StoryObj<AiCardStoryArgs>;
type TokenStory = StoryObj<AiCardStoryArgs & AiCardTokenStoryArgs>;

export const Basic: Story = {};

export const Clickable: Story = {
  args: {
    clickable: true,
    size: 'lg',
  },
  render: (args) => ({
    props: args,
    template: `
      <ai-card
        [elevation]="size"
        [clickable]="clickable"
        (cardClick)="cardClick($event)"
      >
        <strong slot="header">Interactive Card</strong>
        <p>Click or press Enter/Space.</p>
      </ai-card>
    `,
  }),
};

export const StyleTokens: TokenStory = {
  render: (args) => ({
    props: {
      ...args,
      tokenStyles: buildCardTokenStyles(args),
    },
    template: `
      <ai-card [style]="tokenStyles" [elevation]="'md'" [clickable]="false">
        <h3 slot="header">Styled Card</h3>
        <p>Adjust SCSS token values from Controls.</p>
        <small slot="footer">Token Preview</small>
      </ai-card>
    `,
  }),
  argTypes: {
    size: {
      control: false,
      table: { disable: true },
    },
    clickable: {
      control: false,
      table: { disable: true },
    },
    cardClick: {
      control: false,
      table: { disable: true },
    },
    cardBg: {
      name: '--ai-card-bg',
      control: { type: 'color' },
      table: {
        category: TOKENS_CATEGORY,
        defaultValue: { summary: '#ffffff' },
      },
    },
    cardBorder: {
      name: '--ai-card-border',
      control: { type: 'text' },
      table: {
        category: TOKENS_CATEGORY,
        defaultValue: { summary: '1px solid #e5e7eb' },
      },
    },
    cardBorderRadius: {
      name: '--ai-card-border-radius',
      control: { type: 'text' },
      table: {
        category: TOKENS_CATEGORY,
        defaultValue: { summary: '12px' },
      },
    },
    cardPadding: {
      name: '--ai-card-padding',
      control: { type: 'text' },
      table: {
        category: TOKENS_CATEGORY,
        defaultValue: { summary: '1.25rem' },
      },
    },
    cardShadowSm: {
      name: '--ai-card-shadow-sm',
      control: { type: 'text' },
      table: {
        category: TOKENS_CATEGORY,
        defaultValue: { summary: '0 1px 3px rgba(0, 0, 0, 0.08)' },
      },
    },
    cardShadowMd: {
      name: '--ai-card-shadow-md',
      control: { type: 'text' },
      table: {
        category: TOKENS_CATEGORY,
        defaultValue: { summary: '0 4px 12px rgba(0, 0, 0, 0.1)' },
      },
    },
    cardShadowLg: {
      name: '--ai-card-shadow-lg',
      control: { type: 'text' },
      table: {
        category: TOKENS_CATEGORY,
        defaultValue: { summary: '0 8px 24px rgba(0, 0, 0, 0.12)' },
      },
    },
    cardHoverShadow: {
      name: '--ai-card-hover-shadow',
      control: { type: 'text' },
      table: {
        category: TOKENS_CATEGORY,
        defaultValue: { summary: '0 6px 16px rgba(0, 0, 0, 0.14)' },
      },
    },
    cardColor: {
      name: '--ai-card-color',
      control: { type: 'color' },
      table: {
        category: TOKENS_CATEGORY,
        defaultValue: { summary: '#111827' },
      },
    },
  },
  args: {
    cardBg: '#ffffff',
    cardBorder: '1px solid #e5e7eb',
    cardBorderRadius: '12px',
    cardPadding: '1.25rem',
    cardShadowSm: '0 1px 3px rgba(0, 0, 0, 0.08)',
    cardShadowMd: '0 4px 12px rgba(0, 0, 0, 0.1)',
    cardShadowLg: '0 8px 24px rgba(0, 0, 0, 0.12)',
    cardHoverShadow: '0 6px 16px rgba(0, 0, 0, 0.14)',
    cardColor: '#111827',
  },
};
