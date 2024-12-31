import { FlatCompat } from '@eslint/eslintrc';
import typescriptParser from '@typescript-eslint/parser';
import boundariesPlugin from 'eslint-plugin-boundaries';
import checkFilePlugin from 'eslint-plugin-check-file';
import drizzlePlugin from 'eslint-plugin-drizzle';
import nPlugin from 'eslint-plugin-n';

const compat = new FlatCompat({
  // import.meta.dirname is available after Node.js v20.11.0
  baseDirectory: import.meta.dirname,
});

const config = [
  ...compat.config({
    extends: ['next/core-web-vitals', 'next/typescript', 'prettier'],
  }),
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      drizzle: drizzlePlugin,
      boundaries: boundariesPlugin,
      'check-file': checkFilePlugin,
      n: nPlugin,
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    settings: {
      'boundaries/include': ['src/**/*'],
      'boundaries/elements': [
        {
          mode: 'full',
          type: 'shared',
          pattern: [
            'src/components/**/*',
            'src/hooks/**/*',
            'src/lib/**/*',
            'src/auth/**/*',
          ],
        },
        {
          mode: 'full',
          type: 'feature',
          capture: ['featureName'],
          pattern: ['src/features/*/**/*'],
        },
        {
          mode: 'full',
          type: 'app',
          capture: ['_', 'fileName'],
          pattern: ['src/app/**/*'],
        },
        {
          mode: 'full',
          type: 'neverImport',
          pattern: ['src/*'],
        },
      ],
    },
    rules: {
      'check-file/filename-naming-convention': [
        'error',
        {
          '**/*.{ts,tsx}': 'KEBAB_CASE',
        },
        {
          ignoreMiddleExtensions: true,
        },
      ],
      'check-file/folder-naming-convention': [
        'error',
        {
          'src/app/**': 'NEXT_JS_APP_ROUTER_CASE',
          'src/components/**/*': 'KEBAB_CASE',
          'src/hooks/**/*': 'KEBAB_CASE',
          'src/lib/**/*': 'KEBAB_CASE',
          'src/auth/**/*': 'KEBAB_CASE',
          'src/features/**/*': 'KEBAB_CASE',
          'src/stripe/**/*': 'KEBAB_CASE',
        },
      ],
      'n/no-process-env': ['error'],
      'boundaries/no-unknown': ['error'],
      'boundaries/no-unknown-files': ['error'],
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          rules: [
            {
              from: ['shared'],
              allow: ['shared'],
            },
            {
              from: ['feature'],
              allow: [
                'shared',
                ['feature', { featureName: '${from.featureName}' }],
              ],
            },
            {
              from: ['app', 'neverImport'],
              allow: ['shared', 'feature'],
            },
          ],
        },
      ],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['./', '../'],
              message: 'Relative imports are not allowed.',
            },
          ],
        },
      ],
    },
  },
];

export default config;
