module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/eslint-recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  root: true,
  env: {
    node: true,
  },
  rules: {
    'vue/multi-word-component-names': 'off',
    'prettier/prettier': 'error',
    'vue/no-multiple-template-root': 'off',
  },
};
