import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src/regions/TZ/tests',
  fullyParallel: true,
  timeout: 200000,
  forbidOnly: !!process.env.CI,
  retries: 1,
  workers: process.env.CI ? 1 : 6,
  reporter: [
    ['html', { outputFolder: 'src/regions/TZ/reports/html-report', open: 'never' }],
    ['allure-playwright', { outputFolder: 'src/regions/TZ/reports/allure-results' }]
  ],
  use: {
    baseURL: 'https://en.jackpotcitycasino.co.tz',
    viewport: null,
    launchOptions: {
      args: ['--start-maximized'],
    },
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
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
