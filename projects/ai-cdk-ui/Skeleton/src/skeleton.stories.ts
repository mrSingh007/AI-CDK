import type { Meta, StoryObj } from '@storybook/angular';
import { AiSkeletonComponent } from '@ai-cdk/ui/Skeleton';

const INPUTS_CATEGORY = 'Inputs';
const TOKENS_CATEGORY = 'SCSS Tokens';

interface AiSkeletonStoryArgs {
  readonly animate: boolean;
}

interface AiSkeletonTokenStoryArgs {
  readonly skeletonBg: string;
  readonly skeletonShimmerColor: string;
  readonly skeletonWidth: string;
  readonly skeletonHeight: string;
  readonly skeletonBorderRadius: string;
  readonly skeletonAnimationDuration: string;
}

function buildSkeletonTokenStyles(args: AiSkeletonTokenStoryArgs): string {
  return [
    `--ai-skeleton-bg: ${args.skeletonBg}`,
    `--ai-skeleton-shimmer-color: ${args.skeletonShimmerColor}`,
    `--ai-skeleton-width: ${args.skeletonWidth}`,
    `--ai-skeleton-height: ${args.skeletonHeight}`,
    `--ai-skeleton-border-radius: ${args.skeletonBorderRadius}`,
    `--ai-skeleton-animation-duration: ${args.skeletonAnimationDuration}`,
  ].join('; ');
}

const meta: Meta<AiSkeletonStoryArgs> = {
  title: 'UI/Skeleton',
  component: AiSkeletonComponent,
  tags: ['autodocs'],
  argTypes: {
    animate: {
      control: { type: 'boolean' },
      table: {
        category: INPUTS_CATEGORY,
      },
    },
  },
  args: {
    animate: true,
  },
};

export default meta;
type Story = StoryObj<AiSkeletonStoryArgs>;
type TokenStory = StoryObj<AiSkeletonStoryArgs & AiSkeletonTokenStoryArgs>;

export const Default: Story = {};

export const CardLinePlaceholder: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ai-skeleton
        [animate]="animate"
        style="--ai-skeleton-width: 280px; --ai-skeleton-height: 14px; --ai-skeleton-border-radius: 8px;"
      ></ai-skeleton>
    `,
  }),
};

export const Static: Story = {
  args: {
    animate: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <ai-skeleton
        [animate]="animate"
        style="--ai-skeleton-width: 180px; --ai-skeleton-height: 20px;"
      ></ai-skeleton>
    `,
  }),
};

export const StyleTokens: TokenStory = {
  render: (args) => ({
    props: {
      ...args,
      tokenStyles: buildSkeletonTokenStyles(args),
    },
    template: `
      <ai-skeleton [style]="tokenStyles" [animate]="true"></ai-skeleton>
    `,
  }),
  argTypes: {
    animate: {
      control: false,
      table: { disable: true },
    },
    skeletonBg: {
      name: '--ai-skeleton-bg',
      control: { type: 'color' },
      table: {
        category: TOKENS_CATEGORY,
        defaultValue: { summary: '#e0e0e0' },
      },
    },
    skeletonShimmerColor: {
      name: '--ai-skeleton-shimmer-color',
      control: { type: 'color' },
      table: {
        category: TOKENS_CATEGORY,
        defaultValue: { summary: '#f5f5f5' },
      },
    },
    skeletonWidth: {
      name: '--ai-skeleton-width',
      control: { type: 'text' },
      table: {
        category: TOKENS_CATEGORY,
        defaultValue: { summary: '100%' },
      },
    },
    skeletonHeight: {
      name: '--ai-skeleton-height',
      control: { type: 'text' },
      table: {
        category: TOKENS_CATEGORY,
        defaultValue: { summary: '1rem' },
      },
    },
    skeletonBorderRadius: {
      name: '--ai-skeleton-border-radius',
      control: { type: 'text' },
      table: {
        category: TOKENS_CATEGORY,
        defaultValue: { summary: '4px' },
      },
    },
    skeletonAnimationDuration: {
      name: '--ai-skeleton-animation-duration',
      control: { type: 'text' },
      table: {
        category: TOKENS_CATEGORY,
        defaultValue: { summary: '1.5s' },
      },
    },
  },
  args: {
    skeletonBg: '#e0e0e0',
    skeletonShimmerColor: '#f5f5f5',
    skeletonWidth: '100%',
    skeletonHeight: '1rem',
    skeletonBorderRadius: '4px',
    skeletonAnimationDuration: '1.5s',
  },
};
