export default [
  {
    root: true,
    languageOptions: {
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2020,
        extraFileExtensions: ['.svelte'],
      },
    },
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:svelte/recommended',
      'prettier',
    ],
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
    },
  },
  {
    files: ['**/*.svelte'],
    languageOptions: {
      parser: 'svelte-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
    },
  },
]
