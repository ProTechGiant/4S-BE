// jest.config.js
module.exports = {
  testTimeout: 100000,
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/*.test.ts"],
  collectCoverage: true,
  coverageDirectory: "coverage",
  collectCoverageFrom: ["src/**/*.ts"],
  coverageReporters: ["lcov", "text"],
  // testPathIgnorePatterns: ["<rootDir>/src/**/*.spec.ts"],
};
