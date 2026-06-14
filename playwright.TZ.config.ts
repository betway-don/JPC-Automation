import { defineConfig, devices } from '@playwright/test';

// Region marker — the locator loader merges src/regions/TZ/locators.ts over the base.
process.env.JPC_REGION = 'TZ';

export default defineConfig({
  testDir: './src/regions/TZ/tests',
  fullyParallel: true,
  timeout: 200000,
  expect: { timeout: 15000 },
  forbidOnly: !!process.env.CI,
  retries: 1,
  workers: process.env.CI ? 1 : 6,
  reporter: [
    ['html', { outputFolder: 'src/regions/TZ/reports/html-report', open: 'never' }],
    ['allure-playwright', { outputFolder: 'src/regions/TZ/reports/allure-results' }],
    ['list'],
    ['blob', { outputDir: process.env.BLOB_OUTPUT_DIR || 'blob-report' }],
  ],
  use: {
    baseURL: 'https://en.jackpotcitycasino.co.tz',
    viewport: null,
    launchOptions: {
      args: ['--start-maximized'],
    },
    trace: 'on-first-retry',
    screenshot: 'on',          // auto evidence per test — specs no longer call ScreenshotHelper
    actionTimeout: 60000,
    navigationTimeout: 60000,
  },
  projects: [
    {
      name: 'TZ Region',
      use: {
        ...devices['Desktop Chrome'],
        viewport: null,
        deviceScaleFactor: undefined,
        launchOptions: {
          args: ['--start-maximized'],
        },
      },
    },
  ],
});
