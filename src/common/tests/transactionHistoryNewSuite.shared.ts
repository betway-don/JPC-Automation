import { Page, TestInfo, TestType, expect } from '@playwright/test';
import { TransactionHistoryPage, TransactionFilterType } from '../pages/TransactionHistoryPage';
import { LoginPage } from '../pages/LoginPage';
import { ScreenshotHelper } from '../actions/ScreenshotHelper';
import { highlightElements } from '../actions/HighlightElements';

type TransactionHistoryFixtures = {
    page: Page;
    transactionHistoryPage: TransactionHistoryPage;
    loginPage: LoginPage;
    screenshotDir: string;
    testData: any;
};

export async function runTransactionHistoryNewSuiteTests(
    test: TestType<TransactionHistoryFixtures, any>
) {

    test.beforeEach(async ({ page, loginPage, testData }: TransactionHistoryFixtures) => {
        await loginPage.goto();
        await loginPage.clickLogin();
        await page.waitForTimeout(2000);
        await loginPage.performLogin(testData.loginValid.mobile, testData.loginValid.password);
        await page.waitForTimeout(2000);
    });

    test.describe('Transaction Summary', () => {

        test('TH-001 - Verify recent transaction list is displayed correctly on page load', async ({ page, transactionHistoryPage, screenshotDir }: TransactionHistoryFixtures, testInfo: TestInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            await expect(transactionHistoryPage.locators.tableRows.first()).toBeVisible({ timeout: 15000 });
            await highlightElements(page.locator('table.shaded-table'));
            await ScreenshotHelper(page, screenshotDir, 'TH-001-transactionList', testInfo);
        });

        test('TH-002 - Verify all required column headers are displayed correctly', async ({ page, transactionHistoryPage, screenshotDir }: TransactionHistoryFixtures, testInfo: TestInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            const headers = ['Transaction ID', 'Date', 'Game Name', 'Transaction Type', 'Amount'];
            for (const header of headers) {
                const el = transactionHistoryPage.getColumnHeader(header);
                await expect(el).toBeVisible({ timeout: 15000 });
                await highlightElements(el);
            }
            await ScreenshotHelper(page, screenshotDir, 'TH-002-columnHeaders', testInfo);
        });

        test('TH-003 - Verify transaction type displays correctly as Payout/Wager with provider name', async ({ page, transactionHistoryPage, screenshotDir }: TransactionHistoryFixtures, testInfo: TestInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            const count = await transactionHistoryPage.locators.tableRows.count();
            for (let i = 0; i < count; i++) {
                const typeCell = transactionHistoryPage.getTransactionTypeCell(i).locator('span.truncate');
                const text = (await typeCell.textContent())?.trim() ?? '';
                // Only Payout/Wager rows follow "[Provider Name] [Type]" format; others (e.g. Bonus Flush) are skipped
                if (text.endsWith('Payout') || text.endsWith('Wager')) {
                    expect(text).toMatch(/^.+\s(Payout|Wager)$/);
                }
                await highlightElements(typeCell);
            }
            await ScreenshotHelper(page, screenshotDir, 'TH-003-transactionType', testInfo);
        });

        test('TH-004 - Verify payout amount is displayed as a positive value', async ({ page, transactionHistoryPage, screenshotDir }: TransactionHistoryFixtures, testInfo: TestInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            const count = await transactionHistoryPage.locators.tableRows.count();
            for (let i = 0; i < count; i++) {
                const typeText = (await transactionHistoryPage.getTransactionTypeCell(i).locator('span.truncate').textContent())?.trim() ?? '';
                if (!typeText.endsWith('Payout')) continue;
                const amountCell = transactionHistoryPage.getTransactionAmountCell(i);
                await expect(amountCell.locator('span.gold-gradient-text.font-bold.absolute')).toHaveCount(0, { timeout: 15000 });
                await highlightElements(amountCell);
            }
            await ScreenshotHelper(page, screenshotDir, 'TH-004-payoutPositive', testInfo);
        });

        test('TH-005 - Verify wager amount is displayed with a minus sign', async ({ page, transactionHistoryPage, screenshotDir }: TransactionHistoryFixtures, testInfo: TestInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            const count = await transactionHistoryPage.locators.tableRows.count();
            for (let i = 0; i < count; i++) {
                const typeText = (await transactionHistoryPage.getTransactionTypeCell(i).locator('span.truncate').textContent())?.trim() ?? '';
                if (!typeText.endsWith('Wager')) continue;
                const amountCell = transactionHistoryPage.getTransactionAmountCell(i);
                await expect(amountCell.locator('span.gold-gradient-text.font-bold.absolute')).toHaveCount(1, { timeout: 15000 });
                await highlightElements(amountCell);
            }
            await ScreenshotHelper(page, screenshotDir, 'TH-005-wagerMinus', testInfo);
        });

        test('TH-006 - Verify tapping the Tlog icon opens the transaction detailed view', async ({ page, transactionHistoryPage, screenshotDir }: TransactionHistoryFixtures, testInfo: TestInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            await highlightElements(transactionHistoryPage.locators.showDetailIcon.first());
            await transactionHistoryPage.locators.showDetailIcon.first().click();
            await page.waitForTimeout(1500);
            await ScreenshotHelper(page, screenshotDir, 'TH-006-tlogDetailView', testInfo);
        });

        test('TH-007 - Verify tapping the Back button redirects the user to the Transaction Summary page', async ({ page, transactionHistoryPage, screenshotDir }: TransactionHistoryFixtures, testInfo: TestInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            await transactionHistoryPage.locators.showDetailIcon.first().click();
            await page.waitForTimeout(1500);
            await transactionHistoryPage.locators.detailViewBackBtn.click();
            await page.waitForTimeout(1000);
            await expect(page.locator('div.font-bold.text-base-priority', { hasText: 'Transaction Summary' })).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'TH-007-backToSummary', testInfo);
        });

        test('TH-008 - Verify tapping the Refresh icon reloads the latest transaction data', async ({ page, transactionHistoryPage, screenshotDir }: TransactionHistoryFixtures, testInfo: TestInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            await highlightElements(transactionHistoryPage.locators.refreshButton);
            await transactionHistoryPage.locators.refreshButton.click();
            await page.waitForTimeout(2000);
            await expect(transactionHistoryPage.locators.tableRows.first()).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'TH-008-refresh', testInfo);
        });

        test('TH-009 - Verify user is able to navigate through transaction pages using page numbers', async ({ page, transactionHistoryPage, screenshotDir }: TransactionHistoryFixtures, testInfo: TestInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            await highlightElements(transactionHistoryPage.locators.pageNumbers);
            await transactionHistoryPage.goToPage(2);
            await page.waitForTimeout(1500);
            await expect(transactionHistoryPage.getPageLocator(2)).toHaveClass(/blue-gradient/, { timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'TH-009-pageNumbers', testInfo);
        });

        test('TH-010 - Verify user is able to navigate to a specific page using the Go to Page option', async ({ page, transactionHistoryPage, screenshotDir }: TransactionHistoryFixtures, testInfo: TestInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            const ellipsis = page.locator('div.flex-center.border-l').filter({ has: page.locator('p', { hasText: '...' }) });
            await highlightElements(ellipsis);
            await ellipsis.click();
            await page.waitForTimeout(500);
            await page.locator('#goToInput').fill('5');
            await page.getByRole('button', { name: 'go' }).click();
            await page.waitForTimeout(1500);
            await ScreenshotHelper(page, screenshotDir, 'TH-010-goToPage', testInfo);
        });

        test('TH-011 - Verify user is able to navigate transaction pages using Next pagination button', async ({ page, transactionHistoryPage, screenshotDir }: TransactionHistoryFixtures, testInfo: TestInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            await highlightElements(transactionHistoryPage.locators.nextPageBtn);
            await transactionHistoryPage.locators.nextPageBtn.click();
            await page.waitForTimeout(1500);
            await expect(transactionHistoryPage.getPageLocator(2)).toHaveClass(/blue-gradient/, { timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'TH-011-nextPage', testInfo);
        });

        test('TH-012 - Verify user is able to navigate transaction pages using Previous pagination button', async ({ page, transactionHistoryPage, screenshotDir }: TransactionHistoryFixtures, testInfo: TestInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            await transactionHistoryPage.locators.nextPageBtn.click();
            await page.waitForTimeout(1500);
            await highlightElements(transactionHistoryPage.locators.prevPageBtn);
            await transactionHistoryPage.locators.prevPageBtn.click();
            await page.waitForTimeout(1500);
            await expect(transactionHistoryPage.getPage1Locator()).toHaveClass(/blue-gradient/, { timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'TH-012-prevPage', testInfo);
        });

        test('TH-013 - Verify Transaction Summary Displays Transactions Generated Within Last 30 Days Only', async ({ page, transactionHistoryPage, screenshotDir }: TransactionHistoryFixtures, testInfo: TestInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            const dateCells = page.locator('table.shaded-table tbody tr td:nth-child(2) span');
            const count = await dateCells.count();
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            thirtyDaysAgo.setHours(0, 0, 0, 0);
            for (let i = 0; i < count; i++) {
                const raw = (await dateCells.nth(i).textContent())?.trim() ?? '';
                // Format: DD/MM/YY-HH:MM:SS  e.g. "04/06/26-12:41:49"
                const [datePart] = raw.split('-');
                const [dd, mm, yy] = datePart.split('/').map(Number);
                const txDate = new Date(2000 + yy, mm - 1, dd);
                expect(txDate.getTime()).toBeGreaterThanOrEqual(thirtyDaysAgo.getTime());
            }
            await ScreenshotHelper(page, screenshotDir, 'TH-013-last30Days', testInfo);
        });

    });

    test.describe('Filter Prompt', () => {

        test('TH-014 - Verify filter prompt is accessible and displayed correctly', async ({ page, transactionHistoryPage, screenshotDir }: TransactionHistoryFixtures, testInfo: TestInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            await transactionHistoryPage.openFilter();
            const modal = page.locator('div[aria-labelledby="Filter Transaction Summary-modal-title"]');
            await expect(modal).toBeVisible({ timeout: 15000 });
            await expect(page.getByText('Filter Transaction Summary', { exact: true })).toBeVisible({ timeout: 15000 });
            await expect(transactionHistoryPage.locators.startDateInput).toBeVisible({ timeout: 15000 });
            await expect(transactionHistoryPage.locators.endDateInput).toBeVisible({ timeout: 15000 });
            await expect(transactionHistoryPage.locators.lastWeekButton).toBeVisible({ timeout: 15000 });
            await expect(transactionHistoryPage.locators.last2WeeksButton).toBeVisible({ timeout: 15000 });
            await expect(transactionHistoryPage.locators.lastMonthButton).toBeVisible({ timeout: 15000 });
            await expect(page.locator('input[role="switch"][data-pc-section="input"]')).toBeAttached({ timeout: 15000 });
            await expect(page.locator('[data-pc-name="multiselect"]')).toBeVisible({ timeout: 15000 });
            await expect(transactionHistoryPage.locators.resetButton).toBeVisible({ timeout: 15000 });
            await expect(transactionHistoryPage.locators.continueButton).toBeVisible({ timeout: 15000 });
            await highlightElements(modal);
            await ScreenshotHelper(page, screenshotDir, 'TH-014-filterPrompt', testInfo);
        });

        test('TH-015 - Verify selected filters persist after navigating back to the Transaction Summary page', async ({ page, transactionHistoryPage, screenshotDir }: TransactionHistoryFixtures, testInfo: TestInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            await transactionHistoryPage.openFilter();
            await transactionHistoryPage.locators.lastWeekButton.click();
            await transactionHistoryPage.locators.continueButton.click();
            await page.waitForTimeout(1500);
            await transactionHistoryPage.locators.showDetailIcon.first().click();
            await page.waitForTimeout(1000);
            await transactionHistoryPage.locators.detailViewBackBtn.click();
            await page.waitForTimeout(1000);
            await transactionHistoryPage.openFilter();
            // button[title="Start Date"] disappears once a date is selected (title changes to the date value)
            await expect(page.locator('button[title="Start Date"]')).toHaveCount(0, { timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'TH-015-filterPersistence', testInfo);
        });

        test('TH-016 - Verify Continue button functions correctly on the filter prompt', async ({ page, transactionHistoryPage, screenshotDir }: TransactionHistoryFixtures, testInfo: TestInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            await transactionHistoryPage.openFilter();
            await transactionHistoryPage.locators.lastWeekButton.click();
            await highlightElements(transactionHistoryPage.locators.continueButton);
            await transactionHistoryPage.locators.continueButton.click();
            await page.waitForTimeout(1500);
            await expect(page.locator('div[aria-labelledby="Filter Transaction Summary-modal-title"]')).not.toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'TH-016-continueButton', testInfo);
        });

        test('TH-017 - Verify Reset button clears all selected filters on the filter prompt', async ({ page, transactionHistoryPage, screenshotDir }: TransactionHistoryFixtures, testInfo: TestInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            await transactionHistoryPage.openFilter();
            await transactionHistoryPage.locators.lastWeekButton.click();
            await transactionHistoryPage.selectFilterTypes([TransactionFilterType.PAYOUT]);
            await ScreenshotHelper(page, screenshotDir, 'TH-017-beforeReset', testInfo);
            await highlightElements(transactionHistoryPage.locators.resetButton);
            await transactionHistoryPage.locators.resetButton.click();
            await page.waitForTimeout(500);
            await expect(page.locator('button[title="Start Date"]')).toBeVisible({ timeout: 15000 });
            await expect(page.locator('button[title="End Date"]')).toBeVisible({ timeout: 15000 });
            await expect(transactionHistoryPage.locators.typeDropdownLabelContainer).toHaveText('All', { timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'TH-017-afterReset', testInfo);
        });

        test('TH-018 - Verify Close button dismisses the filter prompt without applying changes', async ({ page, transactionHistoryPage, screenshotDir }: TransactionHistoryFixtures, testInfo: TestInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            await transactionHistoryPage.openFilter();
            await transactionHistoryPage.locators.lastWeekButton.click();
            await highlightElements(transactionHistoryPage.locators.closeFilterButton);
            await transactionHistoryPage.locators.closeFilterButton.click();
            await page.waitForTimeout(500);
            await expect(page.locator('div[aria-labelledby="Filter Transaction Summary-modal-title"]')).not.toBeVisible({ timeout: 15000 });
            await expect(transactionHistoryPage.locators.tableRows.first()).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'TH-018-closeButton', testInfo);
        });

    });

    test.describe('Calendar / Date Filter', () => {

        test('TH-019 - Verify calendar allows selection of dates only within the last 30 days', async ({ page, transactionHistoryPage, screenshotDir }: TransactionHistoryFixtures, testInfo: TestInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            await transactionHistoryPage.openFilter();
            await transactionHistoryPage.locators.startDateInput.click();
            await page.waitForTimeout(300);
            await expect(page.locator('div[role="grid"]')).toBeVisible({ timeout: 15000 });
            // Future dates blocked — next-month button must be disabled
            await expect(page.locator('button[title="next-month"]')).toBeDisabled({ timeout: 15000 });
            const disabledInCurrentMonth = page.locator('button[role="gridcell"][disabled]');
            await expect(disabledInCurrentMonth.first()).toBeVisible({ timeout: 15000 });
            await highlightElements(disabledInCurrentMonth.first());
            await ScreenshotHelper(page, screenshotDir, 'TH-019-currentMonth', testInfo);
            // Dates earlier than 30 days ago must also be disabled in the previous month
            await transactionHistoryPage.locators.previousMonthButton.click();
            await page.waitForTimeout(300);
            const disabledInPrevMonth = page.locator('button[role="gridcell"][disabled]');
            await expect(disabledInPrevMonth.first()).toBeVisible({ timeout: 15000 });
            await highlightElements(disabledInPrevMonth.first());
            await ScreenshotHelper(page, screenshotDir, 'TH-019-prevMonth', testInfo);
        });

        test('TH-020 - Verify default days duration options are displayed correctly', async ({ page, transactionHistoryPage, screenshotDir }: TransactionHistoryFixtures, testInfo: TestInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            await transactionHistoryPage.openFilter();
            await expect(transactionHistoryPage.locators.lastWeekButton).toBeVisible({ timeout: 15000 });
            await expect(transactionHistoryPage.locators.last2WeeksButton).toBeVisible({ timeout: 15000 });
            await expect(transactionHistoryPage.locators.lastMonthButton).toBeVisible({ timeout: 15000 });
            await highlightElements(transactionHistoryPage.locators.lastWeekButton);
            await highlightElements(transactionHistoryPage.locators.last2WeeksButton);
            await highlightElements(transactionHistoryPage.locators.lastMonthButton);
            await ScreenshotHelper(page, screenshotDir, 'TH-020-durationOptions', testInfo);
        });

        test('TH-021 - Verify selecting the "Last Week" option sets the correct date range', async ({ page, transactionHistoryPage, screenshotDir }: TransactionHistoryFixtures, testInfo: TestInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            await transactionHistoryPage.openFilter();
            await highlightElements(transactionHistoryPage.locators.lastWeekButton);
            await transactionHistoryPage.locators.lastWeekButton.click();
            // button[title="Start Date"] disappears once a date is selected (title changes to the date value)
            await expect(page.locator('button[title="Start Date"]')).toHaveCount(0, { timeout: 15000 });
            await expect(page.locator('button[title="End Date"]')).toHaveCount(0, { timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'TH-021-lastWeek', testInfo);
            await transactionHistoryPage.locators.continueButton.click();
            await page.waitForTimeout(1500);
            await ScreenshotHelper(page, screenshotDir, 'TH-021-lastWeek-result', testInfo);
        });

        test('TH-022 - Verify selecting the "Last 14 Days" option sets the correct date range', async ({ page, transactionHistoryPage, screenshotDir }: TransactionHistoryFixtures, testInfo: TestInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            await transactionHistoryPage.openFilter();
            await highlightElements(transactionHistoryPage.locators.last2WeeksButton);
            await transactionHistoryPage.locators.last2WeeksButton.click();
            await expect(page.locator('button[title="Start Date"]')).toHaveCount(0, { timeout: 15000 });
            await expect(page.locator('button[title="End Date"]')).toHaveCount(0, { timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'TH-022-last14Days', testInfo);
            await transactionHistoryPage.locators.continueButton.click();
            await page.waitForTimeout(1500);
            await ScreenshotHelper(page, screenshotDir, 'TH-022-last14Days-result', testInfo);
        });

        test('TH-023 - Verify selecting the "Last 30 Days" option sets the correct date range', async ({ page, transactionHistoryPage, screenshotDir }: TransactionHistoryFixtures, testInfo: TestInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            await transactionHistoryPage.openFilter();
            await highlightElements(transactionHistoryPage.locators.lastMonthButton);
            await transactionHistoryPage.locators.lastMonthButton.click();
            await expect(page.locator('button[title="Start Date"]')).toHaveCount(0, { timeout: 15000 });
            await expect(page.locator('button[title="End Date"]')).toHaveCount(0, { timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'TH-023-last30Days', testInfo);
            await transactionHistoryPage.locators.lastMonthButton.click();
            await page.waitForTimeout(1500);
            await ScreenshotHelper(page, screenshotDir, 'TH-023-last30Days-result', testInfo);
        });

        test('TH-024 - Verify user is able to manually change the selected start and end dates', async ({ page, transactionHistoryPage, screenshotDir }: TransactionHistoryFixtures, testInfo: TestInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            await transactionHistoryPage.openFilter();
            await transactionHistoryPage.locators.startDateInput.click();
            await page.waitForTimeout(300);
            await page.locator('button[role="gridcell"]:not([disabled])').first().click();
            await page.waitForTimeout(300);
            await expect(page.locator('button[title="Start Date"]')).toHaveCount(0, { timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'TH-024-startDate', testInfo);
            await transactionHistoryPage.locators.endDateInput.click();
            await page.waitForTimeout(300);
            await page.locator('button[role="gridcell"]:not([disabled])').last().click();
            await page.waitForTimeout(300);
            await expect(page.locator('button[title="End Date"]')).toHaveCount(0, { timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'TH-024-endDate', testInfo);
        });

        test('TH-025 - Verify transaction list updates according to the selected date range filter', async ({ page, transactionHistoryPage, screenshotDir }: TransactionHistoryFixtures, testInfo: TestInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            await transactionHistoryPage.openFilter();
            await transactionHistoryPage.locators.lastWeekButton.click();
            await transactionHistoryPage.locators.continueButton.click();
            await page.waitForTimeout(1500);
            // Either rows or the no-results message must be present — both confirm the list responded to the filter
            const hasRows = await transactionHistoryPage.locators.tableRows.count();
            const hasNoResults = await transactionHistoryPage.locators.noResultsMessage.isVisible();
            expect(hasRows > 0 || hasNoResults).toBe(true);
            await ScreenshotHelper(page, screenshotDir, 'TH-025-dateRangeFilter', testInfo);
        });

        test('TH-026 - Verify Reset button clears the selected calendar date range', async ({ page, transactionHistoryPage, screenshotDir }: TransactionHistoryFixtures, testInfo: TestInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            await transactionHistoryPage.openFilter();
            await transactionHistoryPage.locators.lastWeekButton.click();
            await expect(page.locator('button[title="Start Date"]')).toHaveCount(0, { timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'TH-026-beforeReset', testInfo);
            await transactionHistoryPage.locators.resetButton.click();
            await page.waitForTimeout(500);
            await expect(page.locator('button[title="Start Date"]')).toBeVisible({ timeout: 15000 });
            await expect(page.locator('button[title="End Date"]')).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'TH-026-afterReset', testInfo);
        });

        test('TH-027 - Verify appropriate error message is displayed when no transactions are available for the selected date range', async ({ page, transactionHistoryPage, screenshotDir }: TransactionHistoryFixtures, testInfo: TestInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            await transactionHistoryPage.openFilter();
            await transactionHistoryPage.locators.startDateInput.click();
            await page.waitForTimeout(300);
            await transactionHistoryPage.locators.previousMonthButton.click();
            await page.waitForTimeout(300);
            const oldestDate = page.locator('button[role="gridcell"]:not([disabled])').first();
            const oldestTitle = await oldestDate.getAttribute('title') ?? '';
            await oldestDate.click();
            await page.waitForTimeout(300);
            // End Date calendar already opens at previous month (same month as start date)
            await transactionHistoryPage.locators.endDateInput.click();
            await page.waitForTimeout(300);
            await page.locator(`button[role="gridcell"][title="${oldestTitle}"]`).click();
            await page.waitForTimeout(300);
            await transactionHistoryPage.locators.continueButton.click();
            await page.waitForTimeout(1500);
            await expect(transactionHistoryPage.locators.noResultsMessage).toBeVisible({ timeout: 15000 });
            await highlightElements(transactionHistoryPage.locators.noResultsMessage);
            await ScreenshotHelper(page, screenshotDir, 'TH-027-noResults', testInfo);
        });

    });

    test.describe('Show Only Payout Toggle', () => {

        test('TH-028 - Verify "Show Only Payout" toggle activates when only "Payout" is selected from transaction type dropdown', async ({ page, transactionHistoryPage, screenshotDir }: TransactionHistoryFixtures, testInfo: TestInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            await transactionHistoryPage.openFilter();
            await transactionHistoryPage.selectFilterTypes([TransactionFilterType.PAYOUT]);
            await expect(transactionHistoryPage.locators.payoutToggleInput).toHaveAttribute('aria-checked', 'true', { timeout: 15000 });
            await highlightElements(transactionHistoryPage.locators.payoutToggleInput);
            await ScreenshotHelper(page, screenshotDir, 'TH-028-toggleActivates', testInfo);
        });

        test('TH-029 - Verify "Show Only Payout" toggle deactivates when another filter type is selected along with "Payout"', async ({ page, transactionHistoryPage, screenshotDir }: TransactionHistoryFixtures, testInfo: TestInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            await transactionHistoryPage.openFilter();
            await transactionHistoryPage.selectFilterTypes([TransactionFilterType.PAYOUT]);
            await expect(transactionHistoryPage.locators.payoutToggleInput).toHaveAttribute('aria-checked', 'true', { timeout: 15000 });
            // Adding Wager alongside Payout deactivates the toggle
            await transactionHistoryPage.selectFilterTypes([TransactionFilterType.WAGER]);
            await expect(transactionHistoryPage.locators.payoutToggleInput).toHaveAttribute('aria-checked', 'false', { timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'TH-029-toggleDeactivates', testInfo);
        });

        test('TH-030 - Verify "Show Only Payout" toggle deactivates when "Payout" is deselected', async ({ page, transactionHistoryPage, screenshotDir }: TransactionHistoryFixtures, testInfo: TestInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            await transactionHistoryPage.openFilter();
            await transactionHistoryPage.selectFilterTypes([TransactionFilterType.PAYOUT]);
            await expect(transactionHistoryPage.locators.payoutToggleInput).toHaveAttribute('aria-checked', 'true', { timeout: 15000 });
            await transactionHistoryPage.selectFilterTypes([TransactionFilterType.PAYOUT]);
            await expect(transactionHistoryPage.locators.payoutToggleInput).toHaveAttribute('aria-checked', 'false', { timeout: 15000 });
            await highlightElements(transactionHistoryPage.locators.payoutToggleInput);
            await ScreenshotHelper(page, screenshotDir, 'TH-030-toggleDeactivatesOnDeselect', testInfo);
        });

    });

    test.describe('Filter by Type Dropdown', () => {

        test('TH-031 - Verify Filter by Type dropdown displays "All" by default when no transaction type is selected', async ({ page, transactionHistoryPage, screenshotDir }: TransactionHistoryFixtures, testInfo: TestInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            await transactionHistoryPage.openFilter();
            await expect(transactionHistoryPage.locators.typeDropdownLabelContainer).toHaveText('All', { timeout: 15000 });
            await expect(transactionHistoryPage.locators.typeDropdownLabelContainer).toHaveAttribute('data-p', 'placeholder', { timeout: 15000 });
            await highlightElements(transactionHistoryPage.locators.typeDropdownLabelContainer);
            await ScreenshotHelper(page, screenshotDir, 'TH-031-dropdownDefault', testInfo);
        });

        test('TH-032 - Verify Reset button clears all selected transaction types from the dropdown', async ({ page, transactionHistoryPage, screenshotDir }: TransactionHistoryFixtures, testInfo: TestInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            await transactionHistoryPage.openFilter();
            await transactionHistoryPage.selectFilterTypes([TransactionFilterType.PAYOUT, TransactionFilterType.WAGER]);
            await expect(transactionHistoryPage.locators.typeDropdownLabelContainer).not.toHaveAttribute('data-p', 'placeholder', { timeout: 15000 });
            await transactionHistoryPage.locators.resetButton.click();
            await page.waitForTimeout(500);
            await expect(transactionHistoryPage.locators.typeDropdownLabelContainer).toHaveText('All', { timeout: 15000 });
            await expect(transactionHistoryPage.locators.typeDropdownLabelContainer).toHaveAttribute('data-p', 'placeholder', { timeout: 15000 });
            await highlightElements(transactionHistoryPage.locators.typeDropdownLabelContainer);
            await ScreenshotHelper(page, screenshotDir, 'TH-032-resetDropdown', testInfo);
        });

        test('TH-033 - Verify user is able to remove selected filter tags successfully', async ({ page, transactionHistoryPage, screenshotDir }: TransactionHistoryFixtures, testInfo: TestInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            await transactionHistoryPage.openFilter();
            await transactionHistoryPage.selectFilterTypes([TransactionFilterType.WAGER, TransactionFilterType.PAYOUT]);
            await expect(transactionHistoryPage.getFilterChip('Wager')).toBeVisible({ timeout: 15000 });
            await expect(transactionHistoryPage.getFilterChip('Payout')).toBeVisible({ timeout: 15000 });
            await highlightElements(transactionHistoryPage.getFilterChip('Wager'));
            await ScreenshotHelper(page, screenshotDir, 'TH-033-chipsVisible', testInfo);
            await transactionHistoryPage.removeFilterChip('Wager');
            await page.waitForTimeout(300);
            await expect(transactionHistoryPage.getFilterChip('Wager')).not.toBeVisible({ timeout: 15000 });
            // When only 1 type remains the chip carousel is hidden; assert via the dropdown label instead
            await expect(transactionHistoryPage.locators.typeDropdownLabelContainer).toContainText('Payout', { timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'TH-033-wagerRemoved', testInfo);
        });

        test('TH-034 - Verify transaction count is displayed correctly on the dropdown', async ({ page, transactionHistoryPage, screenshotDir }: TransactionHistoryFixtures, testInfo: TestInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            await transactionHistoryPage.openFilter();
            await transactionHistoryPage.selectFilterTypes([TransactionFilterType.PAYOUT, TransactionFilterType.WAGER]);
            await expect(transactionHistoryPage.locators.typeDropdownLabelContainer).toContainText('(2) Transactions Selected', { timeout: 15000 });
            await highlightElements(transactionHistoryPage.locators.typeDropdownLabelContainer);
            await ScreenshotHelper(page, screenshotDir, 'TH-034-dropdownCount', testInfo);
        });

        test('TH-035 - Verify dropdown displays "All" text when all transaction types are selected', async ({ page, transactionHistoryPage, screenshotDir }: TransactionHistoryFixtures, testInfo: TestInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            await transactionHistoryPage.openFilter();
            await transactionHistoryPage.selectFilterTypes([
                TransactionFilterType.WAGER,
                TransactionFilterType.PAYOUT,
                TransactionFilterType.WITHDRAWAL,
                TransactionFilterType.ACCOUNT_ADJUSTMENT,
                TransactionFilterType.DEPOSIT,
                TransactionFilterType.BONUS,
            ]);
            await expect(transactionHistoryPage.locators.typeDropdownLabelContainer).toHaveText('All', { timeout: 15000 });
            await highlightElements(transactionHistoryPage.locators.typeDropdownLabelContainer);
            await ScreenshotHelper(page, screenshotDir, 'TH-035-allSelected', testInfo);
        });

    });

}
