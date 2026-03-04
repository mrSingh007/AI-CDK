import type { Meta, StoryObj } from '@storybook/angular';
import { AiSidebarComponent } from '@ai-cdk/chat/SideBar';

const INPUTS_CATEGORY = 'Inputs';
const OUTPUTS_CATEGORY = 'Outputs';
const TOKENS_CATEGORY = 'SCSS Tokens';

interface AiSidebarStoryArgs {
  readonly path: string;
  readonly placeholder: string;
  readonly disabled: boolean;
  readonly xClicked: () => void;
  readonly clearClicked: () => void;
}

interface AiSidebarTokenStoryArgs {
  readonly sidebarWidth: string;
  readonly sidebarBg: string;
  readonly sidebarBorderLeft: string;
  readonly sidebarShadow: string;
  readonly sidebarZIndex: string;
  readonly sidebarTopbarBg: string;
  readonly sidebarTopbarBorder: string;
  readonly sidebarTopbarPadding: string;
  readonly sidebarIconColor: string;
  readonly sidebarIconHoverColor: string;
  readonly sidebarContentPadding: string;
  readonly sidebarContentGap: string;
  readonly sidebarUserBubbleBg: string;
  readonly sidebarUserBubbleColor: string;
  readonly sidebarUserBubbleRadius: string;
  readonly sidebarAiBubbleBg: string;
  readonly sidebarAiBubbleColor: string;
  readonly sidebarAiBubbleRadius: string;
  readonly sidebarBubblePadding: string;
  readonly sidebarBubbleFontSize: string;
  readonly sidebarInputBarBg: string;
  readonly sidebarInputBarBorder: string;
  readonly sidebarInputBarPadding: string;
  readonly sidebarInputBg: string;
  readonly sidebarInputBorder: string;
  readonly sidebarInputBorderRadius: string;
  readonly sidebarInputColor: string;
  readonly sidebarInputPadding: string;
  readonly sidebarSendIconColor: string;
  readonly sidebarSendIconDisabled: string;
}

function buildSidebarTokenStyles(args: AiSidebarTokenStoryArgs): string {
  return [
    `--ai-sidebar-width: ${args.sidebarWidth}`,
    `--ai-sidebar-bg: ${args.sidebarBg}`,
    `--ai-sidebar-border-left: ${args.sidebarBorderLeft}`,
    `--ai-sidebar-shadow: ${args.sidebarShadow}`,
    `--ai-sidebar-z-index: ${args.sidebarZIndex}`,
    `--ai-sidebar-topbar-bg: ${args.sidebarTopbarBg}`,
    `--ai-sidebar-topbar-border: ${args.sidebarTopbarBorder}`,
    `--ai-sidebar-topbar-padding: ${args.sidebarTopbarPadding}`,
    `--ai-sidebar-icon-color: ${args.sidebarIconColor}`,
    `--ai-sidebar-icon-hover-color: ${args.sidebarIconHoverColor}`,
    `--ai-sidebar-content-padding: ${args.sidebarContentPadding}`,
    `--ai-sidebar-content-gap: ${args.sidebarContentGap}`,
    `--ai-sidebar-user-bubble-bg: ${args.sidebarUserBubbleBg}`,
    `--ai-sidebar-user-bubble-color: ${args.sidebarUserBubbleColor}`,
    `--ai-sidebar-user-bubble-radius: ${args.sidebarUserBubbleRadius}`,
    `--ai-sidebar-ai-bubble-bg: ${args.sidebarAiBubbleBg}`,
    `--ai-sidebar-ai-bubble-color: ${args.sidebarAiBubbleColor}`,
    `--ai-sidebar-ai-bubble-radius: ${args.sidebarAiBubbleRadius}`,
    `--ai-sidebar-bubble-padding: ${args.sidebarBubblePadding}`,
    `--ai-sidebar-bubble-font-size: ${args.sidebarBubbleFontSize}`,
    `--ai-sidebar-input-bar-bg: ${args.sidebarInputBarBg}`,
    `--ai-sidebar-input-bar-border: ${args.sidebarInputBarBorder}`,
    `--ai-sidebar-input-bar-padding: ${args.sidebarInputBarPadding}`,
    `--ai-sidebar-input-bg: ${args.sidebarInputBg}`,
    `--ai-sidebar-input-border: ${args.sidebarInputBorder}`,
    `--ai-sidebar-input-border-radius: ${args.sidebarInputBorderRadius}`,
    `--ai-sidebar-input-color: ${args.sidebarInputColor}`,
    `--ai-sidebar-input-padding: ${args.sidebarInputPadding}`,
    `--ai-sidebar-send-icon-color: ${args.sidebarSendIconColor}`,
    `--ai-sidebar-send-icon-disabled: ${args.sidebarSendIconDisabled}`,
  ].join('; ');
}

