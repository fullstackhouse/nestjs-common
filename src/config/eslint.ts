import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import globals from 'globals';
import tseslint, { type ConfigArray } from 'typescript-eslint';

export interface CreateEslintConfigOptions {
  tsconfigPath?: string;
  rootDir: string;
}

export function createEslintConfig(
  opts: CreateEslintConfigOptions,
): ConfigArray {
  const compat = new FlatCompat({
    baseDirectory: opts.rootDir,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
  });

  return tseslint.config(
    {
      ignores: ['dist/**', 'node_modules/**', 'src/metadata.ts'],
    },
    ...tseslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
    ...compat.extends('plugin:prettier/recommended'),
    {
      languageOptions: {
        globals: { ...globals.node, ...globals.jest },
        parserOptions: {
          project: opts.tsconfigPath ?? './tsconfig.lint.json',
          tsconfigRootDir: opts.rootDir,
        },
      },

      rules: {
        curly: ['error', 'all'],
        '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
        '@typescript-eslint/return-await': ['error', 'always'],
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['src/**/*'],
                message:
                  'Absolute imports from "src/" are not allowed. Use relative imports instead.',
              },
            ],
          },
        ],
      },
    },
    {
      files: ['src/database/migrations/**/*.ts'],
      rules: {
        '@typescript-eslint/require-await': 'off',
      },
    },
    {
      files: ['**/*.controller.ts', '**/dto/*.dto.ts'],
      rules: {
        '@typescript-eslint/no-unsafe-call': 'off',
      },
    },
    {
      files: ['**/*.test.ts', '**/*.spec.ts', 'test/**/*.ts'],
      rules: {
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-argument': 'off',
      },
    },
  );
}
