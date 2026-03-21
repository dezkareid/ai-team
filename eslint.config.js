import tsBase from '@dezkareid/eslint-config-ts-base';

export default [
  ...tsBase,
  {
    ignores: [
      'dist/',
      'node_modules/',
      'plugins/',
      'done/',
      'working-on/',
      'coverage/',
      '.claude-plugin/',
      'marketplace.json'
    ]
  }
];
