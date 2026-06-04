// import { defineConfig, devices } from '@playwright/test';

// export default defineConfig({
//   testDir: './src/regions/ZA/tests',
//   fullyParallel: true,
//   timeout: 200000,
//   forbidOnly: !!process.env.CI,
//   retries: process.env.CI ? 2 : 0,
//   workers: process.env.CI ? 1 : 1,
//   reporter: [
//     ['html', { outputFolder: 'src/regions/ZA/reports/html-report', open: 'never' }],
//     ['allure-playwright', { outputFolder: 'src/regions/ZA/reports/allure-results' }]
//   ],
//   use: {
//     baseURL: 'https://www.jackpotcity.co.za/',
//     viewport: null,                        // <- This disables the fixed viewport size, so browser window controls actual size
//     launchOptions: {
//       args: ['--start-maximized'],
//     },
//     trace: 'on-first-retry',
//     screenshot: 'only-on-failure',
//   },

//   projects: [
//     {
//       name: 'ZA Region',
//       use: {
//         ...devices['Desktop Chrome'],
//         viewport: null,
//         deviceScaleFactor: undefined,
//         launchOptions: {
//           args: ['--start-maximized'],
//         },
//       }
//     },
//   ],
// });


// import { defineConfig, devices } from '@playwright/test';
 
// export default defineConfig({
//   testDir: './src/regions/ZA/tests',
//   fullyParallel: true,
//   timeout: 200000,
//   forbidOnly: !!process.env.CI,
//   retries: process.env.CI ? 2 : 0,
//   workers: process.env.CI ? 8 : 8,
//   reporter: [
//     ['html', { outputFolder: 'playwright-report', open: 'never' }],
//     ['list'],
//     ['json', { outputFile: process.env.PLAYWRIGHT_JSON_OUTPUT_NAME || 'test-results.json' }]
//   ],
//   use: {
//     baseURL: 'https://new.betway.co.za/',
//     viewport: null,                        // <- This disables the fixed viewport size, so browser window controls actual size
//     launchOptions: {
//       args: ['--start-maximized'],
//     },
//     trace: 'on-first-retry',
//     screenshot: 'only-on-failure',
 
//     actionTimeout: 120000,      // any single action (click, fill, etc.) will fail after 2 min
//     navigationTimeout: 120000,  // navigation waits will fail after 2 min
//   },
 
//   projects: [
//     {
//       name: 'ZA Region',
//       use: {
//         ...devices['Desktop Chrome'],
//         viewport: null,
//         deviceScaleFactor: undefined,
//         launchOptions: {
//           args: ['--start-maximized'],
//         },
//       }
//     },
//   ],
// });
 
import { defineConfig, devices } from '@playwright/test';
import path from 'path';
 
export default defineConfig({
  testDir: './src/regions/ZA/tests',
 
  fullyParallel: true,
  timeout: 90000,
 
  forbidOnly: !!process.env.CI,
 
  // 👉 Retry ONLY failed tests once
  retries: 1,
 
  // Workers
  workers: process.env.CI ? 2 : 6,
 
  // Reports
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
    ['json', { outputFile: path.resolve(__dirname, 'src/regions/ZA/reports', process.env.PLAYWRIGHT_JSON_OUTPUT_NAME || 'test-results.json') }],
    ['allure-playwright', { resultsDir: path.resolve(__dirname, 'src/regions/ZA/reports/allure-results') }],
    ['./src/common/utils/FailedScreenshotReporter.ts']
  ],
 
  // ['json', { outputFile: 'test-results.json' }],
  // ['allure-playwright', { resultsDir: path.resolve(__dirname, 'src/regions/ZA/reports/allure-results') }],
  use: {
    baseURL: 'https://www.jackpotcity.co.za/',
 
    // Use real browser window size
    viewport: null,
    deviceScaleFactor: undefined,
 
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
      name: 'ZA Region',
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