import * as vite from 'vite';

declare function createVitestConfig(overrides?: {
    test?: Record<string, unknown>;
    plugins?: unknown[];
}): vite.UserConfig;

export { createVitestConfig };
