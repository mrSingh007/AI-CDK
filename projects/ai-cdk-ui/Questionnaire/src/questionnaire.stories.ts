import type { Meta, StoryObj } from '@storybook/angular';
import {
  AiQuestionnaireComponent,
  type AiAnswer,
  type AiQuestion,
} from '@ai-cdk/ui/Questionnaire';

const INPUTS_CATEGORY = 'Inputs';
const OUTPUTS_CATEGORY = 'Outputs';
const TOKENS_CATEGORY = 'SCSS Tokens';

const defaultQuestions: AiQuestion[] = [
  {
    id: 'destination',
    question: 'Where would you like to travel?',
    options: ['UK', 'USA', 'Germany'],
  },
  {
    id: 'topics',
    question: 'Which topics interest you?',
    options: ['Design', 'Engineering', 'Marketing'],
    multiSelect: true,
  },
];

interface AiQuestionnaireStoryArgs {
  readonly questions: AiQuestion[];
  readonly allowInput: boolean;
  readonly multiSelect: boolean;
  readonly answerSubmit: (answer: AiAnswer) => void;
  readonly completed: (answers: AiAnswer[]) => void;
}

interface AiQuestionnaireTokenStoryArgs {
  readonly questionnaireBg: string;
  readonly questionnaireBorderRadius: string;
  readonly questionnairePadding: string;
  readonly questionColor: string;
  readonly questionSize: string;
  readonly optionBg: string;
  readonly optionBorder: string;
  readonly optionHoverBg: string;
  readonly optionSelectedBg: string;
  readonly optionSelectedColor: string;
  readonly inputBorder: string;
  readonly inputBg: string;
  readonly inputColor: string;
  readonly questionnaireGap: string;
}

function buildQuestionnaireTokenStyles(args: AiQuestionnaireTokenStoryArgs): string {
  return [
    `--ai-questionnaire-bg: ${args.questionnaireBg}`,
    `--ai-questionnaire-border-radius: ${args.questionnaireBorderRadius}`,
    `--ai-questionnaire-padding: ${args.questionnairePadding}`,
    `--ai-questionnaire-question-color: ${args.questionColor}`,
    `--ai-questionnaire-question-size: ${args.questionSize}`,
    `--ai-questionnaire-option-bg: ${args.optionBg}`,
    `--ai-questionnaire-option-border: ${args.optionBorder}`,
    `--ai-questionnaire-option-hover-bg: ${args.optionHoverBg}`,
    `--ai-questionnaire-option-selected-bg: ${args.optionSelectedBg}`,
    `--ai-questionnaire-option-selected-color: ${args.optionSelectedColor}`,
    `--ai-questionnaire-input-border: ${args.inputBorder}`,
    `--ai-questionnaire-input-bg: ${args.inputBg}`,
    `--ai-questionnaire-input-color: ${args.inputColor}`,
    `--ai-questionnaire-gap: ${args.questionnaireGap}`,
  ].join('; ');
}

const meta: Meta<AiQuestionnaireStoryArgs> = {
  title: 'UI/Questionnaire',
  component: AiQuestionnaireComponent,
  tags: ['autodocs'],
  render: (args) => ({
    props: args,
    template: `
      <ai-questionnaire
        [questions]="questions"
        [allowInput]="allowInput"
        [multiSelect]="multiSelect"
        (answerSubmit)="answerSubmit($event)"
        (completed)="completed($event)"
      ></ai-questionnaire>
    `,
  }),
  argTypes: {
    questions: {
      control: false,
      table: {
        category: INPUTS_CATEGORY,
      },
    },
    allowInput: {
      control: { type: 'boolean' },
      table: {
        category: INPUTS_CATEGORY,
      },
    },
    multiSelect: {
      control: { type: 'boolean' },
      table: {
        category: INPUTS_CATEGORY,
      },
    },
    answerSubmit: {
      action: 'answerSubmit',
      control: false,
      table: {
        category: OUTPUTS_CATEGORY,
      },
    },
    completed: {
      action: 'completed',
      control: false,
      table: {
        category: OUTPUTS_CATEGORY,
      },
    },
  },
  args: {
    questions: defaultQuestions,
    allowInput: true,
    multiSelect: false,
  },
};

export default meta;
type Story = StoryObj<AiQuestionnaireStoryArgs>;
type TokenStory = StoryObj<AiQuestionnaireStoryArgs & AiQuestionnaireTokenStoryArgs>;

export const DefaultFlow: Story = {};

export const MultiSelectNoInput: Story = {
  args: {
    allowInput: false,
    multiSelect: true,
    questions: [
      {
        id: 'skills',
        question: 'Pick your preferred tracks',
        options: ['Frontend', 'Backend', 'DevOps'],
      },
    ],
  },
};

