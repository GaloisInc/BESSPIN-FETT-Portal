module.exports = {
  extends: ['prettier', 'airbnb', 'fivetalent'],
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
  plugins: ['json'],
  env: { jest: true, browser: true, node: true },
  rules: { 'no-console': 'off', 'max-len': 'off' },
  settings: {
    'import/resolver': {
      node: {
        paths: ['src'],
        extensions: ['.js'],
      },
    },
  },
};
