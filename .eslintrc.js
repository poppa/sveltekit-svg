module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  plugins: ['@typescript-eslint'],
  ignorePatterns: ['.eslintrc.js'],
  parserOptions: {
    // sourceType: 'module',
    ecmaVersion: 2020,
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json', './test-app/tsconfig.json'],
  },
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  rules: {
    'no-unused-vars': 'off',
    curly: 'error',
    yoda: 'error',
    'default-case': 'error',
    camelcase: 'off',
    eqeqeq: ['error', 'always'],
    'no-case-declarations': 'error',
    'no-new-wrappers': 'error',
    'no-return-await': 'error',
    'no-self-compare': 'error',
    'no-useless-call': 'error',
    'no-multi-spaces': 'error',
    'no-trailing-spaces': 'error',
    'no-irregular-whitespace': 'error',
    'max-len': [
      'error',
      {
        code: 80,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
      },
    ],
    // --------------
    // no-unused-vars
    // --------------
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        vars: 'all',
        args: 'after-used',
        ignoreRestSiblings: true,
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^\\$\\$(Props|Events|Slots)$',
      },
    ],
  },
}
