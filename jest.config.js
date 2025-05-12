const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(jose|openid-client|next-auth|@next-auth|@auth|@babel|@react|react|@reduxjs|redux|@testing-library|@vercel|vercel|@types|typescript|@emotion|emotion|@mui|@stripe|stripe|@firebase|firebase|@google-cloud|@aws-sdk|aws-sdk|@azure|azure|@microsoft|microsoft|@azure/identity|@azure/core-auth|@azure/core-http|@azure/core-lro|@azure/core-paging|@azure/core-tracing|@azure/core-util|@azure/logger|@azure/abort-controller|@azure/core-rest-pipeline|@azure/core-client|@azure/core-asynciterator-polyfill|@azure/core-auth|@azure/core-http|@azure/core-lro|@azure/core-paging|@azure/core-tracing|@azure/core-util|@azure/logger|@azure/abort-controller|@azure/core-rest-pipeline|@azure/core-client|@azure/core-asynciterator-polyfill)/)'
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig) 