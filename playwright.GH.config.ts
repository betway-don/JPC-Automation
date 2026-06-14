import { defineConfig, devices } from '@playwright/test';

// Region marker — the locator loader merges src/regions/GH/locators/locators.json
// over the global (ZA-hardened) locators for any element where GH markup differs.
process.env.JPC_REGION = 'GH';

// (GH account restriction lifted 2026-06-13 — logged-in tests run normally again.)

export default defineConfig({
    testDir: './src/regions/GH/tests',
    fullyParallel: true,
    timeout: 200000,
    expect: { timeout: 15000 },
    forbidOnly: !!process.env.CI,
    retries: 1,
    workers: process.env.CI ? 1 : 6,
    reporter: [
        ['html', { outputFolder: 'src/regions/GH/reports/html-report', open: 'never' }],
        ['allure-playwright', { outputFolder: 'src/regions/GH/reports/allure-results' }],
        ['list'],
        ['blob', { outputDir: process.env.BLOB_OUTPUT_DIR || 'blob-report' }],
    ],
    use: {
        baseURL: 'https://www.jackpotcitycasino.com.gh/',
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
