// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  clearMocks: true,
  collectCoverageFrom: [
    'src/**/*.js'
  ],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  testRegex: '(/__tests__/.*|(\\.|_|/)(test|spec))\\.jsx?$',
  // testMatch: [
  //   "**/__tests__/**/*.[jt]s?(x)",
  //   "**/?(*.)+(spec|test).[tj]s?(x)"
  // ],
  setupFilesAfterEnv: ['./jest.setup.js'],
  preset: '@shelf/jest-dynamodb'
};
