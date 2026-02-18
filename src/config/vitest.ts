import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export function createVitestConfig(overrides?: {
  test?: Record<string, unknown>;
  plugins?: unknown[];
}) {
  const reporter = process.env.VITEST_REPORTER ?? 'default';

  return defineConfig({
    test: {
      globals: true,
      root: './',
      reporters: process.env.GITHUB_ACTIONS
        ? [reporter, 'github-actions']
        : [reporter],
      passWithNoTests: true,
      exclude: ['node_modules', 'dist'],
      fileParallelism: false,
      pool: 'threads',
      isolate: false,
      onConsoleLog(log) {
        if (log.includes('SERVER_ERROR') && log.includes('better-auth')) {
          return false;
        }
      },
      ...overrides?.test,
    },
    plugins: [
      swc.vite({
        module: { type: 'es6' },
      }),
      ...((overrides?.plugins ?? []) as []),
    ],
  });
}
