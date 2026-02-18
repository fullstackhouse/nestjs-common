import { ConfigArray } from 'typescript-eslint';

interface CreateEslintConfigOptions {
    tsconfigPath?: string;
    rootDir: string;
}
declare function createEslintConfig(opts: CreateEslintConfigOptions): ConfigArray;

export { type CreateEslintConfigOptions, createEslintConfig };
