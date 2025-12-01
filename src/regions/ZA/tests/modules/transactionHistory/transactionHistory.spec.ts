import path from 'path';
import { test, Browser, chromium, Page } from '@playwright/test';
import { highlightElements } from '../../../../../common/actions/HighlightElements';
import { ScreenshotHelper } from '../../../../../common/actions/ScreenshotHelper';

const projectRoot = path.resolve(__dirname, '../../../../..');
const screenshotDir = path.join(projectRoot, 'screenshots/module/transactionHistory');

async function login(page: Page, mobile: string, password: string) {
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'username' }).fill(mobile);
    await page.getByRole('textbox', { name: 'password' }).fill(password);
    await page.getByRole('textbox', { name: 'password' }).press('Enter');
    await page.waitForLoadState('domcontentloaded');
}

test.describe('Transaction History Tests', () => {
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

    test('T1. Verify Page Loads Correctly', async ({ }, testInfo) => {
        await login(page, '640987655', '12345678');
        await page.getByRole('button', { name: 'menu' }).click();
        await page.locator('.hamburger-account-options:has-text("Transaction Summary")').nth(0).click();
        await page.waitForTimeout(2000);
        await ScreenshotHelper(page, screenshotDir, 'T1-transactionHistory', testInfo);
    });

    test('T2. Verify Presence of All Column Headers', async ({ }, testInfo) => {
        await login(page, '640987655', '12345678');
        await page.getByRole('button', { name: 'menu' }).click();
        await page.locator('.hamburger-account-options:has-text("Transaction Summary")').nth(0).click();
        await page.waitForTimeout(2000);
        await highlightElements(page.getByText('Transaction ID'));
        await highlightElements(page.getByText('Date', { exact: true }));
        await highlightElements(page.getByText('Game Name'));
        await highlightElements(page.getByText('Transaction Type'));
        await highlightElements(page.getByText('Amount'));
        await ScreenshotHelper(page, screenshotDir, 'T2-transactionHistory', testInfo);
    });

    test('T3. Verify Correct Display of Transaction Types', async ({ }, testInfo) => {
        await login(page, '640987655', '12345678');
        await page.getByRole('button', { name: 'menu' }).click();
        await page.locator('.hamburger-account-options:has-text("Transaction Summary")').nth(0).click();
        await page.waitForTimeout(2000);
        // All Transaction Type cells (4th column)
        // All Transaction Type cells (4th column)
        const txTypeCells = page.locator('tr.rowData td:nth-child(4) span.truncate');

        const count = await txTypeCells.count();

        for (let i = 0; i < count; i++) {
            const cell = txTypeCells.nth(i);
            const text = (await cell.textContent())?.trim() || '';

            if (/Wager|Payout/i.test(text)) {
                // This locator points to exactly ONE element -> no strict mode error
                await highlightElements(cell);
            }
        }

        // Highlight them
        await ScreenshotHelper(page, screenshotDir, 'T3-transactionHistory', testInfo);
    });

    test('T4. Verify Amount Formatting for Payout', async ({ }, testInfo) => {
        await login(page, '640987655', '12345678');
        await page.getByRole('button', { name: 'menu' }).click();
        await page.locator('.hamburger-account-options:has-text("Transaction Summary")').nth(0).click();
        await page.waitForTimeout(2000);
        const rows = page.locator('tbody tr.rowData');
        const rowCount = await rows.count();

        for (let i = 0; i < rowCount; i++) {
            const row = rows.nth(i);
            const amountCell = row.locator('td').nth(4); // 5th column

            const minusSpanCount = await amountCell
                .locator('span.gold-gradient-text.font-bold')
                .count();

            // No minus span => positive
            if (minusSpanCount === 0) {
                await highlightElements(amountCell);
            }
        }
        await ScreenshotHelper(page, screenshotDir, 'T4-transactionHistory', testInfo);
    });

    test('T5. Verify Amount Formatting for Wager', async ({ }, testInfo) => {
        await login(page, '640987655', '12345678');
        await page.getByRole('button', { name: 'menu' }).click();
        await page.locator('.hamburger-account-options:has-text("Transaction Summary")').nth(0).click();
        await page.waitForTimeout(2000);
        const rows = page.locator('tbody tr.rowData');
        const rowCount = await rows.count();

        for (let i = 0; i < rowCount; i++) {
            const row = rows.nth(i);
            const amountCell = row.locator('td').nth(4); // 0-based index -> 5th column (Amount)

            // This span exists ONLY for negative amounts
            const minusSpanCount = await amountCell
                .locator('span.gold-gradient-text.font-bold')
                .count();

            if (minusSpanCount > 0) {
                await highlightElements(amountCell);
            }
        }
        await ScreenshotHelper(page, screenshotDir, 'T5-transactionHistory', testInfo);
    });


    test('T6. Verify Tlog Icon Opens Detailed View', async ({ }, testInfo) => {
        await login(page, '640987655', '12345678');
        await page.getByRole('button', { name: 'menu' }).click();
        await page.locator('.hamburger-account-options:has-text("Transaction Summary")').nth(0).click();
        await page.waitForTimeout(2000);
        await page.locator('td .showDetail').first().click();
        await ScreenshotHelper(page, screenshotDir, 'T6-transactionHistory', testInfo);
    });

    test('T7. Verify Detailed View', async ({ }, testInfo) => {
        await login(page, '640987655', '12345678');
        await page.getByRole('button', { name: 'menu' }).click();
        await page.locator('.hamburger-account-options:has-text("Transaction Summary")').nth(0).click();
        await page.waitForTimeout(2000);
        await page.locator('td .showDetail').first().click();
        await page.waitForTimeout(2000);
        await highlightElements(page.getByText('Bookmaker', { exact: true }).locator('..'));
        await highlightElements(page.getByText('Date', { exact: true }).locator('..'));
        await highlightElements(page.getByText('Transaction ID', { exact: true }).locator('..'));
        await highlightElements(page.getByText('Game Name', { exact: true }).locator('..'));
        await highlightElements(page.getByText('Transaction Type', { exact: true }).locator('..'));
        await highlightElements(page.getByText('Wager Type', { exact: true }).locator('..'));
        await highlightElements(page.getByText('Amount', { exact: true }).locator('..'));
        await highlightElements(page.getByText('Address', { exact: true }).locator('..'));
        await ScreenshotHelper(page, screenshotDir, 'T7-transactionHistory', testInfo);
    });

    test('T8. Verify Back Button Functionality', async ({ }, testInfo) => {
        await login(page, '640987655', '12345678');
        await page.getByRole('button', { name: 'menu' }).click();
        await page.locator('.hamburger-account-options:has-text("Transaction Summary")').nth(0).click();
        await page.waitForTimeout(2000);
        await page.locator('td .showDetail').first().click();
        await page.waitForTimeout(2000);
        await page.locator('button:has(svg path[d*="15.75 19.5"])').first().click();
        await ScreenshotHelper(page, screenshotDir, 'T8-transactionHistory', testInfo);
    });

    test('T9. Verify Refresh Icon Reloads Transaction List', async ({ }, testInfo) => {
        await login(page, '640987655', '12345678');
        await page.getByRole('button', { name: 'menu' }).click();
        await page.locator('.hamburger-account-options:has-text("Transaction Summary")').nth(0).click();
        await page.waitForTimeout(2000);
        await highlightElements(page.getByRole('button', { name: 'Refresh' }));
        await page.getByRole('button', { name: 'Refresh' }).click();
        await ScreenshotHelper(page, screenshotDir, 'T9-transactionHistory', testInfo);
    });


    // Pagination Functionality


    test('T10. Verify Next Page Button', async ({ }, testInfo) => {
        await login(page, '640987655', '12345678');
        await page.getByRole('button', { name: 'menu' }).click();
        await page.locator('.hamburger-account-options:has-text("Transaction Summary")').nth(0).click();
        await page.waitForTimeout(2000);
        await page.locator('.border-l > .w-6').click();
        await ScreenshotHelper(page, screenshotDir, 'T10-transactionHistory', testInfo);
    });

    test('T11. Verify Page Number Functionality', async ({ }, testInfo) => {
        await login(page, '640987655', '12345678');
        await page.getByRole('button', { name: 'menu' }).click();
        await page.locator('.hamburger-account-options:has-text("Transaction Summary")').nth(0).click();
        await page.waitForTimeout(2000);
        await highlightElements(page.locator('.pagination'));
        await ScreenshotHelper(page, screenshotDir, 'T11-transactionHistory', testInfo);
    });

    test('T12. Verify Go to Page Functionality', async ({ }, testInfo) => {
        await login(page, '640987655', '12345678');
        await page.getByRole('button', { name: 'menu' }).click();
        await page.locator('.hamburger-account-options:has-text("Transaction Summary")').nth(0).click();
        await page.waitForTimeout(2000);
        await page.getByText('...').click();
        await page.locator('#goToInput').click();
        await page.getByRole('button', { name: 'go' }).click();
        await page.waitForTimeout(2000);
        await ScreenshotHelper(page, screenshotDir, 'T12-transactionHistory', testInfo);
    });

    test('T13. Verify Previous Page Button', async ({ }, testInfo) => {
        await login(page, '640987655', '12345678');
        await page.getByRole('button', { name: 'menu' }).click();
        await page.locator('.hamburger-account-options:has-text("Transaction Summary")').nth(0).click();
        await page.waitForTimeout(2000);
        await page.locator('.w-6.dark\\:text-white > path').click();
        await ScreenshotHelper(page, screenshotDir, 'T13-transactionHistory', testInfo);
    });

    // filter feature


     test('T14. Verify Filter Button', async ({ }, testInfo) => {
        await login(page, '640987655', '12345678');
        await page.getByRole('button', { name: 'menu' }).click();
        await page.locator('.hamburger-account-options:has-text("Transaction Summary")').nth(0).click();
        await page.waitForTimeout(2000);
        await page.getByRole('button', { name: 'Filter' }).click();
        await ScreenshotHelper(page, screenshotDir, 'T14-transactionHistory', testInfo);
    });



});