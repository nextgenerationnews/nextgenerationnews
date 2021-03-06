module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
    extraFileExtensions: ['.svelte'],
  },
  plugins: ['svelte3', '@typescript-eslint'],
  extends: [
    'problems',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:import/typescript',
  ],
  env: {
    browser: true,
    es6: true,
    node: true,
    mocha: true,
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-unsafe-call': 0,
    '@typescript-eslint/require-await': 0,
    '@typescript-eslint/no-unsafe-member-access': 0,
    '@typescript-eslint/no-unsafe-assignment': 0,
    '@typescript-eslint/no-floating-promises': 0,
    '@typescript-eslint/no-unsafe-return': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/no-empty-function': 0,
    '@typescript-eslint/camelcase': 0,
    'no-duplicate-imports': 0,
    'import/no-duplicates': 0,
    '@typescript-eslint/restrict-template-expressions': 0,
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    '@typescript-eslint/no-unused-vars': ['warn', { varsIgnorePattern: '^_', argsIgnorePattern: '^_' }],
  },
  overrides: [
    {
      files: ['*.svelte'],
      processor: 'svelte3/svelte3',
    },
  ],
  settings: {
    'svelte3/typescript': require('typescript'),
    'svelte3/ignore-styles': () => true,
    'svelte3/ignore-warnings': warning => {
      if (
        warning.code === 'unused-export-let' &&
        (warning.message.includes('currentRoute') || warning.message.includes('params'))
      ) {
        return true;
      }
      return false;
    },
    'import/resolver': {
      node: {
        moduleDirectory: ['./src', './', 'node_modules', '../node_modules'],
      },
    },
  },
  ignorePatterns: ['.eslintrc.js', 'generated-contracts'],
};
