// Four named suites so a failure says which kind of promise broke.
export default [
  { test: { name: 'unit', include: ['tests/unit/**/*.test.ts'] } },
  { test: { name: 'contract', include: ['tests/contract/**/*.test.ts'] } },
  { test: { name: 'architecture', include: ['tests/architecture/**/*.test.ts'] } },
  { test: { name: 'integration', include: ['tests/integration/**/*.test.ts'] } },
]
