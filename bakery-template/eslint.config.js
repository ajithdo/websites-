import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import astro from 'eslint-plugin-astro';
import jsxA11y from 'eslint-plugin-jsx-a11y-x';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
  {
    ignores: [
      'dist/',
      'dist-client/',
      '.astro/',
      'node_modules/',
      'qa-output/',
      'playwright-report/',
      'test-results/',
    ],
  },
  js.configs.recommended,
  tseslint.configs.recommended,
  astro.configs['flat/recommended'],
  astro.configs['flat/jsx-a11y-recommended'],
  {
    files: ['**/*.tsx'],
    ...jsxA11y.configs.recommended,
  },
  {
    files: ['**/*.tsx', '**/*.ts'],
    ...reactHooks.configs.flat.recommended,
  },
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrors: 'none' },
      ],
    },
  },
);
