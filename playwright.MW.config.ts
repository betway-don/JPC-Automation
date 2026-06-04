import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src/regions/MW/tests',
  fullyParallel: true,
  timeout: 200000,
  forbidOnly: !!process.env.CI,
  retries: 1,
  workers: process.env.CI ? 1 : 6,
  reporter: [
    ['html', { outputFolder: 'src/regions/MW/reports/html-report', open: 'never' }],
    ['allure-playwright', { outputFolder: 'src/regions/MW/reports/allure-results' }]
  ],
  use: {
    baseURL: 'https://www.jackpotcitycasino.mw/',
    viewport: null,                        // <- This disables the fixed viewport size, so browser window controls actual size
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
      name: 'MW Region',
      use: {
        ...devices['Desktop Chrome'],
        viewport: null,
        deviceScaleFactor: undefined,
        launchOptions: {
          args: ['--start-maximized'],
        },
      }
    },
  ],
});
