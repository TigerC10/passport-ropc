require('babel-core');
require('babel-polyfill');

module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '**/?(*.)+(spec|test).js?(x)',
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
  ],
  coverageDirectory: '__tests__/coverage',
  coverageThreshold: {
    global: {
      branches: 1,
      functions: 1,
      statements: 1,
      lines: 1,
    },
  },
  verbose: true,
};
