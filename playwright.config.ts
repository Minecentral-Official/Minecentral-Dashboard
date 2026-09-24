import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 120000,
  expect: { timeout: 20000 },
  workers: 1,
  fullyParallel: false,
  forbidOnly: true,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:3100',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'desktop',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'tests/.auth/desktop.json',
      },
    },
    {
      name: 'mobile',
      use: { ...devices['Pixel 7'], storageState: 'tests/.auth/mobile.json' },
    },
  ],
  webServer: {
    command: 'pnpm exec tsx scripts/workspace-test-server.ts',
    url: 'http://127.0.0.1:3100/sign-in',
    timeout: 180000,
    reuseExistingServer: false,
    gracefulShutdown: { signal: 'SIGTERM', timeout: 10000 },
  },
});
