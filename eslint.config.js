// @ts-check
const eslint = require('@eslint/js');
const { defineConfig } = require('eslint/config');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const storybook = require('eslint-plugin-storybook');
const eslintConfigPrettier = require('eslint-config-prettier');

module.exports = defineConfig([
  {
    ignores: [
      '**/dist/**',
      '**/coverage/**',
      '**/out-tsc/**',
      '**/storybook-static/**',
      '**/.angular/**',
      '**/node_modules/**',
    ],
  },
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.stylistic,
      angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'ai',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'ai',
          style: 'kebab-case',
        },
      ],
      '@angular-eslint/prefer-standalone': 'off',
    },
  },
  {
    files: ['**/*.html'],
    extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
    rules: {},
  },
  {
    files: ['**/*.stories.@(ts|js|mjs|cjs)'],
    extends: [storybook.configs['flat/recommended']],
  },
  eslintConfigPrettier,
]);
