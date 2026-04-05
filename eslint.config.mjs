import tseslint from 'typescript-eslint';
import webTs from '@dezkareid/eslint-plugin-web/typescript';

export default tseslint.config(
  ...webTs,
  {
    ignores: [
      'dist/',
      'node_modules/',
      'plugins/',
      'done/',
      'working-on/',
      'coverage/',
      '.claude-plugin/',
      'marketplace.json',
    ],
  },
);