export const StyleTokens: TokenStory = {
  render: (args) => ({
    props: {
      ...args,
      questions: defaultQuestions,
      tokenStyles: buildQuestionnaireTokenStyles(args),
    },
    template: `
      <ai-questionnaire
        [style]="tokenStyles"
        [questions]="questions"
        [allowInput]="true"
        [multiSelect]="false"
      ></ai-questionnaire>
    `,
  }),
  argTypes: {
    questions: {
      control: false,
      table: { disable: true },
    },
    allowInput: {
      control: false,
      table: { disable: true },
    },
    multiSelect: {
      control: false,
      table: { disable: true },
    },
    answerSubmit: {
      control: false,
      table: { disable: true },
    },
    completed: {
      control: false,
      table: { disable: true },
    },
    questionnaireBg: {
      name: '--ai-questionnaire-bg',
      control: { type: 'color' },
      table: {
        category: TOKENS_CATEGORY,
        defaultValue: { summary: '#ffffff' },
      },
    },
    questionnaireBorderRadius: {
      name: '--ai-questionnaire-border-radius',
      control: { type: 'text' },
      table: {
        category: TOKENS_CATEGORY,
        defaultValue: { summary: '12px' },
      },
    },
    questionnairePadding: {
      name: '--ai-questionnaire-padding',
      control: { type: 'text' },
      table: {
        category: TOKENS_CATEGORY,
        defaultValue: { summary: '1.5rem' },
      },
    },
    questionColor: {
      name: '--ai-questionnaire-question-color',
      control: { type: 'color' },
      table: {
        category: TOKENS_CATEGORY,
        defaultValue: { summary: '#111827' },
      },
    },
    questionSize: {
      name: '--ai-questionnaire-question-size',
      control: { type: 'text' },
      table: {
        category: TOKENS_CATEGORY,
        defaultValue: { summary: '1rem' },
      },
    },
    optionBg: {
      name: '--ai-questionnaire-option-bg',
      control: { type: 'color' },
      table: {
        category: TOKENS_CATEGORY,
        defaultValue: { summary: '#f9fafb' },
      },
    },
    optionBorder: {
      name: '--ai-questionnaire-option-border',
      control: { type: 'text' },
      table: {
        category: TOKENS_CATEGORY,
        defaultValue: { summary: '1px solid #e5e7eb' },
      },
    },
    optionHoverBg: {
      name: '--ai-questionnaire-option-hover-bg',
      control: { type: 'color' },
      table: {
        category: TOKENS_CATEGORY,
        defaultValue: { summary: '#eff6ff' },
      },
    },
    optionSelectedBg: {
      name: '--ai-questionnaire-option-selected-bg',
      control: { type: 'color' },
      table: {
        category: TOKENS_CATEGORY,
        defaultValue: { summary: '#3b82f6' },
      },
    },
    optionSelectedColor: {
      name: '--ai-questionnaire-option-selected-color',
      control: { type: 'color' },
      table: {
        category: TOKENS_CATEGORY,
        defaultValue: { summary: '#ffffff' },
      },
    },
    inputBorder: {
      name: '--ai-questionnaire-input-border',
      control: { type: 'text' },
      table: {
        category: TOKENS_CATEGORY,
        defaultValue: { summary: '1px solid #d1d5db' },
      },
    },
    inputBg: {
      name: '--ai-questionnaire-input-bg',
      control: { type: 'color' },
      table: {
        category: TOKENS_CATEGORY,
        defaultValue: { summary: '#ffffff' },
      },
    },
    inputColor: {
      name: '--ai-questionnaire-input-color',
      control: { type: 'color' },
      table: {
        category: TOKENS_CATEGORY,
        defaultValue: { summary: '#111827' },
      },
    },
    questionnaireGap: {
      name: '--ai-questionnaire-gap',
      control: { type: 'text' },
      table: {
        category: TOKENS_CATEGORY,
        defaultValue: { summary: '0.5rem' },
      },
    },
  },
  args: {
    questionnaireBg: '#ffffff',
    questionnaireBorderRadius: '12px',
    questionnairePadding: '1.5rem',
    questionColor: '#111827',
    questionSize: '1rem',
    optionBg: '#f9fafb',
    optionBorder: '1px solid #e5e7eb',
    optionHoverBg: '#eff6ff',
    optionSelectedBg: '#3b82f6',
    optionSelectedColor: '#ffffff',
    inputBorder: '1px solid #d1d5db',
    inputBg: '#ffffff',
    inputColor: '#111827',
    questionnaireGap: '0.5rem',
  },
};
