import { createEslintConfig } from './dist/config/eslint.js';

export default createEslintConfig({
  rootDir: import.meta.dirname,
  tsconfigPath: './tsconfig.json',
});
