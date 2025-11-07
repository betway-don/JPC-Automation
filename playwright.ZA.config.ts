import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src/regions/ZA/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'src/regions/ZA/reports/html-report' }],
    ['allure-playwright', { outputFolder: 'src/regions/ZA/reports/allure-results' }]
  ],
  use: {
    // baseURL: 'http://za.example.com', // Set region-specific baseURL if needed
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    // Store screenshots in region/module folders manually in test code if needed
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
