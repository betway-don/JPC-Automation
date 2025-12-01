import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src/regions/MW/tests',
  fullyParallel: true,
  timeout: 200000,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 1,
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
