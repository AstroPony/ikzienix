/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(jose|openid-client|@panva|oidc-token-hash|@babel/runtime|@babel/helpers|@babel/template|@babel/traverse|@babel/types|@babel/parser|@babel/generator|@babel/helper-module-transforms|@babel/helper-validator-identifier|@babel/helper-validator-option|@babel/helper-split-export-declaration|@babel/helper-create-class-features-plugin|@babel/helper-annotate-as-pure|@babel/helper-builder-binary-assignment-operator-visitor|@babel/helper-builder-react-jsx|@babel/helper-call-delegate|@babel/helper-create-regexp-features-plugin|@babel/helper-define-map|@babel/helper-explode-assignable-expression|@babel/helper-function-name|@babel/helper-get-function-arity|@babel/helper-hoist-variables|@babel/helper-member-expression-to-functions|@babel/helper-module-imports|@babel/helper-optimise-call-expression|@babel/helper-plugin-utils|@babel/helper-remap-async-to-generator|@babel/helper-replace-supers|@babel/helper-simple-access|@babel/helper-skip-transparent-expression-wrappers|@babel/helper-split-export-declaration|@babel/helper-validator-identifier|@babel/helper-validator-option|@babel/helper-wrap-function|@babel/helpers|@babel/highlight|@babel/parser|@babel/plugin-proposal-async-generator-functions|@babel/plugin-proposal-class-properties|@babel/plugin-proposal-dynamic-import|@babel/plugin-proposal-export-namespace-from|@babel/plugin-proposal-json-strings|@babel/plugin-proposal-logical-assignment-operators|@babel/plugin-proposal-nullish-coalescing-operator|@babel/plugin-proposal-numeric-separator|@babel/plugin-proposal-object-rest-spread|@babel/plugin-proposal-optional-catch-binding|@babel/plugin-proposal-optional-chaining|@babel/plugin-proposal-private-methods|@babel/plugin-proposal-throw-expressions|@babel/plugin-syntax-async-generators|@babel/plugin-syntax-class-properties|@babel/plugin-syntax-dynamic-import|@babel/plugin-syntax-export-namespace-from|@babel/plugin-syntax-json-strings|@babel/plugin-syntax-logical-assignment-operators|@babel/plugin-syntax-nullish-coalescing-operator|@babel/plugin-syntax-numeric-separator|@babel/plugin-syntax-object-rest-spread|@babel/plugin-syntax-optional-catch-binding|@babel/plugin-syntax-optional-chaining|@babel/plugin-syntax-private-methods|@babel/plugin-syntax-throw-expressions|@babel/plugin-transform-arrow-functions|@babel/plugin-transform-async-to-generator|@babel/plugin-transform-block-scoped-functions|@babel/plugin-transform-block-scoping|@babel/plugin-transform-classes|@babel/plugin-transform-computed-properties|@babel/plugin-transform-destructuring|@babel/plugin-transform-dotall-regex|@babel/plugin-transform-duplicate-keys|@babel/plugin-transform-exponentiation-operator|@babel/plugin-transform-for-of|@babel/plugin-transform-function-name|@babel/plugin-transform-literals|@babel/plugin-transform-member-expression-literals|@babel/plugin-transform-modules-amd|@babel/plugin-transform-modules-commonjs|@babel/plugin-transform-modules-systemjs|@babel/plugin-transform-modules-umd|@babel/plugin-transform-named-capturing-groups-regex|@babel/plugin-transform-new-target|@babel/plugin-transform-object-super|@babel/plugin-transform-parameters|@babel/plugin-transform-property-literals|@babel/plugin-transform-regenerator|@babel/plugin-transform-reserved-words|@babel/plugin-transform-shorthand-properties|@babel/plugin-transform-spread|@babel/plugin-transform-sticky-regex|@babel/plugin-transform-template-literals|@babel/plugin-transform-typeof-symbol|@babel/plugin-transform-unicode-escapes|@babel/plugin-transform-unicode-regex|@babel/preset-env|@babel/preset-modules|@babel/preset-react|@babel/preset-typescript|@babel/runtime|@babel/template|@babel/traverse|@babel/types)/)',
  ],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/*.test.{js,jsx,ts,tsx}',
    '!src/**/index.{js,jsx,ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
}

module.exports = config 