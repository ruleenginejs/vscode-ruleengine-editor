module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-strongly-recommended',
    'eslint:recommended',
    '@vue/eslint-config-prettier'
  ],
  env: {
    node: true,
    browser: true,
    'vue/setup-compiler-macros': true
  },
  rules: {
    'vue/component-definition-name-casing': ['error', 'kebab-case']
  }
};
