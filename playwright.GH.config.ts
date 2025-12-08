import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './src/regions/GH/tests',
    fullyParallel: true,
    timeout: 200000,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : 1,
    reporter: [
        ['html', { outputFolder: 'src/regions/GH/reports/html-report', open: 'never' }],
        ['allure-playwright', { outputFolder: 'src/regions/GH/reports/allure-results' }]
    ],
    use: {
        baseURL: 'https://www.jackpotcitycasino.com.gh/',
        viewport: null,
        launchOptions: {
            args: ['--start-maximized'],
        },
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
    },

    projects: [
        {
            name: 'GH Region',
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
