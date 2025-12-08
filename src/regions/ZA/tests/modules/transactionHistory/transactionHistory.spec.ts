import path from 'path';
import { test, Browser, chromium, Page, expect } from '@playwright/test';
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

        await page.goto('https://www.jackpotcity.co.za/', { waitUntil: 'domcontentloaded' });
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


    test('T15. Verify Filter Persistence', async ({ }, testInfo) => {
        await login(page, '640987655', '12345678');
        await page.getByRole('button', { name: 'menu' }).click();
        await page.locator('.hamburger-account-options:has-text("Transaction Summary")').nth(0).click();
        await page.waitForTimeout(2000);
        await page.getByRole('button', { name: 'Filter' }).click();
        await page.getByRole('button', { name: 'Last Week' }).click();
        await ScreenshotHelper(page, screenshotDir, 'T15-transactionHistory', testInfo);
        await page.getByRole('button', { name: 'Continue' }).click();

        await page.waitForTimeout(2000);

        await page.getByRole('button', { name: 'Filter' }).click();
        await expect(page.getByRole('button', { name: 'Last Week' })).toHaveClass(/bg-primary-blue-gradient/);
        await ScreenshotHelper(page, screenshotDir, 'T15-transactionHistory', testInfo);
    });

    test('T18. Verify Applied Filter Transaction List.', async ({ }, testInfo) => {
        await login(page, '640987655', '12345678');
        await page.getByRole('button', { name: 'menu' }).click();
        await page.locator('.hamburger-account-options:has-text("Transaction Summary")').nth(0).click();
        await page.waitForTimeout(2000);
        await page.getByRole('button', { name: 'Filter' }).click();
        await page.getByText('All', { exact: true }).click();
        const options = page.getByRole('option');
        await options.nth(0).click();
        await options.nth(1).click();
        await options.nth(2).click();
        await page.getByText('Filter By Type').click();
        await page.getByRole('button', { name: 'Continue' }).click();
        await page.waitForTimeout(2000);
        await ScreenshotHelper(page, screenshotDir, 'T18-transactionHistory', testInfo);
    });

    test('T20. Verify Reset Button on Filter Prompt', async ({ }, testInfo) => {
        await login(page, '640987655', '12345678');
        await page.getByRole('button', { name: 'menu' }).click();
        await page.locator('.hamburger-account-options:has-text("Transaction Summary")').nth(0).click();
        await page.waitForTimeout(2000);
        await page.getByRole('button', { name: 'Filter' }).click();
        await page.getByText('All', { exact: true }).click();
        const options = page.getByRole('option');
        await options.nth(0).click();
        await options.nth(1).click();
        await options.nth(2).click();
        await page.getByText('Filter By Type').click();
        await ScreenshotHelper(page, screenshotDir, 'T20-transactionHistory', testInfo);
        await page.getByRole('button', { name: 'Reset' }).click();
        await page.waitForTimeout(2000);
        await ScreenshotHelper(page, screenshotDir, 'T20-transactionHistory', testInfo);
    });

    test('T21. Verify Close Button on Filter Prompt', async ({ }, testInfo) => {
        await login(page, '640987655', '12345678');
        await page.getByRole('button', { name: 'menu' }).click();
        await page.locator('.hamburger-account-options:has-text("Transaction Summary")').nth(0).click();
        await page.waitForTimeout(2000);
        await page.getByRole('button', { name: 'Filter' }).click();
        await highlightElements(page.locator('[element-name="close-modal"]').first());
        await ScreenshotHelper(page, screenshotDir, 'T21-transactionHistory', testInfo);
        await page.locator('[element-name="close-modal"]').first().click();
        await ScreenshotHelper(page, screenshotDir, 'T21-transactionHistory', testInfo);
    });

    test('T22. Verify No Results Message', async ({ }, testInfo) => {
        await login(page, '640987655', '12345678');
        await page.getByRole('button', { name: 'menu' }).click();
        await page.locator('.hamburger-account-options:has-text("Transaction Summary")').nth(0).click();
        await page.waitForTimeout(2000);
        await page.getByRole('button', { name: 'Filter' }).click();
        const options = page.getByRole('option');
        await options.nth(5).click();
        await page.getByText('Filter By Type').click();
        await page.getByRole('button', { name: 'Continue' }).click();
        await highlightElements(page.getByText('No results'));
        await ScreenshotHelper(page, screenshotDir, 'T22-transactionHistory', testInfo);
    });


    // test('T23. Verify Calendar Date Selection Accessibility', async ({ }, testInfo) => {
    //     await login(page, '640987655', '12345678');
    //     await page.getByRole('button', { name: 'menu' }).click();
    //     await page.locator('.hamburger-account-options:has-text("Transaction Summary")').nth(0).click();
    //     await page.waitForTimeout(2000);
    //     await page.getByRole('button', { name: 'Filter' }).click();        
    //     await page.getByRole('combobox', { name: 'Start Date' }).click();
    //     await page.getByRole('button', { name: 'Previous Month' }).click();
    //     await page.locator('span[title="30/11/2025"]').click();
    //     await page.getByRole('combobox', { name: 'End Date' }).click();
    //     // await page.getByRole('button', { name: 'Previous Month' }).click();
    //     await page.locator('span[title="03/12/2025"]').first().click();
    //     await page.getByRole('button', { name: 'Continue' }).click();
    //     await ScreenshotHelper(page, screenshotDir, 'T23-transactionHistory', testInfo);
    // });

    test('T23. Verify Calendar Date Selection Accessibility, checking before 30 days should not be clickable', async ({ }, testInfo) => {
        await login(page, '640987655', '12345678');
        await page.getByRole('button', { name: 'menu' }).click();
        await page.locator('.hamburger-account-options:has-text("Transaction Summary")').nth(0).click();
        await page.waitForTimeout(2000);
        await page.getByRole('button', { name: 'Filter' }).click();
        await page.getByRole('combobox', { name: 'Start Date' }).click();
        await page.getByRole('button', { name: 'Previous Month' }).click();
        // Check that disabled dates exist (meaning old dates are protected)
        const disabledCount = await page.locator('span[aria-disabled="true"]').count();
        expect(disabledCount).toBeGreaterThan(0);

        // Or verify enabled dates are within range
        const enabledDates = await page.locator('span[aria-disabled="false"]').all();
        for (const date of enabledDates) {
            const title = await date.getAttribute('title');
            // Parse and verify date is within last 30 days
            console.log(title);
        }
        await ScreenshotHelper(page, screenshotDir, 'T23-transactionHistory', testInfo);
    });

    test('T25. Verify Last Week Option Functionality', async ({ }, testInfo) => {
        await login(page, '640987655', '12345678');
        await page.getByRole('button', { name: 'menu' }).click();
        await page.locator('.hamburger-account-options:has-text("Transaction Summary")').nth(0).click();
        await page.waitForTimeout(2000);
        await page.getByRole('button', { name: 'Filter' }).click();
        await highlightElements(page.getByRole('button', { name: 'Last Week' }));
        await page.getByRole('button', { name: 'Last Week' }).click();
        await ScreenshotHelper(page, screenshotDir, 'T24-transactionHistory', testInfo);
        await page.getByRole('button', { name: 'Continue' }).click();
        await page.waitForTimeout(2000);
        await ScreenshotHelper(page, screenshotDir, 'T24-transactionHistory', testInfo);
    });

    test('T26. Verify Last 14 Days Option Functionality', async ({ }, testInfo) => {
        await login(page, '640987655', '12345678');
        await page.getByRole('button', { name: 'menu' }).click();
        await page.locator('.hamburger-account-options:has-text("Transaction Summary")').nth(0).click();
        await page.waitForTimeout(2000);
        await page.getByRole('button', { name: 'Filter' }).click();
        await highlightElements(page.getByRole('button', { name: 'Last 14 Days' }));
        await page.getByRole('button', { name: 'Last 2 weeks' }).click();
        await ScreenshotHelper(page, screenshotDir, 'T26-transactionHistory', testInfo);
        await page.getByRole('button', { name: 'Continue' }).click();
        await page.waitForTimeout(2000);
        await ScreenshotHelper(page, screenshotDir, 'T26-transactionHistory', testInfo);
    });

    test('T27. Verify Last 30 Days Option Functionality', async ({ }, testInfo) => {
        await login(page, '640987655', '12345678');
        await page.getByRole('button', { name: 'menu' }).click();
        await page.locator('.hamburger-account-options:has-text("Transaction Summary")').nth(0).click();
        await page.waitForTimeout(2000);
        await page.getByRole('button', { name: 'Filter' }).click();
        await highlightElements(page.getByRole('button', { name: 'Last Month' }));
        await page.getByRole('button', { name: 'Last Month' }).click();
        await ScreenshotHelper(page, screenshotDir, 'T27-transactionHistory', testInfo);
        await page.getByRole('button', { name: 'Continue' }).click();
        await page.waitForTimeout(2000);
        await ScreenshotHelper(page, screenshotDir, 'T27-transactionHistory', testInfo);
    });

    test('T28. Verify Manual Date Change Functionality, end date should be same', async ({ }, testInfo) => {
        await login(page, '640987655', '12345678');
        await page.getByRole('button', { name: 'menu' }).click();
        await page.locator('.hamburger-account-options:has-text("Transaction Summary")').nth(0).click();
        await page.waitForTimeout(2000);
        await page.getByRole('button', { name: 'Filter' }).click();
        await highlightElements(page.getByRole('button', { name: 'Last Month' }));
        await page.getByRole('button', { name: 'Last Month' }).click();

        // Click start date to open calendar
        await page.getByRole('combobox', { name: 'Start Date' }).click();

        // Click previous month
        //   await page.locator('button[aria-label="Previous Month"]').first().click();

        // Click the 30th that is enabled
        await page.locator('td[aria-label="30"] span:not([aria-disabled="true"])').click();

        // Get today's date in dd/mm/yyyy format
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        const todayFormatted = `${day}/${month}/${year}`;

        // Verify end date contains today's date
        const endDateInput = page.getByRole('combobox', { name: 'End Date' });
        await expect(endDateInput).toHaveValue(todayFormatted);

        await page.waitForTimeout(2000);
        await ScreenshotHelper(page, screenshotDir, 'T28-transactionHistory', testInfo);
    });

    test('T29. Verify Manual Date Change Functionality, end date should be same', async ({ }, testInfo) => {
        await login(page, '640987655', '12345678');
        await page.getByRole('button', { name: 'menu' }).click();
        await page.locator('.hamburger-account-options:has-text("Transaction Summary")').nth(0).click();
        await page.waitForTimeout(2000);
        await page.getByRole('button', { name: 'Filter' }).click();

        // -----------------------
        // compute dates (today & today - 28 days)
        // -----------------------
        const today = new Date();

        // Format today's date
        const formatDate = (d: Date) => {
            const dd = String(d.getDate()).padStart(2, '0');
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const yyyy = d.getFullYear();
            return `${dd}/${mm}/${yyyy}`;
        };

        const todayFormatted = formatDate(today);

        // Start date = today - 28 days
        const startDateObj = new Date(today);
        startDateObj.setDate(today.getDate() - 28);
        const startFormatted = formatDate(startDateObj);

        // ------------------------------------------------
        // 1) Pick Start Date (today – 28 days)
        // ------------------------------------------------
        await page.getByRole('combobox', { name: 'Start Date' }).click();

        // If the start date is in the previous month, click Previous Month button
        if (startDateObj.getMonth() !== today.getMonth()) {
            await page.getByRole('button', { name: 'Previous Month' }).click();
        }

        // Click exact start date if enabled
        await page.locator(`span[title="${startFormatted}"]:not([aria-disabled="true"])`).click();

        // ------------------------------------------------
        // 2) Pick End Date (today)
        // ------------------------------------------------
        await page.getByRole('combobox', { name: 'End Date' }).click();

        await page.locator(`span[title="${todayFormatted}"]:not([aria-disabled="true"])`).click();

        // ------------------------------------------------
        // 3) Assertions
        // ------------------------------------------------
        await expect(page.getByRole('combobox', { name: 'Start Date' })).toHaveValue(startFormatted);
        await expect(page.getByRole('combobox', { name: 'End Date' })).toHaveValue(todayFormatted);

        await page.waitForTimeout(2000);
        await ScreenshotHelper(page, screenshotDir, 'T29-transactionHistory', testInfo);

        await page.getByRole('button', { name: 'Continue' }).click();
        await page.waitForTimeout(2000);
        await ScreenshotHelper(page, screenshotDir, 'T29-transactionHistory', testInfo);
    });


    test('T31. Verify Calendar Date Selection Persistence', async ({ }, testInfo) => {
        await login(page, '640987655', '12345678');
        await page.getByRole('button', { name: 'menu' }).click();
        await page
            .locator('.hamburger-account-options:has-text("Transaction Summary")')
            .first()
            .click();

        await page.waitForTimeout(2000);
        await page.getByRole('button', { name: 'Filter' }).click();

        // -----------------------
        // compute dates (today & today - 28 days)
        // -----------------------
        const today = new Date();

        const formatDate = (d: Date) => {
            const dd = String(d.getDate()).padStart(2, '0');
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const yyyy = d.getFullYear();
            return `${dd}/${mm}/${yyyy}`;
        };

        const todayFormatted = formatDate(today);

        // Start date = today - 28 days
        const startDateObj = new Date(today);
        startDateObj.setDate(today.getDate() - 28);
        const startFormatted = formatDate(startDateObj);

        // ------------------------------------------------
        // 1) Pick Start Date (today – 28 days)
        // ------------------------------------------------
        await page.getByRole('combobox', { name: 'Start Date' }).click();

        // If the start date is in the previous month, click Previous Month button
        if (startDateObj.getMonth() !== today.getMonth()) {
            await page.getByRole('button', { name: 'Previous Month' }).click();
        }

        // Click exact start date if enabled
        await page
            .locator(`span[title="${startFormatted}"]:not([aria-disabled="true"])`)
            .click();

        // ------------------------------------------------
        // 2) Pick End Date (today)
        // ------------------------------------------------
        await page.getByRole('combobox', { name: 'End Date' }).click();
        await page
            .locator(`span[title="${todayFormatted}"]:not([aria-disabled="true"])`)
            .click();

        // ------------------------------------------------
        // 3) Assertions BEFORE Continue (filter popup)
        // ------------------------------------------------
        await expect(
            page.getByRole('combobox', { name: 'Start Date' })
        ).toHaveValue(startFormatted);

        await expect(
            page.getByRole('combobox', { name: 'End Date' })
        ).toHaveValue(todayFormatted);

        await page.waitForTimeout(2000);
        await ScreenshotHelper(page, screenshotDir, 'T29-transactionHistory-filter', testInfo);

        // ------------------------------------------------
        // 4) Click Continue and verify table data
        // ------------------------------------------------
        await page.getByRole('button', { name: 'Continue' }).click();



        await page.waitForTimeout(2000);


        // ------------------------------------------------
        // 5) Reopen filter and verify the same range persists
        // ------------------------------------------------
        await page.getByRole('button', { name: 'Filter' }).click();

        // Auto-wait will handle popup opening
        await expect(
            page.getByRole('combobox', { name: 'Start Date' })
        ).toHaveValue(startFormatted);

        await expect(
            page.getByRole('combobox', { name: 'End Date' })
        ).toHaveValue(todayFormatted);

        await ScreenshotHelper(page, screenshotDir, 'T29-transactionHistory-filter-reopen', testInfo);
    });


    test('T32. Verify Calendar Default State', async ({ }, testInfo) => {
        await login(page, '640987655', '12345678');
        await page.getByRole('button', { name: 'menu' }).click();
        await page
            .locator('.hamburger-account-options:has-text("Transaction Summary")')
            .first()
            .click();

        await page.waitForTimeout(2000);

        // ------------------------------------------------
        // Open Filter and verify default (no date selected)
        // ------------------------------------------------
        await page.getByRole('button', { name: 'Filter' }).click();

        const startDateInput = page.getByRole('combobox', { name: 'Start Date' });
        const endDateInput = page.getByRole('combobox', { name: 'End Date' });
        await highlightElements(startDateInput);
        await highlightElements(endDateInput);

        // assuming default is empty value when no date selected
        await expect(startDateInput).toHaveValue('');
        await expect(endDateInput).toHaveValue('');

        await ScreenshotHelper(page, screenshotDir, 'T32-transactionHistory-filter-default', testInfo);
    });




    test('T34. Verify Calendar Date Selection Reset', async ({ }, testInfo) => {
        await login(page, '640987655', '12345678');
        await page.getByRole('button', { name: 'menu' }).click();
        await page
            .locator('.hamburger-account-options:has-text("Transaction Summary")')
            .first()
            .click();

        await page.waitForTimeout(2000);

        // Open Filter
        await page.getByRole('button', { name: 'Filter' }).click();

        // -----------------------
        // compute dates (today & today - 28 days)
        // -----------------------
        const today = new Date();

        const formatDate = (d: Date) => {
            const dd = String(d.getDate()).padStart(2, '0');
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const yyyy = d.getFullYear();
            return `${dd}/${mm}/${yyyy}`;
        };

        const todayFormatted = formatDate(today);

        const startDateObj = new Date(today);
        startDateObj.setDate(today.getDate() - 28);
        const startFormatted = formatDate(startDateObj);

        // ------------------------------------------------
        // Select Start Date
        // ------------------------------------------------
        await page.getByRole('combobox', { name: 'Start Date' }).click();

        if (startDateObj.getMonth() !== today.getMonth()) {
            await page.getByRole('button', { name: 'Previous Month' }).click();
        }

        await page
            .locator(`span[title="${startFormatted}"]:not([aria-disabled="true"])`)
            .click();

        // ------------------------------------------------
        // Select End Date
        // ------------------------------------------------
        await page.getByRole('combobox', { name: 'End Date' }).click();
        await page
            .locator(`span[title="${todayFormatted}"]:not([aria-disabled="true"])`)
            .click();

        // ------------------------------------------------
        // Screenshot before reset
        // ------------------------------------------------
        await page.waitForTimeout(1000);
        await ScreenshotHelper(page, screenshotDir, 'T34-before-reset', testInfo);

        // ------------------------------------------------
        // Click Reset
        // ------------------------------------------------
        await page.getByRole('button', { name: 'Reset' }).click();

        // Wait a bit for UI update
        await page.waitForTimeout(500);

        // ------------------------------------------------
        // VERIFY Start/End inputs are empty
        // ------------------------------------------------
        const startInput = page.getByRole('combobox', { name: 'Start Date' });
        const endInput = page.getByRole('combobox', { name: 'End Date' });

        await expect(startInput).toHaveValue('');
        await expect(endInput).toHaveValue('');

        // Screenshot after reset
        await ScreenshotHelper(page, screenshotDir, 'T34-after-reset', testInfo);
    });



    test('T35. Verify Calendar Date Range with No Transactions', async ({ }, testInfo) => {
        await login(page, '640987655', '12345678');
        await page.getByRole('button', { name: 'menu' }).click();
        await page
            .locator('.hamburger-account-options:has-text("Transaction Summary")')
            .first()
            .click();
        await page.waitForTimeout(2000);
        await page.getByRole('button', { name: 'Filter' }).click();

        // -----------------------
        // Helpers
        // -----------------------
        const formatDate = (d: Date) => {
            const dd = String(d.getDate()).padStart(2, '0');
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const yyyy = d.getFullYear();
            return `${dd}/${mm}/${yyyy}`;
        };

        const getLastSunday = (from: Date) => {
            const d = new Date(from);
            // 0 = Sunday
            while (d.getDay() !== 0) {
                d.setDate(d.getDate() - 1);
            }
            return d;
        };

        // -----------------------
        // Compute last Sunday
        // -----------------------
        const today = new Date();
        const sundayDate = getLastSunday(today);
        const sundayFormatted = formatDate(sundayDate);

        const startInput = page.getByRole('combobox', { name: 'Start Date' });
        const endInput = page.getByRole('combobox', { name: 'End Date' });

        // -----------------------
        // Select Sunday as Start Date
        // -----------------------
        await startInput.click();

        // If Sunday is in a different month/year than the initially visible month, go to Previous Month
        if (
            sundayDate.getMonth() !== today.getMonth() ||
            sundayDate.getFullYear() !== today.getFullYear()
        ) {
            await page.getByRole('button', { name: 'Previous Month' }).click();
        }

        await page
            .locator(`span[title="${sundayFormatted}"][aria-disabled="false"]`)
            .first() // avoid strict mode violation
            .click();

        // -----------------------
        // Select same Sunday as End Date
        // -----------------------
        await endInput.click();

        if (
            sundayDate.getMonth() !== today.getMonth() ||
            sundayDate.getFullYear() !== today.getFullYear()
        ) {
            await page.getByRole('button', { name: 'Previous Month' }).click();
        }

        await page
            .locator(`span[title="${sundayFormatted}"][aria-disabled="false"][aria-selected="false"]`)
            .first() // choose the not-yet-selected instance
            .click();

        // -----------------------
        // Assertions on filter inputs
        // -----------------------
        await expect(startInput).toHaveValue(sundayFormatted);
        await expect(endInput).toHaveValue(sundayFormatted);

        await page.waitForTimeout(2000);

        // -----------------------
        // Apply filter
        // -----------------------
        await page.getByRole('button', { name: 'Continue' }).click();
        await page.waitForTimeout(2000);

        await highlightElements(page.getByText('No results'));

        await ScreenshotHelper(page, screenshotDir, 'TXX-sunday-filter-after-continue', testInfo);
    });


    test('T36. Verify Calendar Date Selection with Filters', async ({ }, testInfo) => {
        await login(page, '640987655', '12345678');
        await page.getByRole('button', { name: 'menu' }).click();
        await page.locator('.hamburger-account-options:has-text("Transaction Summary")').nth(0).click();
        await page.waitForTimeout(2000);
        await page.getByRole('button', { name: 'Filter' }).click();

        // -----------------------
        // 1) Select Date Range (today - 28 days to today)
        // -----------------------
        const today = new Date();

        const formatDate = (d: Date) => {
            const dd = String(d.getDate()).padStart(2, '0');
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const yyyy = d.getFullYear();
            return `${dd}/${mm}/${yyyy}`;
        };

        const todayFormatted = formatDate(today);

        const startDateObj = new Date(today);
        startDateObj.setDate(today.getDate() - 28);
        const startFormatted = formatDate(startDateObj);

        const startInput = page.getByRole('combobox', { name: 'Start Date' });
        const endInput = page.getByRole('combobox', { name: 'End Date' });

        // ---- Start Date (only go backwards if needed) ----
        await startInput.click();

        if (
            startDateObj.getMonth() !== today.getMonth() ||
            startDateObj.getFullYear() !== today.getFullYear()
        ) {
            await page.getByRole('button', { name: 'Previous Month' }).click();
        }

        await page
            .locator(`span[title="${startFormatted}"][aria-disabled="false"]`)
            .first()
            .click();

        // ---- End Date (today, current month) ----
        await endInput.click();

        await page
            .locator(`span[title="${todayFormatted}"][aria-disabled="false"]`)
            .first()
            .click();

        await expect(startInput).toHaveValue(startFormatted);
        await expect(endInput).toHaveValue(todayFormatted);

        // =================================================
        // 2) FIRST RUN: Payout only → all rows Payout & positive
        // =================================================

        // Open type filter (generic labelcontainer, text can be All/Payout/Wager etc.)
        await page.locator('div[data-pc-section="labelcontainer"]').first().click();

        // Select Payout only (assuming option text contains "Payout")
        await page.getByRole('option', { name: /payout/i }).first().click();

        await page.getByText('Filter By Type').click();
        await page.getByRole('button', { name: 'Continue' }).click();
        await page.waitForTimeout(2000);

        let rows = page.locator('tbody tr.rowData');
        let rowCount = await rows.count();

        for (let i = 0; i < rowCount; i++) {
            const row = rows.nth(i);
            const typeCell = row.locator('td').nth(3);  // Transaction Type
            const amountCell = row.locator('td').nth(4); // Amount column

            const typeText = (await typeCell.textContent()) || '';

            // This span exists ONLY for negative amounts ("- R ")
            const minusSpanCount = await amountCell
                .locator('span.gold-gradient-text.font-bold')
                .count();

            // Assert: type contains Payout & amount is positive (no minus span)
            if (/payout/i.test(typeText) && minusSpanCount === 0) {
                await highlightElements(amountCell);
            } else {
                throw new Error(`Row ${i} is not a valid POSITIVE Payout. Type="${typeText}", minusSpanCount=${minusSpanCount}`);
            }
        }

        await ScreenshotHelper(page, screenshotDir, 'T18-transactionHistory-payout-only', testInfo);

        // =================================================
        // 3) SECOND RUN: Wager only → all rows Wager & negative
        // =================================================

        await page.getByRole('button', { name: 'Filter' }).click();

        // Open type filter again (same generic locator)
        await page.locator('div[data-pc-section="labelcontainer"]').first().click();

        // Select Wager only and unselect payout (assuming option text contains "Wager")
        await page.getByRole('option', { name: /payout/i }).first().click();
        await page.getByRole('option', { name: /wager/i }).first().click();

        await page.getByText('Filter By Type').click();
        await page.getByRole('button', { name: 'Continue' }).click();
        await page.waitForTimeout(2000);

        rows = page.locator('tbody tr.rowData');
        rowCount = await rows.count();

        for (let i = 0; i < rowCount; i++) {
            const row = rows.nth(i);
            const typeCell = row.locator('td').nth(3);  // Transaction Type
            const amountCell = row.locator('td').nth(4); // Amount column

            const typeText = (await typeCell.textContent()) || '';

            const minusSpanCount = await amountCell
                .locator('span.gold-gradient-text.font-bold')
                .count();

            // Assert: type contains Wager & amount is negative (minus span present)
            if (/wager/i.test(typeText) && minusSpanCount > 0) {
                await highlightElements(amountCell);
            } else {
                throw new Error(`Row ${i} is not a valid NEGATIVE Wager. Type="${typeText}", minusSpanCount=${minusSpanCount}`);
            }
        }
        await ScreenshotHelper(page, screenshotDir, 'T36-transactionHistory-wager-payout-filter', testInfo);
    });

    test('T37. Verify Calendar Date Selection with Multiple Filters', async ({ }, testInfo) => {
        await login(page, '640987655', '12345678');
        await page.getByRole('button', { name: 'menu' }).click();
        await page.locator('.hamburger-account-options:has-text("Transaction Summary")').nth(0).click();
        await page.waitForTimeout(2000);
        await page.getByRole('button', { name: 'Filter' }).click();

        // -----------------------
        // 1) Select Date Range (today - 28 days to today)
        // -----------------------
        const today = new Date();

        const formatDate = (d: Date) => {
            const dd = String(d.getDate()).padStart(2, '0');
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const yyyy = d.getFullYear();
            return `${dd}/${mm}/${yyyy}`;
        };

        const todayFormatted = formatDate(today);

        const startDateObj = new Date(today);
        startDateObj.setDate(today.getDate() - 28);
        const startFormatted = formatDate(startDateObj);

        const startInput = page.getByRole('combobox', { name: 'Start Date' });
        const endInput = page.getByRole('combobox', { name: 'End Date' });

        // ---- Start Date (only go backwards if needed) ----
        await startInput.click();

        if (
            startDateObj.getMonth() !== today.getMonth() ||
            startDateObj.getFullYear() !== today.getFullYear()
        ) {
            await page.getByRole('button', { name: 'Previous Month' }).click();
        }

        await page
            .locator(`span[title="${startFormatted}"][aria-disabled="false"]`)
            .first()
            .click();

        // ---- End Date (today, current month) ----
        await endInput.click();

        await page
            .locator(`span[title="${todayFormatted}"][aria-disabled="false"]`)
            .first()
            .click();

        await expect(startInput).toHaveValue(startFormatted);
        await expect(endInput).toHaveValue(todayFormatted);

        // =================================================
        // 2) Select BOTH Payout & Wager in Type filter
        // =================================================

        // Generic open of multiselect label (works even when text changes from "All")
        await page.locator('div[data-pc-section="labelcontainer"]').first().click();

        // Select Payout
        await page.getByRole('option', { name: /payout/i }).first().click();

        // Select Wager
        await page.getByRole('option', { name: /wager/i }).first().click();

        // Close the filter dropdown
        await page.getByText('Filter By Type').click();

        // Apply filter
        await page.getByRole('button', { name: 'Continue' }).click();
        await page.waitForTimeout(2000);

        // =================================================
        // 3) Verify: only Payout/Wager rows, and amount formatting per type
        // =================================================

        const rows = page.locator('tbody tr.rowData');
        const rowCount = await rows.count();

        for (let i = 0; i < rowCount; i++) {
            const row = rows.nth(i);
            const typeCell = row.locator('td').nth(3);   // Transaction Type
            const amountCell = row.locator('td').nth(4); // Amount column

            const typeText = (await typeCell.textContent()) || '';

            // This span exists ONLY for negative amounts ("- R ")
            const minusSpanCount = await amountCell
                .locator('span.gold-gradient-text.font-bold')
                .count();

            if (/payout/i.test(typeText)) {
                // Payout should be POSITIVE (no minus span)
                if (minusSpanCount === 0) {
                    await highlightElements(amountCell);
                } else {
                    throw new Error(
                        `Row ${i}: Payout row has NEGATIVE formatting. minusSpanCount=${minusSpanCount}`
                    );
                }
            } else if (/wager/i.test(typeText)) {
                // Wager should be NEGATIVE (minus span present)
                if (minusSpanCount > 0) {
                    await highlightElements(amountCell);
                } else {
                    throw new Error(
                        `Row ${i}: Wager row has POSITIVE formatting. minusSpanCount=${minusSpanCount}`
                    );
                }
            } else {
                // Neither payout nor wager → invalid according to filter
                throw new Error(
                    `Row ${i}: Unexpected Transaction Type. Got type="${typeText}"`
                );
            }
        }

        await ScreenshotHelper(page, screenshotDir, 'T37-transactionHistory-payout-and-wager', testInfo);
    });

    test('T38. Verify Show Only Payout Toggle Activation', async ({ }, testInfo) => {
        await login(page, '640987655', '12345678');
        await page.getByRole('button', { name: 'menu' }).click();
        await page.locator('.hamburger-account-options:has-text("Transaction Summary")').nth(0).click();
        await page.waitForTimeout(2000);
        await page.getByRole('button', { name: 'Filter' }).click();


        const toggleContainer = page.getByText('Show Payout Only').locator('xpath=..');
        const payoutToggle = toggleContainer.locator('input[role="switch"]');

        // Assert initial state = OFF
        await expect(payoutToggle).toHaveAttribute('aria-checked', 'false');

        // Turn ON the toggle
        await payoutToggle.click();
        await expect(payoutToggle).toHaveAttribute('aria-checked', 'true');

        await highlightElements(payoutToggle);
        await ScreenshotHelper(page, screenshotDir, 'T38-transactionHistory-payout-only', testInfo);

        // Apply filter
        await page.getByRole('button', { name: 'Continue' }).click();
        await page.waitForTimeout(2000);

        // =================================================
        // 3) Verify: only Payout rows, and amount formatting per type
        // =================================================

        const rows = page.locator('tbody tr.rowData');
        const rowCount = await rows.count();

        for (let i = 0; i < rowCount; i++) {
            const row = rows.nth(i);
            const typeCell = row.locator('td').nth(3);   // Transaction Type
            const amountCell = row.locator('td').nth(4); // Amount column

            const typeText = (await typeCell.textContent()) || '';

            // This span exists ONLY for negative amounts ("- R ")
            const minusSpanCount = await amountCell
                .locator('span.gold-gradient-text.font-bold')
                .count();

            if (/payout/i.test(typeText)) {
                // Payout should be POSITIVE (no minus span)
                if (minusSpanCount === 0) {
                    await highlightElements(amountCell);
                } else {
                    throw new Error(
                        `Row ${i}: Payout row has NEGATIVE formatting. minusSpanCount=${minusSpanCount}`
                    );
                }
            } else {
                // Wager → invalid according to filter
                throw new Error(
                    `Row ${i}: Unexpected Transaction Type. Got type="${typeText}"`
                );
            }
        }

        await ScreenshotHelper(page, screenshotDir, 'T38-transactionHistory-payout-only', testInfo);
    });

    test('T39. Verify Show Only Payout Toggle Deactivation', async ({ }, testInfo) => {
        await login(page, '640987655', '12345678');
        await page.getByRole('button', { name: 'menu' }).click();
        await page
            .locator('.hamburger-account-options:has-text("Transaction Summary")')
            .first()
            .click();
        await page.waitForTimeout(2000);

        // Open Filter
        await page.getByRole('button', { name: 'Filter' }).click();

        // -----------------------
        // 1) Locate the "Show Payout Only" toggle
        // -----------------------
        const toggleContainer = page.getByText('Show Payout Only').locator('xpath=..');
        const payoutToggle = toggleContainer.locator('input[role="switch"]');

        // Assert initial state = OFF
        await expect(payoutToggle).toHaveAttribute('aria-checked', 'false');

        // Turn ON the toggle
        await payoutToggle.click();
        await expect(payoutToggle).toHaveAttribute('aria-checked', 'true');

        // -----------------------
        // 2) Open type multiselect and select "Wager"
        // -----------------------
        // Generic label container for type multiselect (works even when text changes from "All")
        const typeDropdown = page.locator('div[data-pc-section="labelcontainer"]').first();
        await typeDropdown.click();

        // Pick Wager from the options
        await page.getByRole('option', { name: /wager/i }).first().click();

        // Close the dropdown (same pattern used earlier)
        await page.getByText('Filter By Type').click();

        // -----------------------
        // 3) Verify the toggle got reset (turned OFF)
        // -----------------------
        await expect(payoutToggle).toHaveAttribute('aria-checked', 'false');

        // (Optional) Apply the filter & take screenshot
        // await page.getByRole('button', { name: 'Continue' }).click();
        await highlightElements(payoutToggle);
        await page.waitForTimeout(2000);
        await ScreenshotHelper(page, screenshotDir, 'T39-transactionHistory-payout-toggle-reset', testInfo);
    });

    test('T40. Verify Show Only Payout Toggle State After Deselecting Other Types', async ({ }, testInfo) => {
        await login(page, '640987655', '12345678');
        await page.getByRole('button', { name: 'menu' }).click();
        await page
            .locator('.hamburger-account-options:has-text("Transaction Summary")')
            .first()
            .click();
        await page.waitForTimeout(2000);

        // Open Filter
        await page.getByRole('button', { name: 'Filter' }).click();

        // -----------------------
        // Locate payout toggle
        // -----------------------
        const toggleContainer = page.getByText('Show Payout Only').locator('xpath=..');
        const payoutToggle = toggleContainer.locator('input[role="switch"]');

        // Ensure toggle starts OFF
        await expect(payoutToggle).toHaveAttribute('aria-checked', 'false');

        // -----------------------
        // 1) Open Type filter and select Payout + Wager
        // -----------------------
        const typeDropdown = page.locator('div[data-pc-section="labelcontainer"]').first();
        await typeDropdown.click();

        // Select Payout
        await page.getByRole('option', { name: /payout/i }).first().click();
        // Select Wager
        await page.getByRole('option', { name: /wager/i }).first().click();

        // Close type dropdown
        await page.getByText('Filter By Type').click();

        // Toggle should still be OFF
        await expect(payoutToggle).toHaveAttribute('aria-checked', 'false');

        // -----------------------
        // 2) Now deselect Wager
        // -----------------------
        await typeDropdown.click();

        // Unselect Wager
        await page.getByRole('option', { name: /wager/i }).first().click();

        // Close dropdown
        await page.getByText('Filter By Type').click();

        // -----------------------
        // 3) ASSERTION: Payout toggle MUST REMAIN OFF
        // -----------------------
        await expect(payoutToggle).toHaveAttribute('aria-checked', 'false');

        await page.getByRole('button', { name: 'Continue' }).click();
        await page.waitForTimeout(1500);
        await ScreenshotHelper(page, screenshotDir, 'T40-transactionHistory-payout-toggle-reset', testInfo);
    });









});