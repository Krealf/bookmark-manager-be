import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import vitest from '@vitest/eslint-plugin';

export default defineConfig([
  {
    ignores: ['**/*.js', 'dist/**/*', 'node_modules/**/*', 'src/generated/**'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginUnicorn.configs['recommended'],
  {
    files: ['**/*.{js,ts}'],
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'unicorn/better-regex': 'warn',
      'unicorn/no-process-exit': 'off',
      'unicorn/no-array-reduce': 'off',
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/prefer-top-level-await': 'off',
      'unicorn/no-top-level-side-effects': 'off',
      'unicorn/no-this-outside-of-class': 'off',
      'unicorn/name-replacements': [
        'error',
        {
          replacements: {
            res: false,
            req: false,
            next: false,
          },
        },
      ],

      // неиспользуемые переменные с префиксом _ игнорируем
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  {
    files: ['src/**/*.test.{js,ts}'],
    ...vitest.configs.recommended,
  },
  eslintPluginPrettierRecommended,
]);
