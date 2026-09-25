import typescriptParser from '@typescript-eslint/parser';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier';
import boundariesPlugin from 'eslint-plugin-boundaries';
import checkFilePlugin from 'eslint-plugin-check-file';
import drizzlePlugin from 'eslint-plugin-drizzle';
import nPlugin from 'eslint-plugin-n';

const config = [
  ...nextVitals,
  ...nextTypescript,
  prettier,
  {
    files: ['src/components/conform/**'],
    // Conform exposes reactive control values, not React refs. Compiler analysis
    // currently misidentifies useInputControl's returned value as a ref.
    rules: { 'react-hooks/refs': 'off' },
  },
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'drizzle/**',
      'coverage/**',
      'test-results/**',
      'playwright-report/**',
      'tests/.auth/**',
    ],
  },
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
            'src/context/**/*',
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
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
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
  {
    files: ['scripts/**', 'tests/**'],
    // Standalone tooling owns environment access and lives outside the src alias.
    rules: { 'no-restricted-imports': 'off', 'n/no-process-env': 'off' },
  },
];

export default config;
