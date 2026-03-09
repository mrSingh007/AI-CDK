import { computed, signal } from '@angular/core';
import { AiSkeletonComponent } from '@ai-cdk/ui/Skeleton';
import type { Meta, StoryObj } from '@storybook/angular';

interface AiSkeletonTokens {
  readonly skeletonBg: string;
  readonly skeletonShimmerColor: string;
  readonly skeletonWidth: string;
  readonly skeletonHeight: string;
  readonly skeletonBorderRadius: string;
  readonly skeletonAnimationDuration: string;
}

interface AiSkeletonTokenControl {
  readonly key: keyof AiSkeletonTokens;
  readonly cssVar: string;
  readonly label: string;
  readonly inputType: 'color' | 'text';
  readonly defaultValue: string;
}

const SKELETON_TOKEN_DEFAULTS: AiSkeletonTokens = {
  skeletonBg: '#e0e0e0',
  skeletonShimmerColor: '#f5f5f5',
  skeletonWidth: '100%',
  skeletonHeight: '1rem',
  skeletonBorderRadius: '4px',
  skeletonAnimationDuration: '1.5s',
};

const SKELETON_TOKEN_CONTROLS: readonly AiSkeletonTokenControl[] = [
  {
    key: 'skeletonBg',
    cssVar: '--ai-skeleton-bg',
    label: 'Background',
    inputType: 'color',
    defaultValue: SKELETON_TOKEN_DEFAULTS.skeletonBg,
  },
  {
    key: 'skeletonShimmerColor',
    cssVar: '--ai-skeleton-shimmer-color',
    label: 'Shimmer color',
    inputType: 'color',
    defaultValue: SKELETON_TOKEN_DEFAULTS.skeletonShimmerColor,
  },
  {
    key: 'skeletonWidth',
    cssVar: '--ai-skeleton-width',
    label: 'Width',
    inputType: 'text',
    defaultValue: SKELETON_TOKEN_DEFAULTS.skeletonWidth,
  },
  {
    key: 'skeletonHeight',
    cssVar: '--ai-skeleton-height',
    label: 'Height',
    inputType: 'text',
    defaultValue: SKELETON_TOKEN_DEFAULTS.skeletonHeight,
  },
  {
    key: 'skeletonBorderRadius',
    cssVar: '--ai-skeleton-border-radius',
    label: 'Border radius',
    inputType: 'text',
    defaultValue: SKELETON_TOKEN_DEFAULTS.skeletonBorderRadius,
  },
  {
    key: 'skeletonAnimationDuration',
    cssVar: '--ai-skeleton-animation-duration',
    label: 'Animation duration',
    inputType: 'text',
    defaultValue: SKELETON_TOKEN_DEFAULTS.skeletonAnimationDuration,
  },
];

const BASIC_USAGE_SNIPPET = `<ai-skeleton [animate]="true"></ai-skeleton>`;

const PLACEHOLDER_SNIPPET = `<ai-skeleton
  [animate]="true"
  style="--ai-skeleton-width: 280px; --ai-skeleton-height: 14px; --ai-skeleton-border-radius: 8px;"
></ai-skeleton>`;

function buildSkeletonTokenStyles(tokens: AiSkeletonTokens): string {
  return [
    `--ai-skeleton-bg: ${tokens.skeletonBg}`,
    `--ai-skeleton-shimmer-color: ${tokens.skeletonShimmerColor}`,
    `--ai-skeleton-width: ${tokens.skeletonWidth}`,
    `--ai-skeleton-height: ${tokens.skeletonHeight}`,
    `--ai-skeleton-border-radius: ${tokens.skeletonBorderRadius}`,
    `--ai-skeleton-animation-duration: ${tokens.skeletonAnimationDuration}`,
  ].join('; ');
}

const meta: Meta = {
  title: 'UI/Skeleton',
  component: AiSkeletonComponent,
  parameters: {
    controls: {
      disable: true,
      hideNoControlsWarning: true,
    },
  },
};

export default meta;
type Story = StoryObj;

