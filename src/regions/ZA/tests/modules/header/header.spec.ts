// getByRole('button', { name: 'menu' })
// getByRole('link', { name: 'Jackpotcity', exact: true })

import path from 'path';
import { test } from '@playwright/test';
import { highlightElements } from '../../../../Common-Flows/HighlightElements';
import { ScreenshotHelper } from '../../../../Common-Flows/ScreenshotHelper';
import { Browser, chromium, Page } from '@playwright/test';

const projectRoot = path.resolve(__dirname, '../../..');
const screenshotDir = path.join(projectRoot, 'screenshots/module/header');

async function login(page: Page, mobile: string, password: string) {
    await page.getByRole('textbox', { name: 'Login' }).fill(mobile);
    await page.getByRole('textbox', { name: 'username' }).fill(password);
    await page.getByRole('textbox', { name: 'password' }).press('Enter');
    await page.waitForLoadState('domcontentloaded');
}

test.describe('Header Tests', () => {
    let browser: Browser;
    let context: any;
    let page: any;

    test.beforeAll(async () => {
        // Manually create a single browser instance, context, and page
        browser = await chromium.launch();
        context = await browser.newContext();
        page = await context.newPage();

        await page.goto('https://jackpotcity.co.za/', { waitUntil: 'domcontentloaded' });
    });

    test.afterAll(async () => {
        // Clean up browser resources
        await page.close();
        await context.close();
        await browser.close();
    });

    test('T1. Verify Hamburger menu visibility and clickability', async ({ }, testInfo) => {
        await highlightElements(page.getByRole('button', { name: 'menu' }));
        await page.getByRole('button', { name: 'menu' }).click();
        await ScreenshotHelper(page, screenshotDir, 'header-menu', testInfo);
    });

    test('T2. Verify Jackpotcity logo visibility and clickability', async ({ }, testInfo) => {
        await highlightElements(page.getByRole('link', { name: 'Jackpotcity', exact: true }));
        await page.getByRole('link', { name: 'Jackpotcity', exact: true }).click();
        // do alt + d from the keyboard and then do ctrl + c to copy the url and log it in the repot
        await ScreenshotHelper(page, screenshotDir, 'header-menu', testInfo);
    });

    test('T3. Verify Search bar input functionality', async ({ }, testInfo) => {
        await page.getByText('Search games').click();
        await highlightElements(page.getByRole('textbox', { name: 'Search games' }));
        await page.getByRole('textbox', { name: 'Search games' }).fill('dimond');
        await page.getByRole('textbox', { name: 'Search games' }).press('Enter');
        await page.waitForTimeout(2000);
        await ScreenshotHelper(page, screenshotDir, 'header-menu', testInfo);
    });

    test('T4. Verify Login CTA visibility and navigation', async ({ }, testInfo) => {
        await highlightElements(page.getByRole('button', { name: 'Login' }));
        await page.getByRole('button', { name: 'Login' }).click();
        await ScreenshotHelper(page, screenshotDir, 'header-menu', testInfo);
    });

    test('T5. Verify Register CTA visibility and navigation', async ({ }, testInfo) => {
        await highlightElements(page.getByRole('button', { name: 'Register' }));
        await page.getByRole('button', { name: 'Register' }).click();
        await ScreenshotHelper(page, screenshotDir, 'header-menu', testInfo);
    });

    test('T6. Verify Live Chat icon functionality', async ({ }, testInfo) => {
        await highlightElements(page.getByRole('button', { name: 'Live Chat' }));
        await page.getByRole('button', { name: 'Live Chat' }).click();
        await page.waitForTimeout(4000);
        await ScreenshotHelper(page, screenshotDir, 'header-menu', testInfo);
    });

    test('T7. Verify Theme Change icon toggles theme', async ({ }, testInfo) => {
        await highlightElements(page.locator('#site-header').getByLabel('light-mode'));
        await page.locator('#site-header').getByLabel('light-mode').click();
        await page.waitForTimeout(4000);
        await ScreenshotHelper(page, screenshotDir, 'header-menu', testInfo);
    });



    // logged in test cases for header

    test('T8. Verify Login functionality', async ({ }, testInfo) => {
        await login(page, '640987654', 'Jackpot@123');
        await highlightElements(page.getByRole('button', { name: 'menu' }));
        await page.getByRole('button', { name: 'menu' }).click();
        await ScreenshotHelper(page, screenshotDir, 'header-menu', testInfo);
    });




});