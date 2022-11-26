/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  displayName: "server",
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: "../../",
  roots: ["<rootDir>/packages/server"],
};
