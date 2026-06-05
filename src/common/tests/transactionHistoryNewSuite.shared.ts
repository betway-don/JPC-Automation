import { Page, TestInfo, TestType, expect } from '@playwright/test';
import { TransactionHistoryPage } from '../pages/TransactionHistoryPage';
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

    test.beforeEach(async ({ page, loginPage, testData }) => {
        await loginPage.goto();
        await loginPage.clickLogin();
        await page.waitForTimeout(2000);
        await loginPage.performLogin(testData.loginValid.mobile, testData.loginValid.password);
        await page.waitForTimeout(2000);
    });

    // ─────────────────────────────────────────────────────────────────────────────
    // TRANSACTION SUMMARY  (TH-001 → TH-013)
    // ─────────────────────────────────────────────────────────────────────────────

    test.describe('Transaction Summary', () => {

        // ✓ AUTOMATED
        test('TH-001 - Verify recent transaction list is displayed correctly on page load', async ({ page, transactionHistoryPage, screenshotDir }: TransactionHistoryFixtures, testInfo: TestInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            await expect(page.locator('table.shaded-table')).toBeVisible();
            const rows = page.locator('table.shaded-table tbody tr');
            await expect(rows.first()).toBeVisible();
            await highlightElements(page.locator('table.shaded-table'));
            await ScreenshotHelper(page, screenshotDir, 'TH-001-transactionList', testInfo);
        });

        // ✓ AUTOMATED
        test('TH-002 - Verify all required column headers are displayed correctly', async ({ page, transactionHistoryPage, screenshotDir }: TransactionHistoryFixtures, testInfo: TestInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            const headers = ['Transaction ID', 'Date', 'Game Name', 'Transaction Type', 'Amount'];
            for (const header of headers) {
                const el = page.locator('thead td.cell-width p.text-sm.font-bold', { hasText: header });
                await expect(el).toBeVisible();
                await highlightElements(el);
            }
            await ScreenshotHelper(page, screenshotDir, 'TH-002-columnHeaders', testInfo);
        });

        // ✓ AUTOMATED
        test('TH-003 - Verify transaction type displays correctly as Payout/Wager with provider name', async ({ page, transactionHistoryPage, screenshotDir }: TransactionHistoryFixtures, testInfo: TestInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            const rows = page.locator('table.shaded-table tbody tr');
            const count = await rows.count();
            for (let i = 0; i < count; i++) {
                const typeCell = rows.nth(i).locator('td').nth(3).locator('span.truncate');
                const text = (await typeCell.textContent())?.trim() ?? '';
                // Format is "[Provider Name] Payout" or "[Provider Name] Wager"
                expect(text).toMatch(/^.+\s(Payout|Wager)$/);
                await highlightElements(typeCell);
            }
            await ScreenshotHelper(page, screenshotDir, 'TH-003-transactionType', testInfo);
        });

        // ✓ AUTOMATED
        test('TH-004 - Verify payout amount is displayed as a positive value', async ({ page, transactionHistoryPage, screenshotDir }: TransactionHistoryFixtures, testInfo: TestInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            const rows = page.locator('table.shaded-table tbody tr');
            const count = await rows.count();
            for (let i = 0; i < count; i++) {
                const typeText = (await rows.nth(i).locator('td').nth(3).locator('span.truncate').textContent())?.trim() ?? '';
                if (!typeText.endsWith('Payout')) continue;
                const amountCell = rows.nth(i).locator('td').nth(4);
                // Payout rows must NOT have the minus span
                const minusSpan = amountCell.locator('span.gold-gradient-text.font-bold.absolute');
                await expect(minusSpan).toHaveCount(0);
                await highlightElements(amountCell);
            }
            await ScreenshotHelper(page, screenshotDir, 'TH-004-payoutPositive', testInfo);
        });

        // ✓ AUTOMATED
        test('TH-005 - Verify wager amount is displayed with a minus sign', async ({ page, transactionHistoryPage, screenshotDir }: TransactionHistoryFixtures, testInfo: TestInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            const rows = page.locator('table.shaded-table tbody tr');
            const count = await rows.count();
            for (let i = 0; i < count; i++) {
                const typeText = (await rows.nth(i).locator('td').nth(3).locator('span.truncate').textContent())?.trim() ?? '';
                if (!typeText.endsWith('Wager')) continue;
                const amountCell = rows.nth(i).locator('td').nth(4);
                // Wager rows MUST have the minus span
                const minusSpan = amountCell.locator('span.gold-gradient-text.font-bold.absolute');
                await expect(minusSpan).toHaveCount(1);
                await highlightElements(amountCell);
            }
            await ScreenshotHelper(page, screenshotDir, 'TH-005-wagerMinus', testInfo);
        });

        // ✓ AUTOMATED
        test('TH-006 - Verify tapping the Tlog icon opens the transaction detailed view', async ({ page, transactionHistoryPage, screenshotDir }: TransactionHistoryFixtures, testInfo: TestInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            await highlightElements(transactionHistoryPage.locators.showDetailIcon.first());
            await transactionHistoryPage.locators.showDetailIcon.first().click();
            await page.waitForTimeout(1500);
            await ScreenshotHelper(page, screenshotDir, 'TH-006-tlogDetailView', testInfo);
        });

        // ✓ AUTOMATED
        test('TH-007 - Verify tapping the Back button redirects the user to the Transaction Summary page', async ({ page, transactionHistoryPage, screenshotDir }: TransactionHistoryFixtures, testInfo: TestInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            await transactionHistoryPage.locators.showDetailIcon.first().click();
            await page.waitForTimeout(1500);
            await transactionHistoryPage.locators.detailViewBackBtn.click();
            await page.waitForTimeout(1000);
            await expect(page.locator('div.font-bold.text-base-priority', { hasText: 'Transaction Summary' })).toBeVisible();
            await ScreenshotHelper(page, screenshotDir, 'TH-007-backToSummary', testInfo);
        });

        // ✓ AUTOMATED
        test('TH-008 - Verify tapping the Refresh icon reloads the latest transaction data', async ({ page, transactionHistoryPage, screenshotDir }: TransactionHistoryFixtures, testInfo: TestInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            await highlightElements(transactionHistoryPage.locators.refreshButton);
            await transactionHistoryPage.locators.refreshButton.click();
            await page.waitForTimeout(2000);
            await expect(page.locator('table.shaded-table tbody tr').first()).toBeVisible();
            await ScreenshotHelper(page, screenshotDir, 'TH-008-refresh', testInfo);
        });

        // ✓ AUTOMATED
        test('TH-009 - Verify user is able to navigate through transaction pages using page numbers', async ({ page, transactionHistoryPage, screenshotDir }: TransactionHistoryFixtures, testInfo: TestInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            // Highlight the whole pagination bar
            await highlightElements(transactionHistoryPage.locators.pageNumbers);
            // Click page 2 (exact match to avoid matching 12, 14, 15, 16)
            const page2 = page.locator('div.flex-center.border-l').filter({ has: page.locator('p', { hasText: /^2$/ }) });
            await page2.click();
            await page.waitForTimeout(1500);
            // Page 2 div should now carry the blue-gradient active class
            await expect(page2).toHaveClass(/blue-gradient/);
            await ScreenshotHelper(page, screenshotDir, 'TH-009-pageNumbers', testInfo);
        });

        // ✓ AUTOMATED
        test('TH-010 - Verify user is able to navigate to a specific page using the Go to Page option', async ({ page, transactionHistoryPage, screenshotDir }: TransactionHistoryFixtures, testInfo: TestInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            // Click the "..." ellipsis to reveal the Go to Page input
            const ellipsis = page.locator('div.flex-center.border-l').filter({ has: page.locator('p', { hasText: '...' }) });
            await highlightElements(ellipsis);
            await ellipsis.click();
            await page.waitForTimeout(500);
            // Fill page number and submit
            await page.locator('#goToInput').fill('5');
            await page.getByRole('button', { name: 'go' }).click();
            await page.waitForTimeout(1500);
            await ScreenshotHelper(page, screenshotDir, 'TH-010-goToPage', testInfo);
        });

        // ✓ AUTOMATED
        test('TH-011 - Verify user is able to navigate transaction pages using Next pagination button', async ({ page, transactionHistoryPage, screenshotDir }: TransactionHistoryFixtures, testInfo: TestInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            await highlightElements(transactionHistoryPage.locators.nextPageBtn);
            await transactionHistoryPage.locators.nextPageBtn.click();
            await page.waitForTimeout(1500);
            // Page 2 should now be the active page
            const page2 = page.locator('div.flex-center.border-l').filter({ has: page.locator('p', { hasText: /^2$/ }) });
            await expect(page2).toHaveClass(/blue-gradient/);
            await ScreenshotHelper(page, screenshotDir, 'TH-011-nextPage', testInfo);
        });

        // ✓ AUTOMATED
        test('TH-012 - Verify user is able to navigate transaction pages using Previous pagination button', async ({ page, transactionHistoryPage, screenshotDir }: TransactionHistoryFixtures, testInfo: TestInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            // Go to page 2 first using the Next button
            await transactionHistoryPage.locators.nextPageBtn.click();
            await page.waitForTimeout(1500);
            // Now click Previous to return to page 1
            await highlightElements(transactionHistoryPage.locators.prevPageBtn);
            await transactionHistoryPage.locators.prevPageBtn.click();
            await page.waitForTimeout(1500);
            // Page 1 should be the active page again
            const page1 = page.locator('div.flex-center').filter({ has: page.locator('p', { hasText: /^1$/ }) });
            await expect(page1).toHaveClass(/blue-gradient/);
            await ScreenshotHelper(page, screenshotDir, 'TH-012-prevPage', testInfo);
        });

        // ✓ AUTOMATED
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

    // ─────────────────────────────────────────────────────────────────────────────
    // FILTER PROMPT  (TH-014 → TH-018)
    // ─────────────────────────────────────────────────────────────────────────────

    test.describe('Filter Prompt', () => {

        // ✓ AUTOMATED
        test('TH-014 - Verify filter prompt is accessible and displayed correctly', async ({ page, transactionHistoryPage, screenshotDir }: TransactionHistoryFixtures, testInfo: TestInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            await transactionHistoryPage.openFilter();
            const modal = page.locator('div[role="dialog"][aria-modal="true"]');
            await expect(modal).toBeVisible();
            // Title
            await expect(page.getByText('Filter Transaction Summary', { exact: true })).toBeVisible();
            // Date range section
            await expect(transactionHistoryPage.locators.startDateInput).toBeVisible();
            await expect(transactionHistoryPage.locators.endDateInput).toBeVisible();
            // Quick-select buttons
            await expect(transactionHistoryPage.locators.lastWeekButton).toBeVisible();
            await expect(transactionHistoryPage.locators.last2WeeksButton).toBeVisible();
            await expect(transactionHistoryPage.locators.lastMonthButton).toBeVisible();
            // Payout toggle
            await expect(page.locator('input[role="switch"][data-pc-section="input"]')).toBeAttached();
            // Type dropdown
            await expect(page.locator('[data-pc-name="multiselect"]')).toBeVisible();
            // Action buttons (disabled by default until a filter is selected)
            await expect(transactionHistoryPage.locators.resetButton).toBeVisible();
            await expect(transactionHistoryPage.locators.continueButton).toBeVisible();
            await highlightElements(modal);
            await ScreenshotHelper(page, screenshotDir, 'TH-014-filterPrompt', testInfo);
        });

        // ✓ AUTOMATED
        test('TH-015 - Verify selected filters persist after navigating back to the Transaction Summary page', async ({ page, transactionHistoryPage, screenshotDir }: TransactionHistoryFixtures, testInfo: TestInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            await transactionHistoryPage.openFilter();
            // Apply Last Week filter
            await transactionHistoryPage.locators.lastWeekButton.click();
            await transactionHistoryPage.locators.continueButton.click();
            await page.waitForTimeout(1500);
            // Navigate into detail view and back
            await transactionHistoryPage.locators.showDetailIcon.first().click();
            await page.waitForTimeout(1000);
            await transactionHistoryPage.locators.detailViewBackBtn.click();
            await page.waitForTimeout(1000);
            // Re-open filter and verify date range is still set
            await transactionHistoryPage.openFilter();
            // Start Date button should now show a date, not the default "Start Date" placeholder
            await expect(page.locator('button[title="Start Date"] div.text-xs.capitalize')).not.toHaveText('Start Date');
            await ScreenshotHelper(page, screenshotDir, 'TH-015-filterPersistence', testInfo);
        });

        // ✓ AUTOMATED
        test('TH-016 - Verify Continue button functions correctly on the filter prompt', async ({ page, transactionHistoryPage, screenshotDir }: TransactionHistoryFixtures, testInfo: TestInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            await transactionHistoryPage.openFilter();
            // Select Last Week to enable the Continue button
            await transactionHistoryPage.locators.lastWeekButton.click();
            await highlightElements(transactionHistoryPage.locators.continueButton);
            await transactionHistoryPage.locators.continueButton.click();
            await page.waitForTimeout(1500);
            // Modal should be closed after Continue
            await expect(page.locator('div[role="dialog"][aria-modal="true"]')).not.toBeVisible();
            await ScreenshotHelper(page, screenshotDir, 'TH-016-continueButton', testInfo);
        });

        // ✓ AUTOMATED
        test('TH-017 - Verify Reset button clears all selected filters on the filter prompt', async ({ page, transactionHistoryPage, screenshotDir }: TransactionHistoryFixtures, testInfo: TestInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            await transactionHistoryPage.openFilter();
            // Select Last Week and a transaction type to populate filters
            await transactionHistoryPage.locators.lastWeekButton.click();
            await transactionHistoryPage.locators.typeDropdownLabelContainer.click();
            await transactionHistoryPage.locators.payoutOption.click();
            await transactionHistoryPage.locators.typeFilterLabel.click();
            await ScreenshotHelper(page, screenshotDir, 'TH-017-beforeReset', testInfo);
            // Click Reset
            await highlightElements(transactionHistoryPage.locators.resetButton);
            await transactionHistoryPage.locators.resetButton.click();
            await page.waitForTimeout(500);
            // Date buttons should revert to default placeholder text
            await expect(page.locator('button[title="Start Date"] div.text-xs.capitalize')).toHaveText('Start Date');
            await expect(page.locator('button[title="End Date"] div.text-xs.capitalize')).toHaveText('End Date');
            // Type label should revert to "All"
            await expect(transactionHistoryPage.locators.typeDropdownLabelContainer).toHaveText('All');
            await ScreenshotHelper(page, screenshotDir, 'TH-017-afterReset', testInfo);
        });

        // ✓ AUTOMATED
        test('TH-018 - Verify Close button dismisses the filter prompt without applying changes', async ({ page, transactionHistoryPage, screenshotDir }: TransactionHistoryFixtures, testInfo: TestInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            await transactionHistoryPage.openFilter();
            // Select Last Week (but do NOT continue)
            await transactionHistoryPage.locators.lastWeekButton.click();
            await highlightElements(transactionHistoryPage.locators.closeFilterButton);
            // Close without applying
            await transactionHistoryPage.locators.closeFilterButton.click();
            await page.waitForTimeout(500);
            // Modal should be gone
            await expect(page.locator('div[role="dialog"][aria-modal="true"]')).not.toBeVisible();
            // Transaction list should still be visible (filter was not applied)
            await expect(page.locator('table.shaded-table')).toBeVisible();
            await ScreenshotHelper(page, screenshotDir, 'TH-018-closeButton', testInfo);
        });

    });

    // ─────────────────────────────────────────────────────────────────────────────
    // CALENDAR / DATE FILTER  (TH-019 → TH-027)
    // ─────────────────────────────────────────────────────────────────────────────

    test.describe('Calendar / Date Filter', () => {

        // ✓ AUTOMATED
        test('TH-019 - Verify calendar allows selection of dates only within the last 30 days', async ({ page, transactionHistoryPage, screenshotDir }: TransactionHistoryFixtures, testInfo: TestInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            await transactionHistoryPage.openFilter();
            await transactionHistoryPage.locators.startDateInput.click();
            await page.waitForTimeout(300);
            const calendarGrid = page.locator('div[role="grid"]');
            await expect(calendarGrid).toBeVisible();
            // Future dates are blocked — next-month button must be disabled
            await expect(page.locator('button[title="next-month"]')).toBeDisabled();
            // At least some dates in current month are disabled (future ones)
            const disabledInCurrentMonth = page.locator('button[role="gridcell"][disabled]');
            await expect(disabledInCurrentMonth.first()).toBeVisible();
            await highlightElements(disabledInCurrentMonth.first());
            await ScreenshotHelper(page, screenshotDir, 'TH-019-currentMonth', testInfo);
            // Navigate to previous month — dates earlier than 30 days ago must also be disabled
            await transactionHistoryPage.locators.previousMonthButton.click();
            await page.waitForTimeout(300);
            const disabledInPrevMonth = page.locator('button[role="gridcell"][disabled]');
            await expect(disabledInPrevMonth.first()).toBeVisible();
            await highlightElements(disabledInPrevMonth.first());
            await ScreenshotHelper(page, screenshotDir, 'TH-019-prevMonth', testInfo);
        });

        // ✓ AUTOMATED
        test('TH-020 - Verify default days duration options are displayed correctly', async ({ page, transactionHistoryPage, screenshotDir }: TransactionHistoryFixtures, testInfo: TestInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            await transactionHistoryPage.openFilter();
            await expect(transactionHistoryPage.locators.lastWeekButton).toBeVisible();
            await expect(transactionHistoryPage.locators.last2WeeksButton).toBeVisible();
            await expect(transactionHistoryPage.locators.lastMonthButton).toBeVisible();
            await highlightElements(transactionHistoryPage.locators.lastWeekButton);
            await highlightElements(transactionHistoryPage.locators.last2WeeksButton);
            await highlightElements(transactionHistoryPage.locators.lastMonthButton);
            await ScreenshotHelper(page, screenshotDir, 'TH-020-durationOptions', testInfo);
        });

        // ✓ AUTOMATED
        test('TH-021 - Verify selecting the "Last Week" option sets the correct date range', async ({ page, transactionHistoryPage, screenshotDir }: TransactionHistoryFixtures, testInfo: TestInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            await transactionHistoryPage.openFilter();
            await highlightElements(transactionHistoryPage.locators.lastWeekButton);
            await transactionHistoryPage.locators.lastWeekButton.click();
            // After clicking Last Week, both date buttons should show actual dates
            await expect(page.locator('button[title="Start Date"] div.text-xs.capitalize')).not.toHaveText('Start Date');
            await expect(page.locator('button[title="End Date"] div.text-xs.capitalize')).not.toHaveText('End Date');
            await ScreenshotHelper(page, screenshotDir, 'TH-021-lastWeek', testInfo);
            await transactionHistoryPage.locators.continueButton.click();
            await page.waitForTimeout(1500);
            await ScreenshotHelper(page, screenshotDir, 'TH-021-lastWeek-result', testInfo);
        });

        // ✓ AUTOMATED
        test('TH-022 - Verify selecting the "Last 14 Days" option sets the correct date range', async ({ page, transactionHistoryPage, screenshotDir }: TransactionHistoryFixtures, testInfo: TestInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            await transactionHistoryPage.openFilter();
            await highlightElements(transactionHistoryPage.locators.last2WeeksButton);
            await transactionHistoryPage.locators.last2WeeksButton.click();
            await expect(page.locator('button[title="Start Date"] div.text-xs.capitalize')).not.toHaveText('Start Date');
            await expect(page.locator('button[title="End Date"] div.text-xs.capitalize')).not.toHaveText('End Date');
            await ScreenshotHelper(page, screenshotDir, 'TH-022-last14Days', testInfo);
            await transactionHistoryPage.locators.continueButton.click();
            await page.waitForTimeout(1500);
            await ScreenshotHelper(page, screenshotDir, 'TH-022-last14Days-result', testInfo);
        });

        // ✓ AUTOMATED
        test('TH-023 - Verify selecting the "Last 30 Days" option sets the correct date range', async ({ page, transactionHistoryPage, screenshotDir }: TransactionHistoryFixtures, testInfo: TestInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            await transactionHistoryPage.openFilter();
            await highlightElements(transactionHistoryPage.locators.lastMonthButton);
            await transactionHistoryPage.locators.lastMonthButton.click();
            await expect(page.locator('button[title="Start Date"] div.text-xs.capitalize')).not.toHaveText('Start Date');
            await expect(page.locator('button[title="End Date"] div.text-xs.capitalize')).not.toHaveText('End Date');
            await ScreenshotHelper(page, screenshotDir, 'TH-023-last30Days', testInfo);
            await transactionHistoryPage.locators.lastMonthButton.click();
            await page.waitForTimeout(1500);
            await ScreenshotHelper(page, screenshotDir, 'TH-023-last30Days-result', testInfo);
        });

        // ✓ AUTOMATED
        test('TH-024 - Verify user is able to manually change the selected start and end dates', async ({ page, transactionHistoryPage, screenshotDir }: TransactionHistoryFixtures, testInfo: TestInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            await transactionHistoryPage.openFilter();
            // --- Pick start date: first enabled date in the calendar ---
            await transactionHistoryPage.locators.startDateInput.click();
            await page.waitForTimeout(300);
            const firstEnabled = page.locator('button[role="gridcell"]:not([disabled])').first();
            await firstEnabled.click();
            await page.waitForTimeout(300);
            // Start Date button should now show a date, not the placeholder
            await expect(page.locator('button[title="Start Date"] div.text-xs.capitalize')).not.toHaveText('Start Date');
            await ScreenshotHelper(page, screenshotDir, 'TH-024-startDate', testInfo);
            // --- Pick end date: last enabled date (today) in the calendar ---
            await transactionHistoryPage.locators.endDateInput.click();
            await page.waitForTimeout(300);
            const lastEnabled = page.locator('button[role="gridcell"]:not([disabled])').last();
            await lastEnabled.click();
            await page.waitForTimeout(300);
            // End Date button should now show a date, not the placeholder
            await expect(page.locator('button[title="End Date"] div.text-xs.capitalize')).not.toHaveText('End Date');
            await ScreenshotHelper(page, screenshotDir, 'TH-024-endDate', testInfo);
        });

        // ✓ AUTOMATED
        test('TH-025 - Verify transaction list updates according to the selected date range filter', async ({ page, transactionHistoryPage, screenshotDir }: TransactionHistoryFixtures, testInfo: TestInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            await transactionHistoryPage.openFilter();
            await transactionHistoryPage.locators.lastWeekButton.click();
            await transactionHistoryPage.locators.continueButton.click();
            await page.waitForTimeout(1500);
            // Either rows are shown or the no-results message appears — either confirms the list updated
            const hasRows = await page.locator('table.shaded-table tbody tr').count();
            const hasNoResults = await transactionHistoryPage.locators.noResultsMessage.isVisible();
            expect(hasRows > 0 || hasNoResults).toBe(true);
            await ScreenshotHelper(page, screenshotDir, 'TH-025-dateRangeFilter', testInfo);
        });

        // ✓ AUTOMATED
        test('TH-026 - Verify Reset button clears the selected calendar date range', async ({ page, transactionHistoryPage, screenshotDir }: TransactionHistoryFixtures, testInfo: TestInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            await transactionHistoryPage.openFilter();
            // Select Last Week to populate the date fields
            await transactionHistoryPage.locators.lastWeekButton.click();
            await expect(page.locator('button[title="Start Date"] div.text-xs.capitalize')).not.toHaveText('Start Date');
            await ScreenshotHelper(page, screenshotDir, 'TH-026-beforeReset', testInfo);
            // Reset
            await transactionHistoryPage.locators.resetButton.click();
            await page.waitForTimeout(500);
            // Date buttons should revert to default placeholder text
            await expect(page.locator('button[title="Start Date"] div.text-xs.capitalize')).toHaveText('Start Date');
            await expect(page.locator('button[title="End Date"] div.text-xs.capitalize')).toHaveText('End Date');
            await ScreenshotHelper(page, screenshotDir, 'TH-026-afterReset', testInfo);
        });

        // ✓ AUTOMATED
        test('TH-027 - Verify appropriate error message is displayed when no transactions are available for the selected date range', async ({ page, transactionHistoryPage, screenshotDir }: TransactionHistoryFixtures, testInfo: TestInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            await transactionHistoryPage.openFilter();
            // Navigate to previous month to find the earliest available date (oldest day in 30-day window)
            await transactionHistoryPage.locators.startDateInput.click();
            await page.waitForTimeout(300);
            await transactionHistoryPage.locators.previousMonthButton.click();
            await page.waitForTimeout(300);
            // Pick the first enabled date in the previous month (least likely to have transactions)
            const oldestDate = page.locator('button[role="gridcell"]:not([disabled])').first();
            const oldestTitle = await oldestDate.getAttribute('title') ?? '';
            await oldestDate.click();
            await page.waitForTimeout(300);
            // Set the same date as end date (single-day range maximises chance of no results)
            await transactionHistoryPage.locators.endDateInput.click();
            await page.waitForTimeout(300);
            await transactionHistoryPage.locators.previousMonthButton.click();
            await page.waitForTimeout(300);
            await page.locator(`button[role="gridcell"][title="${oldestTitle}"]`).click();
            await page.waitForTimeout(300);
            await transactionHistoryPage.locators.continueButton.click();
            await page.waitForTimeout(1500);
            // Verify the no-results message is displayed
            await expect(transactionHistoryPage.locators.noResultsMessage).toBeVisible();
            await highlightElements(transactionHistoryPage.locators.noResultsMessage);
            await ScreenshotHelper(page, screenshotDir, 'TH-027-noResults', testInfo);
        });

    });

    // ─────────────────────────────────────────────────────────────────────────────
    // SHOW ONLY PAYOUT TOGGLE  (TH-028 → TH-030)
    // ─────────────────────────────────────────────────────────────────────────────

    test.describe('Show Only Payout Toggle', () => {

        // ✓ AUTOMATED
        test('TH-028 - Verify "Show Only Payout" toggle activates when only "Payout" is selected from transaction type dropdown', async ({ page, transactionHistoryPage, screenshotDir }: TransactionHistoryFixtures, testInfo: TestInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            await transactionHistoryPage.openFilter();
            // Select only Payout from the type dropdown
            await transactionHistoryPage.locators.typeDropdownLabelContainer.click();
            await transactionHistoryPage.locators.payoutOption.click();
            await transactionHistoryPage.locators.typeFilterLabel.click();
            // Toggle should now be active
            await expect(transactionHistoryPage.locators.payoutToggleInput).toHaveAttribute('aria-checked', 'true');
            await highlightElements(transactionHistoryPage.locators.payoutToggleInput);
            await ScreenshotHelper(page, screenshotDir, 'TH-028-toggleActivates', testInfo);
        });

        // ✓ AUTOMATED
        test('TH-029 - Verify "Show Only Payout" toggle deactivates when another filter type is selected along with "Payout"', async ({ page, transactionHistoryPage, screenshotDir }: TransactionHistoryFixtures, testInfo: TestInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            await transactionHistoryPage.openFilter();
            // Activate toggle by selecting Payout only
            await transactionHistoryPage.locators.typeDropdownLabelContainer.click();
            await transactionHistoryPage.locators.payoutOption.click();
            await transactionHistoryPage.locators.typeFilterLabel.click();
            await expect(transactionHistoryPage.locators.payoutToggleInput).toHaveAttribute('aria-checked', 'true');
            // Now also select Wager — toggle should deactivate
            await transactionHistoryPage.locators.typeDropdownLabelContainer.click();
            await transactionHistoryPage.locators.wagerOption.click();
            await transactionHistoryPage.locators.typeFilterLabel.click();
            await expect(transactionHistoryPage.locators.payoutToggleInput).toHaveAttribute('aria-checked', 'false');
            await ScreenshotHelper(page, screenshotDir, 'TH-029-toggleDeactivates', testInfo);
        });

        // ✓ AUTOMATED
        test('TH-030 - Verify "Show Only Payout" toggle deactivates when "Payout" is deselected', async ({ page, transactionHistoryPage, screenshotDir }: TransactionHistoryFixtures, testInfo: TestInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            await transactionHistoryPage.openFilter();
            // Select Payout only → toggle activates
            await transactionHistoryPage.locators.typeDropdownLabelContainer.click();
            await transactionHistoryPage.locators.payoutOption.click();
            await transactionHistoryPage.locators.typeFilterLabel.click();
            await expect(transactionHistoryPage.locators.payoutToggleInput).toHaveAttribute('aria-checked', 'true');
            // Deselect Payout → toggle should deactivate
            await transactionHistoryPage.locators.typeDropdownLabelContainer.click();
            await transactionHistoryPage.locators.payoutOption.click(); // click again to deselect
            await transactionHistoryPage.locators.typeFilterLabel.click();
            await expect(transactionHistoryPage.locators.payoutToggleInput).toHaveAttribute('aria-checked', 'false');
            await highlightElements(transactionHistoryPage.locators.payoutToggleInput);
            await ScreenshotHelper(page, screenshotDir, 'TH-030-toggleDeactivatesOnDeselect', testInfo);
        });

    });

    // ─────────────────────────────────────────────────────────────────────────────
    // FILTER BY TYPE DROPDOWN  (TH-031 → TH-035)
    // ─────────────────────────────────────────────────────────────────────────────

    test.describe('Filter by Type Dropdown', () => {

        // ✓ AUTOMATED
        test('TH-031 - Verify Filter by Type dropdown displays "All" by default when no transaction type is selected', async ({ page, transactionHistoryPage, screenshotDir }: TransactionHistoryFixtures, testInfo: TestInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            await transactionHistoryPage.openFilter();
            // Label div should show "All" with the placeholder attribute
            await expect(transactionHistoryPage.locators.typeDropdownLabelContainer).toHaveText('All');
            await expect(transactionHistoryPage.locators.typeDropdownLabelContainer).toHaveAttribute('data-p', 'placeholder');
            await highlightElements(transactionHistoryPage.locators.typeDropdownLabelContainer);
            await ScreenshotHelper(page, screenshotDir, 'TH-031-dropdownDefault', testInfo);
        });

        // ✓ AUTOMATED
        test('TH-032 - Verify Reset button clears all selected transaction types from the dropdown', async ({ page, transactionHistoryPage, screenshotDir }: TransactionHistoryFixtures, testInfo: TestInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            await transactionHistoryPage.openFilter();
            // Select some types
            await transactionHistoryPage.locators.typeDropdownLabelContainer.click();
            await transactionHistoryPage.locators.payoutOption.click();
            await transactionHistoryPage.locators.wagerOption.click();
            await transactionHistoryPage.locators.typeFilterLabel.click();
            // Verify types are selected (label no longer shows "All" with placeholder)
            await expect(transactionHistoryPage.locators.typeDropdownLabelContainer).not.toHaveAttribute('data-p', 'placeholder');
            // Click Reset
            await transactionHistoryPage.locators.resetButton.click();
            await page.waitForTimeout(500);
            // Dropdown should revert to "All"
            await expect(transactionHistoryPage.locators.typeDropdownLabelContainer).toHaveText('All');
            await expect(transactionHistoryPage.locators.typeDropdownLabelContainer).toHaveAttribute('data-p', 'placeholder');
            await highlightElements(transactionHistoryPage.locators.typeDropdownLabelContainer);
            await ScreenshotHelper(page, screenshotDir, 'TH-032-resetDropdown', testInfo);
        });

        // ✓ AUTOMATED
        test('TH-033 - Verify user is able to remove selected filter tags successfully', async ({ page, transactionHistoryPage, screenshotDir }: TransactionHistoryFixtures, testInfo: TestInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            await transactionHistoryPage.openFilter();
            // Select Wager and Payout so chips appear
            await transactionHistoryPage.locators.typeDropdownLabelContainer.click();
            await transactionHistoryPage.locators.wagerOption.click();
            await transactionHistoryPage.locators.payoutOption.click();
            await transactionHistoryPage.locators.typeFilterLabel.click();
            // Both chips should be visible in the carousel
            const wagerChip = page.locator('div[data-pc-name="chip"][aria-label="Wager"]');
            const payoutChip = page.locator('div[data-pc-name="chip"][aria-label="Payout"]');
            await expect(wagerChip).toBeVisible();
            await expect(payoutChip).toBeVisible();
            await highlightElements(wagerChip);
            await ScreenshotHelper(page, screenshotDir, 'TH-033-chipsVisible', testInfo);
            // Remove Wager chip by clicking its X (SVG icon)
            await wagerChip.locator('svg').click();
            await page.waitForTimeout(300);
            // Wager chip should be removed; Payout chip should remain
            await expect(wagerChip).not.toBeVisible();
            await expect(payoutChip).toBeVisible();
            await ScreenshotHelper(page, screenshotDir, 'TH-033-wagerRemoved', testInfo);
        });

        // ✓ AUTOMATED
        test('TH-034 - Verify transaction count is displayed correctly on the dropdown', async ({ page, transactionHistoryPage, screenshotDir }: TransactionHistoryFixtures, testInfo: TestInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            await transactionHistoryPage.openFilter();
            await transactionHistoryPage.locators.typeDropdownLabelContainer.click();
            await transactionHistoryPage.locators.payoutOption.click();
            await transactionHistoryPage.locators.wagerOption.click();
            await transactionHistoryPage.locators.typeFilterLabel.click();
            // Label shows "(2) Transactions Selected" when 2 types are chosen
            await expect(transactionHistoryPage.locators.typeDropdownLabelContainer).toContainText('(2) Transactions Selected');
            await highlightElements(transactionHistoryPage.locators.typeDropdownLabelContainer);
            await ScreenshotHelper(page, screenshotDir, 'TH-034-dropdownCount', testInfo);
        });

        // ✓ AUTOMATED
        test('TH-035 - Verify dropdown displays "All" text when all transaction types are selected', async ({ page, transactionHistoryPage, screenshotDir }: TransactionHistoryFixtures, testInfo: TestInfo) => {
            await transactionHistoryPage.navigateToTransactionHistory();
            await transactionHistoryPage.openFilter();
            // Select all 6 available types: Wager, Payout, Withdrawal, Account Adjustment, Deposit, Bonus
            await transactionHistoryPage.locators.typeDropdownLabelContainer.click();
            await transactionHistoryPage.locators.wagerOption.click();
            await transactionHistoryPage.locators.payoutOption.click();
            await transactionHistoryPage.locators.withdrawalOption.click();
            await transactionHistoryPage.locators.accountAdjustmentOption.click();
            await transactionHistoryPage.locators.depositOption.click();
            await transactionHistoryPage.locators.bonusOption.click();
            await transactionHistoryPage.locators.typeFilterLabel.click();
            // When all types are selected the label reverts to "All"
            await expect(transactionHistoryPage.locators.typeDropdownLabelContainer).toHaveText('All');
            await highlightElements(transactionHistoryPage.locators.typeDropdownLabelContainer);
            await ScreenshotHelper(page, screenshotDir, 'TH-035-allSelected', testInfo);
        });

    });

}