export const Overview: Story = {
  render: () => {
    const tokenValues = signal<AiSkeletonTokens>(SKELETON_TOKEN_DEFAULTS);
    const tokenStyles = computed(() => buildSkeletonTokenStyles(tokenValues()));

    return {
      props: {
        tokenControls: SKELETON_TOKEN_CONTROLS,
        tokenValues,
        tokenStyles,
        basicUsageSnippet: BASIC_USAGE_SNIPPET,
        placeholderSnippet: PLACEHOLDER_SNIPPET,
        onTokenInputEvent: (key: keyof AiSkeletonTokens, event: Event): void => {
          const target = event.target;
          if (!(target instanceof HTMLInputElement)) {
            return;
          }

          tokenValues.update((current) => ({
            ...current,
            [key]: target.value,
          }));
        },
      },
      template: `
        <style>
          .ai-skeleton-docs {
            font-family: 'Manrope', 'Avenir Next', 'Segoe UI', sans-serif;
            display: grid;
            gap: 1rem;
            color: #10233f;
            font-size: 0.95rem;
            line-height: 1.55;
          }

          .ai-skeleton-docs__section {
            border: 1px solid #d5e2f3;
            border-radius: 16px;
            padding: 1.1rem;
            background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
            box-shadow: 0 8px 20px rgba(15, 23, 42, 0.04);
          }

          .ai-skeleton-docs__title {
            margin: 0 0 0.5rem;
            font-size: 1.24rem;
            line-height: 1.3;
            color: #0b1f3a;
            letter-spacing: 0.01em;
          }

          .ai-skeleton-docs__subtitle {
            margin: 0 0 0.5rem;
            font-size: 1.02rem;
            line-height: 1.4;
            color: #11365e;
          }

          .ai-skeleton-docs__lead {
            margin: 0;
            color: #2a3f5e;
            line-height: 1.5;
          }

          .ai-skeleton-docs__preview-grid {
            margin-top: 0.875rem;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 0.75rem;
          }

          .ai-skeleton-docs__preview {
            display: grid;
            gap: 0.625rem;
            align-content: center;
            min-height: 120px;
            border: 1px dashed #b9cbe3;
            border-radius: 12px;
            padding: 0.75rem;
            background: #f3f8ff;
          }

          .ai-skeleton-docs__preview-label {
            margin: 0;
            font-size: 0.84rem;
            color: #274a74;
          }

          .ai-skeleton-docs__table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 0.75rem;
            font-size: 0.88rem;
          }

          .ai-skeleton-docs__table th,
          .ai-skeleton-docs__table td {
            border: 1px solid #ccdaea;
            padding: 0.6rem;
            text-align: left;
            vertical-align: top;
          }

          .ai-skeleton-docs__table thead {
            background: #edf5ff;
            color: #0f355f;
          }

          .ai-skeleton-docs__code {
            margin: 0;
            border-radius: 12px;
            border: 1px solid #22324b;
            padding: 0.8rem 0.85rem;
            background: #0f1a2c;
            color: #d7e5ff;
            font: 500 0.79rem/1.5 'JetBrains Mono', 'SFMono-Regular', 'Menlo', monospace;
            overflow-x: auto;
          }

          .ai-skeleton-docs__tokens-layout {
            display: grid;
            grid-template-columns: minmax(320px, 1fr) minmax(240px, 1fr);
            gap: 1rem;
            align-items: start;
          }

          .ai-skeleton-docs__token-fieldset {
            margin: 0;
            border: 0;
            padding: 0;
          }

          .ai-skeleton-docs__token-grid {
            display: grid;
            gap: 0.625rem;
          }

          .ai-skeleton-docs__token-row {
            display: grid;
            gap: 0.35rem;
          }

          .ai-skeleton-docs__token-label {
            display: flex;
            justify-content: space-between;
            gap: 0.5rem;
            font-size: 0.88rem;
            font-weight: 600;
            color: #143960;
          }

          .ai-skeleton-docs__token-label code {
            padding: 0.125rem 0.375rem;
            border-radius: 6px;
            background: #e8f0fb;
            font-size: 0.75rem;
          }

          .ai-skeleton-docs__token-input {
            min-height: 2.1rem;
            width: 100%;
            border: 1px solid #8ca8c8;
            border-radius: 8px;
            background: #ffffff;
            color: #0f2746;
            padding: 0.45rem 0.6rem;
          }

          .ai-skeleton-docs__token-input[type='color'] {
            padding: 0.2rem;
          }

          .ai-skeleton-docs__token-input:focus-visible {
            outline: 2px solid #0f4ea0;
            outline-offset: 2px;
          }

          .ai-skeleton-docs__token-default {
            margin: 0;
            color: #355779;
            font-size: 0.78rem;
          }

          .ai-skeleton-docs__token-preview {
            min-height: 220px;
            display: grid;
            align-content: center;
            gap: 0.75rem;
            border: 1px dashed #b9cbe3;
            border-radius: 12px;
            background: #f3f8ff;
            padding: 0.75rem;
          }

          @media (max-width: 920px) {
            .ai-skeleton-docs__tokens-layout {
              grid-template-columns: 1fr;
            }
          }
        </style>

        <article class="ai-skeleton-docs" aria-label="AiSkeletonComponent single-page documentation">
          <section class="ai-skeleton-docs__section" aria-labelledby="ai-skeleton-intro">
            <h2 id="ai-skeleton-intro" class="ai-skeleton-docs__title">AiSkeletonComponent</h2>
            <p class="ai-skeleton-docs__lead">
              AiSkeletonComponent renders loading placeholders with optional shimmer animation and CSS-token
              customization for dimensions, radius, and color.
            </p>
            <pre class="ai-skeleton-docs__code"><code>import &#123; AiSkeletonComponent &#125; from '@ai-cdk/ui/Skeleton';</code></pre>
          </section>

          <section class="ai-skeleton-docs__section" aria-labelledby="ai-skeleton-reference">
            <h2 id="ai-skeleton-reference" class="ai-skeleton-docs__title">Technical reference</h2>
            <table class="ai-skeleton-docs__table">
              <thead>
                <tr>
                  <th scope="col">Type</th>
                  <th scope="col">Name</th>
                  <th scope="col">Accepted values</th>
                  <th scope="col">Default</th>
                  <th scope="col">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Input</td>
                  <td><code>animate</code></td>
                  <td><code>boolean</code></td>
                  <td><code>true</code></td>
                  <td>Enables shimmer animation overlay.</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section class="ai-skeleton-docs__section" aria-labelledby="ai-skeleton-default">
            <h2 id="ai-skeleton-default" class="ai-skeleton-docs__title">Default showcase</h2>
            <p class="ai-skeleton-docs__lead">Base animated loading placeholder with default dimensions and colors.</p>
            <div class="ai-skeleton-docs__preview-grid">
              <div class="ai-skeleton-docs__preview">
                <ai-skeleton [animate]="true"></ai-skeleton>
                <p class="ai-skeleton-docs__preview-label">animate: true</p>
              </div>
            </div>
            <h3 class="ai-skeleton-docs__subtitle">Usage snippet</h3>
            <pre class="ai-skeleton-docs__code"><code>{{ basicUsageSnippet }}</code></pre>
          </section>

          <section class="ai-skeleton-docs__section" aria-labelledby="ai-skeleton-variants">
            <h2 id="ai-skeleton-variants" class="ai-skeleton-docs__title">Styled variants previews</h2>
            <p class="ai-skeleton-docs__lead">Preview-only variants using animation and token overrides.</p>
            <div class="ai-skeleton-docs__preview-grid">
              <div class="ai-skeleton-docs__preview">
                <ai-skeleton [animate]="false"></ai-skeleton>
                <p class="ai-skeleton-docs__preview-label">animate: false</p>
              </div>

              <div class="ai-skeleton-docs__preview">
                <ai-skeleton
                  [animate]="true"
                  style="--ai-skeleton-width: 280px; --ai-skeleton-height: 14px; --ai-skeleton-border-radius: 8px;"
                ></ai-skeleton>
                <p class="ai-skeleton-docs__preview-label">card line placeholder</p>
              </div>
            </div>
          </section>

          <section class="ai-skeleton-docs__section" aria-labelledby="ai-skeleton-tokens">
            <h2 id="ai-skeleton-tokens" class="ai-skeleton-docs__title">Style tokens playground</h2>
            <div class="ai-skeleton-docs__tokens-layout">
              <fieldset class="ai-skeleton-docs__token-fieldset">
                <legend class="ai-skeleton-docs__subtitle">Live token editor</legend>
                <div class="ai-skeleton-docs__token-grid">
                  @for (token of tokenControls; track token.key) {
                    <div class="ai-skeleton-docs__token-row">
                      <label class="ai-skeleton-docs__token-label" [attr.for]="'ai-skeleton-token-' + token.key">
                        <span>{{ token.label }}</span>
                        <code>{{ token.cssVar }}</code>
                      </label>
                      <input
                        class="ai-skeleton-docs__token-input"
                        [id]="'ai-skeleton-token-' + token.key"
                        [type]="token.inputType"
                        [value]="tokenValues()[token.key]"
                        (input)="onTokenInputEvent(token.key, $event)"
                      />
                      <p class="ai-skeleton-docs__token-default">Default: <code>{{ token.defaultValue }}</code></p>
                    </div>
                  }
                </div>
              </fieldset>

              <div class="ai-skeleton-docs__token-preview">
                <ai-skeleton [style]="tokenStyles()" [animate]="true"></ai-skeleton>
                <ai-skeleton
                  [style]="tokenStyles()"
                  [animate]="false"
                  style="--ai-skeleton-width: 75%;"
                ></ai-skeleton>
              </div>
            </div>
          </section>
        </article>
      `,
    };
  },
};
