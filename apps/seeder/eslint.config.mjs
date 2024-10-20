import baseConfig from '@sjw/eslint-config/eslint.config.base.mjs';

export default {
  ...baseConfig,

  rules: {
    '@typescript-eslint/no-explicit-any': 'off'  // Turn off the no-explicit-any rule
  }
};