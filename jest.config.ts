import type { Config } from 'jest';

const config: Config = {
  rootDir: 'src',
  moduleFileExtensions: ['js', 'json', 'ts'],
  testRegex: '.*\\.test\\.ts$',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
};

export default config;
