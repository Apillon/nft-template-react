module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: ['standard', 'eslint:recommended','plugin:react/recommended', 'plugin:prettier/recommended'],

  overrides: [
    {
      env: {
        node: true
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script'
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['react'],
  rules: {
    'react/prop-types': 0,
    'no-unmodified-loop-condition': 0,
    'react/react-in-jsx-scope': 0
  }
}
