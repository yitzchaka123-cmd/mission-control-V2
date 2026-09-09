// @ts-check
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist/', 'node_modules/', 'spike/'] },
  ...tseslint.configs.recommended,
  {
    rules: {
      // Hermes logs through src/log.ts so secrets are redacted at the source.
      // A bare console.log bypasses that, so it is an error, not a style nit.
      'no-console': 'error',
      eqeqeq: 'error',
      'no-var': 'error',
      'prefer-const': 'error',
    },
  },
)
