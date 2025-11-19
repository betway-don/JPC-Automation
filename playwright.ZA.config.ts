import { defineConfig, devices } from '@playwright/test';
 
export default defineConfig({
  testDir: './src/regions/ZA/tests',
  fullyParallel: true,
  timeout: 200000,  
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 3 : 6,
  reporter: [
    ['html', { outputFolder: 'src/regions/ZA/reports/html-report',open: 'never' }],
    ['allure-playwright', { outputFolder: 'src/regions/ZA/reports/allure-results' }]
  ],
  use: {
    baseURL: 'https://new.betway.co.za/',
    viewport: null,                        // <- This disables the fixed viewport size, so browser window controls actual size
    launchOptions: {
      args: ['--start-maximized'],
    },
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
 
  projects: [
    {
      name: 'ZA Region',
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