const meta: Meta<AiSidebarStoryArgs> = {
  title: 'Chat/SideBar',
  component: AiSidebarComponent,
  tags: ['autodocs'],
  argTypes: {
    path: {
      control: { type: 'text' },
      table: {
        category: INPUTS_CATEGORY,
      },
    },
    placeholder: {
      control: { type: 'text' },
      table: {
        category: INPUTS_CATEGORY,
      },
    },
    disabled: {
      control: { type: 'boolean' },
      table: {
        category: INPUTS_CATEGORY,
      },
    },
    xClicked: {
      action: 'xClicked',
      control: false,
      table: {
        category: OUTPUTS_CATEGORY,
      },
    },
    clearClicked: {
      action: 'clearClicked',
      control: false,
      table: {
        category: OUTPUTS_CATEGORY,
      },
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <div style="height: 100vh;">
        <ai-sidebar
          [path]="path"
          [placeholder]="placeholder"
          [disabled]="disabled"
          (xClicked)="xClicked()"
          (clearClicked)="clearClicked()"
        ></ai-sidebar>
      </div>
    `,
  }),
  args: {
    path: '/api/sse',
    placeholder: 'Type a message...',
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<AiSidebarStoryArgs>;
type TokenStory = StoryObj<AiSidebarStoryArgs & AiSidebarTokenStoryArgs>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const StyleTokens: TokenStory = {
  render: (args) => ({
    props: {
      ...args,
      tokenStyles: buildSidebarTokenStyles(args),
    },
    template: `
      <div style="height: 100vh;">
        <ai-sidebar
          [style]="tokenStyles"
          [path]="'/api/sse'"
          [placeholder]="'Type a message...'"
          [disabled]="false"
        ></ai-sidebar>
      </div>
    `,
  }),
  argTypes: {
    path: {
      control: false,
      table: { disable: true },
    },
    placeholder: {
      control: false,
      table: { disable: true },
    },
    disabled: {
      control: false,
      table: { disable: true },
    },
    xClicked: {
      control: false,
      table: { disable: true },
    },
    clearClicked: {
      control: false,
      table: { disable: true },
    },
    sidebarWidth: {
      name: '--ai-sidebar-width',
      control: { type: 'text' },
      table: {
        category: TOKENS_CATEGORY,
        defaultValue: { summary: '400px' },
      },
    },
    sidebarBg: {
      name: '--ai-sidebar-bg',
      control: { type: 'color' },
      table: {
        category: TOKENS_CATEGORY,
        defaultValue: { summary: '#ffffff' },
      },
    },
    sidebarBorderLeft: {
      name: '--ai-sidebar-border-left',
      control: { type: 'text' },
      table: {
        category: TOKENS_CATEGORY,
        defaultValue: { summary: '1px solid #e5e7eb' },
      },
    },
    sidebarShadow: {
      name: '--ai-sidebar-shadow',
      control: { type: 'text' },
      table: {
        category: TOKENS_CATEGORY,
        defaultValue: { summary: '-4px 0 16px rgba(0, 0, 0, 0.08)' },
      },
    },
    sidebarZIndex: {
      name: '--ai-sidebar-z-index',
      control: { type: 'text' },
      table: {
        category: TOKENS_CATEGORY,
        defaultValue: { summary: '1000' },
      },
    },
    sidebarTopbarBg: {
      name: '--ai-sidebar-topbar-bg',
      control: { type: 'color' },
      table: {
        category: TOKENS_CATEGORY,
        defaultValue: { summary: '#f9fafb' },
      },
    },
    sidebarTopbarBorder: {
      name: '--ai-sidebar-topbar-border',
      control: { type: 'text' },
      table: {
        category: TOKENS_CATEGORY,
        defaultValue: { summary: '1px solid #e5e7eb' },
      },
    },
    sidebarTopbarPadding: {
      name: '--ai-sidebar-topbar-padding',
      control: { type: 'text' },
      table: {
        category: TOKENS_CATEGORY,
        defaultValue: { summary: '0.75rem 1rem' },
      },
    },
    sidebarIconColor: {
      name: '--ai-sidebar-icon-color',
      control: { type: 'color' },
      table: {
        category: TOKENS_CATEGORY,
        defaultValue: { summary: '#6b7280' },
      },
    },
    sidebarIconHoverColor: {
      name: '--ai-sidebar-icon-hover-color',
      control: { type: 'color' },
      table: {
        category: TOKENS_CATEGORY,
        defaultValue: { summary: '#111827' },
      },
    },
    sidebarContentPadding: {
      name: '--ai-sidebar-content-padding',
      control: { type: 'text' },
      table: {
        category: TOKENS_CATEGORY,
        defaultValue: { summary: '1rem' },
      },
    },
    sidebarContentGap: {
      name: '--ai-sidebar-content-gap',
      control: { type: 'text' },
      table: {
        category: TOKENS_CATEGORY,
        defaultValue: { summary: '0.75rem' },
      },
    },
    sidebarUserBubbleBg: {
      name: '--ai-sidebar-user-bubble-bg',
      control: { type: 'color' },
      table: {
        category: TOKENS_CATEGORY,
        defaultValue: { summary: '#3b82f6' },
      },
    },
    sidebarUserBubbleColor: {
      name: '--ai-sidebar-user-bubble-color',
      control: { type: 'color' },
      table: {
        category: TOKENS_CATEGORY,
        defaultValue: { summary: '#ffffff' },
      },
    },
    sidebarUserBubbleRadius: {
      name: '--ai-sidebar-user-bubble-radius',
      control: { type: 'text' },
      table: {
        category: TOKENS_CATEGORY,
        defaultValue: { summary: '18px 18px 4px 18px' },
      },
    },
    sidebarAiBubbleBg: {
      name: '--ai-sidebar-ai-bubble-bg',
      control: { type: 'color' },
      table: {
        category: TOKENS_CATEGORY,
        defaultValue: { summary: '#f3f4f6' },
      },
    },
    sidebarAiBubbleColor: {
      name: '--ai-sidebar-ai-bubble-color',
      control: { type: 'color' },
      table: {
        category: TOKENS_CATEGORY,
        defaultValue: { summary: '#111827' },
      },
    },
    sidebarAiBubbleRadius: {
      name: '--ai-sidebar-ai-bubble-radius',
      control: { type: 'text' },
      table: {
        category: TOKENS_CATEGORY,
        defaultValue: { summary: '18px 18px 18px 4px' },
      },
    },
    sidebarBubblePadding: {
      name: '--ai-sidebar-bubble-padding',
      control: { type: 'text' },
      table: {
        category: TOKENS_CATEGORY,
        defaultValue: { summary: '0.6rem 0.9rem' },
      },
    },
    sidebarBubbleFontSize: {
      name: '--ai-sidebar-bubble-font-size',
      control: { type: 'text' },
      table: {
        category: TOKENS_CATEGORY,
        defaultValue: { summary: '0.875rem' },
      },
    },
    sidebarInputBarBg: {
      name: '--ai-sidebar-input-bar-bg',
      control: { type: 'color' },
      table: {
        category: TOKENS_CATEGORY,
        defaultValue: { summary: '#ffffff' },
      },
    },
    sidebarInputBarBorder: {
      name: '--ai-sidebar-input-bar-border',
      control: { type: 'text' },
      table: {
        category: TOKENS_CATEGORY,
        defaultValue: { summary: '1px solid #e5e7eb' },
      },
    },
    sidebarInputBarPadding: {
      name: '--ai-sidebar-input-bar-padding',
      control: { type: 'text' },
      table: {
        category: TOKENS_CATEGORY,
        defaultValue: { summary: '0.75rem 1rem' },
      },
    },
    sidebarInputBg: {
      name: '--ai-sidebar-input-bg',
      control: { type: 'color' },
      table: {
        category: TOKENS_CATEGORY,
        defaultValue: { summary: '#f9fafb' },
      },
    },
    sidebarInputBorder: {
      name: '--ai-sidebar-input-border',
      control: { type: 'text' },
      table: {
        category: TOKENS_CATEGORY,
        defaultValue: { summary: '1px solid #d1d5db' },
      },
    },
    sidebarInputBorderRadius: {
      name: '--ai-sidebar-input-border-radius',
      control: { type: 'text' },
      table: {
        category: TOKENS_CATEGORY,
        defaultValue: { summary: '20px' },
      },
    },
    sidebarInputColor: {
      name: '--ai-sidebar-input-color',
      control: { type: 'color' },
      table: {
        category: TOKENS_CATEGORY,
        defaultValue: { summary: '#111827' },
      },
    },
    sidebarInputPadding: {
      name: '--ai-sidebar-input-padding',
      control: { type: 'text' },
      table: {
        category: TOKENS_CATEGORY,
        defaultValue: { summary: '0.5rem 1rem' },
      },
    },
    sidebarSendIconColor: {
      name: '--ai-sidebar-send-icon-color',
      control: { type: 'color' },
      table: {
        category: TOKENS_CATEGORY,
        defaultValue: { summary: '#3b82f6' },
      },
    },
    sidebarSendIconDisabled: {
      name: '--ai-sidebar-send-icon-disabled',
      control: { type: 'color' },
      table: {
        category: TOKENS_CATEGORY,
        defaultValue: { summary: '#9ca3af' },
      },
    },
  },
  args: {
    sidebarWidth: '400px',
    sidebarBg: '#ffffff',
    sidebarBorderLeft: '1px solid #e5e7eb',
    sidebarShadow: '-4px 0 16px rgba(0, 0, 0, 0.08)',
    sidebarZIndex: '1000',
    sidebarTopbarBg: '#f9fafb',
    sidebarTopbarBorder: '1px solid #e5e7eb',
    sidebarTopbarPadding: '0.75rem 1rem',
    sidebarIconColor: '#6b7280',
    sidebarIconHoverColor: '#111827',
    sidebarContentPadding: '1rem',
    sidebarContentGap: '0.75rem',
    sidebarUserBubbleBg: '#3b82f6',
    sidebarUserBubbleColor: '#ffffff',
    sidebarUserBubbleRadius: '18px 18px 4px 18px',
    sidebarAiBubbleBg: '#f3f4f6',
    sidebarAiBubbleColor: '#111827',
    sidebarAiBubbleRadius: '18px 18px 18px 4px',
    sidebarBubblePadding: '0.6rem 0.9rem',
    sidebarBubbleFontSize: '0.875rem',
    sidebarInputBarBg: '#ffffff',
    sidebarInputBarBorder: '1px solid #e5e7eb',
    sidebarInputBarPadding: '0.75rem 1rem',
    sidebarInputBg: '#f9fafb',
    sidebarInputBorder: '1px solid #d1d5db',
    sidebarInputBorderRadius: '20px',
    sidebarInputColor: '#111827',
    sidebarInputPadding: '0.5rem 1rem',
    sidebarSendIconColor: '#3b82f6',
    sidebarSendIconDisabled: '#9ca3af',
  },
};
