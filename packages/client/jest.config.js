/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  displayName: "client",
  preset: "ts-jest",
  testEnvironment: "jsdom",
  rootDir: "../../",
  roots: ["<rootDir>/packages/client"],
};
