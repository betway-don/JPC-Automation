import { Page, TestType, expect } from '@playwright/test';
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

export async function runTransactionHistoryTests(
    test: TestType<TransactionHistoryFixtures, any>
) {

    test.beforeEach(async ({ page, loginPage, testData }) => {
        await loginPage.goto();
        await loginPage.clickLogin();
        await page.waitForTimeout(2000);
        await loginPage.performLogin(testData.loginValid.mobile, testData.loginValid.password);
        // Wait for login to settle
        await page.waitForTimeout(2000);
    });

    test('T1. Verify Page Loads Correctly', async ({ page, transactionHistoryPage, screenshotDir }, testInfo) => {
        await transactionHistoryPage.navigateToTransactionHistory();
        await ScreenshotHelper(page, screenshotDir, 'T1-transactionHistory', testInfo);
    });

    test('T2. Verify Presence of All Column Headers', async ({ page, transactionHistoryPage, screenshotDir }, testInfo) => {
        await transactionHistoryPage.navigateToTransactionHistory();
        await highlightElements(transactionHistoryPage.getColumnHeader('Transaction ID'));
        await highlightElements(transactionHistoryPage.getColumnHeader('Date'));
        await highlightElements(transactionHistoryPage.getColumnHeader('Game Name'));
        await highlightElements(transactionHistoryPage.getColumnHeader('Transaction Type'));
        await highlightElements(transactionHistoryPage.getColumnHeader('Amount'));
        await ScreenshotHelper(page, screenshotDir, 'T2-transactionHistory', testInfo);
    });

    test('T3. Verify Correct Display of Transaction Types', async ({ page, transactionHistoryPage, screenshotDir }, testInfo) => {
        await transactionHistoryPage.navigateToTransactionHistory();
        const rows = transactionHistoryPage.locators.tableRows;
        const count = await rows.count();
        for (let i = 0; i < count; i++) {
            const cell = transactionHistoryPage.getTransactionTypeCell(i);
            const text = (await cell.textContent())?.trim() || '';
            if (/Wager|Payout/i.test(text)) {
                await highlightElements(cell);
            }
        }
        await ScreenshotHelper(page, screenshotDir, 'T3-transactionHistory', testInfo);
    });

    test('T4. Verify Amount Formatting for Payout', async ({ page, transactionHistoryPage, screenshotDir }, testInfo) => {
        await transactionHistoryPage.navigateToTransactionHistory();
        const rows = transactionHistoryPage.locators.tableRows;
        const rowCount = await rows.count();
        for (let i = 0; i < rowCount; i++) {
            const amountCell = transactionHistoryPage.getTransactionAmountCell(i);
            const minusSpanCount = await amountCell.locator('span.gold-gradient-text.font-bold').count();
            // No minus span => positive
            if (minusSpanCount === 0) {
                await highlightElements(amountCell);
            }
        }
        await ScreenshotHelper(page, screenshotDir, 'T4-transactionHistory', testInfo);
    });

    test('T5. Verify Amount Formatting for Wager', async ({ page, transactionHistoryPage, screenshotDir }, testInfo) => {
        await transactionHistoryPage.navigateToTransactionHistory();
        const rows = transactionHistoryPage.locators.tableRows;
        const rowCount = await rows.count();
        for (let i = 0; i < rowCount; i++) {
            const amountCell = transactionHistoryPage.getTransactionAmountCell(i);
            const minusSpanCount = await amountCell.locator('span.gold-gradient-text.font-bold').count();
            if (minusSpanCount > 0) {
                await highlightElements(amountCell);
            }
        }
        await ScreenshotHelper(page, screenshotDir, 'T5-transactionHistory', testInfo);
    });

    test('T6. Verify Tlog Icon Opens Detailed View', async ({ page, transactionHistoryPage, screenshotDir }, testInfo) => {
        await transactionHistoryPage.navigateToTransactionHistory();
        await transactionHistoryPage.locators.showDetailIcon.first().click();
        await ScreenshotHelper(page, screenshotDir, 'T6-transactionHistory', testInfo);
    });

    test('T7. Verify Detailed View', async ({ page, transactionHistoryPage, screenshotDir }, testInfo) => {
        await transactionHistoryPage.navigateToTransactionHistory();
        await transactionHistoryPage.locators.showDetailIcon.first().click();
        await page.waitForTimeout(2000);
        // Using generic locators for detail view fields for now as per spec
        await highlightElements(transactionHistoryPage.getColumnHeader('Transaction ID').locator('..'));
        await ScreenshotHelper(page, screenshotDir, 'T7-transactionHistory', testInfo);
    });

    test('T8. Verify Back Button Functionality', async ({ page, transactionHistoryPage, screenshotDir }, testInfo) => {
        await transactionHistoryPage.navigateToTransactionHistory();
        await transactionHistoryPage.locators.showDetailIcon.first().click();
        await page.waitForTimeout(1000);
        await transactionHistoryPage.locators.detailViewBackBtn.click();
        await ScreenshotHelper(page, screenshotDir, 'T8-transactionHistory', testInfo);
    });

    test('T9. Verify Refresh Icon Reloads Transaction List', async ({ page, transactionHistoryPage, screenshotDir }, testInfo) => {
        await transactionHistoryPage.navigateToTransactionHistory();
        await highlightElements(transactionHistoryPage.locators.refreshButton);
        await transactionHistoryPage.locators.refreshButton.click();
        await ScreenshotHelper(page, screenshotDir, 'T9-transactionHistory', testInfo);
    });

    test('T10. Verify Next Page Button', async ({ page, transactionHistoryPage, screenshotDir }, testInfo) => {
        await transactionHistoryPage.navigateToTransactionHistory();
        await transactionHistoryPage.locators.nextPageBtn.click();
        await ScreenshotHelper(page, screenshotDir, 'T10-transactionHistory', testInfo);
    });

    test('T11. Verify Page Number Functionality', async ({ page, transactionHistoryPage, screenshotDir }, testInfo) => {
        await transactionHistoryPage.navigateToTransactionHistory();
        await highlightElements(transactionHistoryPage.locators.pageNumbers);
        await ScreenshotHelper(page, screenshotDir, 'T11-transactionHistory', testInfo);
    });

    test('T12. Verify Go to Page Functionality', async ({ page, transactionHistoryPage, screenshotDir }, testInfo) => {
        await transactionHistoryPage.navigateToTransactionHistory();
        await transactionHistoryPage.locators.goToPageEllipsis.click();
        await transactionHistoryPage.locators.goToInput.click();
        await transactionHistoryPage.locators.goButton.click();
        await page.waitForTimeout(2000);
        await ScreenshotHelper(page, screenshotDir, 'T12-transactionHistory', testInfo);
    });

    test('T13. Verify Previous Page Button', async ({ page, transactionHistoryPage, screenshotDir }, testInfo) => {
        await transactionHistoryPage.navigateToTransactionHistory();
        await transactionHistoryPage.locators.prevPageBtn.click();
        await ScreenshotHelper(page, screenshotDir, 'T13-transactionHistory', testInfo);
    });

    test('T14. Verify Filter Button', async ({ page, transactionHistoryPage, screenshotDir }, testInfo) => {
        await transactionHistoryPage.navigateToTransactionHistory();
        await transactionHistoryPage.openFilter();
        await ScreenshotHelper(page, screenshotDir, 'T14-transactionHistory', testInfo);
    });

    test('T15. Verify Filter Persistence', async ({ page, transactionHistoryPage, screenshotDir }, testInfo) => {
        await transactionHistoryPage.navigateToTransactionHistory();
        await transactionHistoryPage.openFilter();
        await transactionHistoryPage.safeActions.safeClick('lastWeekButton', transactionHistoryPage.locators.lastWeekButton);
        await transactionHistoryPage.safeActions.safeClick('continueButton', transactionHistoryPage.locators.continueButton);
        await page.waitForTimeout(2000);
        await transactionHistoryPage.openFilter();
        await expect(transactionHistoryPage.locators.lastWeekButton).toHaveClass(/bg-primary-blue-gradient/);
        await ScreenshotHelper(page, screenshotDir, 'T15-transactionHistory', testInfo);
    });

    test('T18. Verify Applied Filter Transaction List', async ({ page, transactionHistoryPage, screenshotDir }, testInfo) => {
        await transactionHistoryPage.navigateToTransactionHistory();
        await transactionHistoryPage.openFilter();
        await transactionHistoryPage.locators.typeDropdownLabelContainer.click();
        // Select first 3 options (All, Payout, Wager etc) - simulating logic from spec
        // The spec clicked 0, 1, 2. We can try to select specific types or just mimic
        await transactionHistoryPage.selectFilterType(TransactionFilterType.PAYOUT);
        await transactionHistoryPage.selectFilterType(TransactionFilterType.WAGER);

        await transactionHistoryPage.locators.typeFilterLabel.click();
        await transactionHistoryPage.locators.continueButton.click();
        await page.waitForTimeout(2000);
        await ScreenshotHelper(page, screenshotDir, 'T18-transactionHistory', testInfo);
    });

    test('T20. Verify Reset Button on Filter Prompt', async ({ page, transactionHistoryPage, screenshotDir }, testInfo) => {
        await transactionHistoryPage.navigateToTransactionHistory();
        await transactionHistoryPage.openFilter();
        await transactionHistoryPage.locators.typeDropdownLabelContainer.click();
        await transactionHistoryPage.selectFilterType(TransactionFilterType.PAYOUT);
        await transactionHistoryPage.locators.typeFilterLabel.click();

        await ScreenshotHelper(page, screenshotDir, 'T20-transactionHistory', testInfo);
        await transactionHistoryPage.locators.resetButton.click();
        await page.waitForTimeout(2000);
        await ScreenshotHelper(page, screenshotDir, 'T20-transactionHistory-reset', testInfo);
    });

    test('T21. Verify Close Button on Filter Prompt', async ({ page, transactionHistoryPage, screenshotDir }, testInfo) => {
        await transactionHistoryPage.navigateToTransactionHistory();
        await transactionHistoryPage.openFilter();
        await highlightElements(transactionHistoryPage.locators.closeFilterButton);
        await ScreenshotHelper(page, screenshotDir, 'T21-transactionHistory', testInfo);
        await transactionHistoryPage.locators.closeFilterButton.click();
        await ScreenshotHelper(page, screenshotDir, 'T21-transactionHistory-closed', testInfo);
    });

    test('T22. Verify No Results Message', async ({ page, transactionHistoryPage, screenshotDir }, testInfo) => {
        await transactionHistoryPage.navigateToTransactionHistory();
        await transactionHistoryPage.openFilter();
        await transactionHistoryPage.locators.typeDropdownLabelContainer.click();
        // Picking an option likely to have no results, or just 5th option as in spec
        // Spec: options.nth(5).click();
        await page.getByRole('option').nth(5).click();
        await transactionHistoryPage.locators.typeFilterLabel.click();

        await transactionHistoryPage.locators.continueButton.click();
        await highlightElements(transactionHistoryPage.locators.noResultsMessage);
        await ScreenshotHelper(page, screenshotDir, 'T22-transactionHistory', testInfo);
    });

    test('T23. Verify Calendar Date Selection Accessibility', async ({ page, transactionHistoryPage, screenshotDir }, testInfo) => {
        await transactionHistoryPage.navigateToTransactionHistory();
        await transactionHistoryPage.openFilter();
        await transactionHistoryPage.locators.startDateInput.click();
        await transactionHistoryPage.locators.previousMonthButton.click();
        const disabledCount = await transactionHistoryPage.getDisabledDateElements().count();
        expect(disabledCount).toBeGreaterThan(0);
        await ScreenshotHelper(page, screenshotDir, 'T23-transactionHistory', testInfo);
    });

    test('T25. Verify Last Week Option Functionality', async ({ page, transactionHistoryPage, screenshotDir }, testInfo) => {
        await transactionHistoryPage.navigateToTransactionHistory();
        await transactionHistoryPage.openFilter();
        await highlightElements(transactionHistoryPage.locators.lastWeekButton);
        await transactionHistoryPage.locators.lastWeekButton.click();
        await ScreenshotHelper(page, screenshotDir, 'T25-transactionHistory', testInfo);
        await transactionHistoryPage.locators.continueButton.click();
        await page.waitForTimeout(2000);
        await ScreenshotHelper(page, screenshotDir, 'T25-transactionHistory-result', testInfo);
    });

    test('T26. Verify Last 14 Days Option Functionality', async ({ page, transactionHistoryPage, screenshotDir }, testInfo) => {
        await transactionHistoryPage.navigateToTransactionHistory();
        await transactionHistoryPage.openFilter();
        await highlightElements(transactionHistoryPage.locators.last2WeeksButton);
        await transactionHistoryPage.locators.last2WeeksButton.click();
        await ScreenshotHelper(page, screenshotDir, 'T26-transactionHistory', testInfo);
        await transactionHistoryPage.locators.continueButton.click();
        await page.waitForTimeout(2000);
        await ScreenshotHelper(page, screenshotDir, 'T26-transactionHistory-result', testInfo);
    });

    test('T27. Verify Last 30 Days Option Functionality', async ({ page, transactionHistoryPage, screenshotDir }, testInfo) => {
        await transactionHistoryPage.navigateToTransactionHistory();
        await transactionHistoryPage.openFilter();
        await highlightElements(transactionHistoryPage.locators.lastMonthButton);
        await transactionHistoryPage.locators.lastMonthButton.click();
        await ScreenshotHelper(page, screenshotDir, 'T27-transactionHistory', testInfo);
        await transactionHistoryPage.locators.continueButton.click();
        await page.waitForTimeout(2000);
        await ScreenshotHelper(page, screenshotDir, 'T27-transactionHistory-result', testInfo);
    });

    test('T28. Verify Manual Date Change Functionality, end date should be same', async ({ page, transactionHistoryPage, screenshotDir }, testInfo) => {
        await transactionHistoryPage.navigateToTransactionHistory();
        await transactionHistoryPage.openFilter();
        await transactionHistoryPage.locators.lastMonthButton.click();
        await transactionHistoryPage.locators.startDateInput.click();

        // Pick 30th if available (mimicking spec logic roughly)
        await page.locator('td[aria-label="30"] span:not([aria-disabled="true"])').first().click();

        const today = new Date();
        const todayFormatted = transactionHistoryPage.formatDate(today);
        await expect(transactionHistoryPage.locators.endDateInput).toHaveValue(todayFormatted);
        await page.waitForTimeout(2000);
        await ScreenshotHelper(page, screenshotDir, 'T28-transactionHistory', testInfo);
    });

    test('T29. Verify Manual Date Change Functionality, end date should be same', async ({ page, transactionHistoryPage, screenshotDir }, testInfo) => {
        await transactionHistoryPage.navigateToTransactionHistory();
        await transactionHistoryPage.openFilter();

        const today = new Date();
        const startDateObj = new Date(today);
        startDateObj.setDate(today.getDate() - 28);

        await transactionHistoryPage.pickDateFromCalendar(startDateObj, transactionHistoryPage.locators.startDateInput);
        await transactionHistoryPage.pickDateFromCalendar(today, transactionHistoryPage.locators.endDateInput);

        const startFormatted = transactionHistoryPage.formatDate(startDateObj);
        const todayFormatted = transactionHistoryPage.formatDate(today);

        await expect(transactionHistoryPage.locators.startDateInput).toHaveValue(startFormatted);
        await expect(transactionHistoryPage.locators.endDateInput).toHaveValue(todayFormatted);

        await ScreenshotHelper(page, screenshotDir, 'T29-transactionHistory', testInfo);
        await transactionHistoryPage.locators.continueButton.click();
    });

    test('T31. Verify Calendar Date Selection Persistence', async ({ page, transactionHistoryPage, screenshotDir }, testInfo) => {
        await transactionHistoryPage.navigateToTransactionHistory();
        await transactionHistoryPage.openFilter();

        const today = new Date();
        const startDateObj = new Date(today);
        startDateObj.setDate(today.getDate() - 28);
        const startFormatted = transactionHistoryPage.formatDate(startDateObj);
        const todayFormatted = transactionHistoryPage.formatDate(today);

        await transactionHistoryPage.pickDateFromCalendar(startDateObj, transactionHistoryPage.locators.startDateInput);
        await transactionHistoryPage.pickDateFromCalendar(today, transactionHistoryPage.locators.endDateInput);

        await expect(transactionHistoryPage.locators.startDateInput).toHaveValue(startFormatted);
        await expect(transactionHistoryPage.locators.endDateInput).toHaveValue(todayFormatted);

        await transactionHistoryPage.locators.continueButton.click();
        await page.waitForTimeout(2000);
        await transactionHistoryPage.openFilter();

        await expect(transactionHistoryPage.locators.startDateInput).toHaveValue(startFormatted);
        await expect(transactionHistoryPage.locators.endDateInput).toHaveValue(todayFormatted);
        await ScreenshotHelper(page, screenshotDir, 'T31-transactionHistory', testInfo);
    });

    test('T32. Verify Calendar Default State', async ({ page, transactionHistoryPage, screenshotDir }, testInfo) => {
        await transactionHistoryPage.navigateToTransactionHistory();
        await transactionHistoryPage.openFilter();
        await highlightElements(transactionHistoryPage.locators.startDateInput);
        await highlightElements(transactionHistoryPage.locators.endDateInput);
        // Assuming default empty
        await expect(transactionHistoryPage.locators.startDateInput).toHaveValue('');
        await expect(transactionHistoryPage.locators.endDateInput).toHaveValue('');
        await ScreenshotHelper(page, screenshotDir, 'T32-transactionHistory', testInfo);
    });

    test('T34. Verify Calendar Date Selection Reset', async ({ page, transactionHistoryPage, screenshotDir }, testInfo) => {
        await transactionHistoryPage.navigateToTransactionHistory();
        await transactionHistoryPage.openFilter();

        const today = new Date();
        const startDateObj = new Date(today);
        startDateObj.setDate(today.getDate() - 28);
        await transactionHistoryPage.pickDateFromCalendar(startDateObj, transactionHistoryPage.locators.startDateInput);
        await transactionHistoryPage.pickDateFromCalendar(today, transactionHistoryPage.locators.endDateInput);

        await transactionHistoryPage.locators.resetButton.click();
        await page.waitForTimeout(500);
        await expect(transactionHistoryPage.locators.startDateInput).toHaveValue('');
        await expect(transactionHistoryPage.locators.endDateInput).toHaveValue('');
        await ScreenshotHelper(page, screenshotDir, 'T34-transactionHistory-reset', testInfo);
    });

    test('T35. Verify Calendar Date Range with No Transactions', async ({ page, transactionHistoryPage, screenshotDir }, testInfo) => {
        await transactionHistoryPage.navigateToTransactionHistory();
        await transactionHistoryPage.openFilter();
        // Logic from spec: Select last Sunday as start and end
        const getLastSunday = (d: Date) => {
            const t = new Date(d);
            while (t.getDay() !== 0) t.setDate(t.getDate() - 1);
            return t;
        };
        const sunday = getLastSunday(new Date());

        await transactionHistoryPage.pickDateFromCalendar(sunday, transactionHistoryPage.locators.startDateInput);
        await transactionHistoryPage.pickDateFromCalendar(sunday, transactionHistoryPage.locators.endDateInput);

        await transactionHistoryPage.locators.continueButton.click();
        await page.waitForTimeout(2000);
        await highlightElements(transactionHistoryPage.locators.noResultsMessage);
        await ScreenshotHelper(page, screenshotDir, 'T35-transactionHistory', testInfo);
    });

    test('T36. Verify Calendar Date Selection with Filters', async ({ page, transactionHistoryPage, screenshotDir }, testInfo) => {
        await transactionHistoryPage.navigateToTransactionHistory();
        await transactionHistoryPage.openFilter();

        const today = new Date();
        const start = new Date(today);
        start.setDate(today.getDate() - 28);
        await transactionHistoryPage.pickDateFromCalendar(start, transactionHistoryPage.locators.startDateInput);
        await transactionHistoryPage.pickDateFromCalendar(today, transactionHistoryPage.locators.endDateInput);

        // Payout Only
        await transactionHistoryPage.locators.typeDropdownLabelContainer.click();
        await transactionHistoryPage.selectFilterType(TransactionFilterType.PAYOUT);
        await transactionHistoryPage.locators.typeFilterLabel.click();
        await transactionHistoryPage.locators.continueButton.click();
        await page.waitForTimeout(2000);

        // Check Rows Payout & Positive
        const rows = transactionHistoryPage.locators.tableRows;
        const count = await rows.count();
        for (let i = 0; i < count; i++) {
            const type = (await transactionHistoryPage.getTransactionTypeCell(i).textContent()) || '';
            const amount = await transactionHistoryPage.getTransactionAmountCell(i).locator('span.gold-gradient-text.font-bold').count();
            if (/payout/i.test(type) && amount === 0) {
                await highlightElements(transactionHistoryPage.getTransactionAmountCell(i));
            }
        }
        await ScreenshotHelper(page, screenshotDir, 'T36-transactionHistory-payout', testInfo);
    });

    test('T37. Verify Calendar Date Selection with Multiple Filters', async ({ page, transactionHistoryPage, screenshotDir }, testInfo) => {
        await transactionHistoryPage.navigateToTransactionHistory();
        await transactionHistoryPage.openFilter();
        const today = new Date();
        const start = new Date(today);
        start.setDate(today.getDate() - 28);
        await transactionHistoryPage.pickDateFromCalendar(start, transactionHistoryPage.locators.startDateInput);
        await transactionHistoryPage.pickDateFromCalendar(today, transactionHistoryPage.locators.endDateInput);

        // Payout & Wager
        await transactionHistoryPage.locators.typeDropdownLabelContainer.click();
        await transactionHistoryPage.selectFilterType(TransactionFilterType.PAYOUT);
        await transactionHistoryPage.selectFilterType(TransactionFilterType.WAGER);
        await transactionHistoryPage.locators.typeFilterLabel.click();

        await transactionHistoryPage.locators.continueButton.click();
        await page.waitForTimeout(2000);
        await ScreenshotHelper(page, screenshotDir, 'T37-transactionHistory', testInfo);
    });

    test('T38. Verify Show Only Payout Toggle Activation', async ({ page, transactionHistoryPage, screenshotDir }, testInfo) => {
        await transactionHistoryPage.navigateToTransactionHistory();
        await transactionHistoryPage.openFilter();

        const payoutToggle = transactionHistoryPage.locators.payoutToggleInput;
        await payoutToggle.click();
        await expect(payoutToggle).toHaveAttribute('aria-checked', 'true');

        await transactionHistoryPage.locators.continueButton.click();
        await page.waitForTimeout(2000);
        await ScreenshotHelper(page, screenshotDir, 'T38-transactionHistory-payout-only', testInfo);
    });

    test('T39. Verify Show Only Payout Toggle Deactivation', async ({ page, transactionHistoryPage, screenshotDir }, testInfo) => {
        await transactionHistoryPage.navigateToTransactionHistory();
        await transactionHistoryPage.openFilter();
        const payoutToggle = transactionHistoryPage.locators.payoutToggleInput;
        await payoutToggle.click();
        await expect(payoutToggle).toHaveAttribute('aria-checked', 'true');

        // Select Wager -> Toggle should reset
        await transactionHistoryPage.locators.typeDropdownLabelContainer.click();
        await transactionHistoryPage.selectFilterType(TransactionFilterType.WAGER);
        await transactionHistoryPage.locators.typeFilterLabel.click();

        await expect(payoutToggle).toHaveAttribute('aria-checked', 'false');
        await ScreenshotHelper(page, screenshotDir, 'T39-transactionHistory-toggle-reset', testInfo);
    });

    test('T40. Verify Show Only Payout Toggle State After Deselecting Other Types', async ({ page, transactionHistoryPage, screenshotDir }, testInfo) => {
        await transactionHistoryPage.navigateToTransactionHistory();
        await transactionHistoryPage.openFilter();
        const payoutToggle = transactionHistoryPage.locators.payoutToggleInput;

        await transactionHistoryPage.locators.typeDropdownLabelContainer.click();
        await transactionHistoryPage.selectFilterType(TransactionFilterType.PAYOUT);
        await transactionHistoryPage.selectFilterType(TransactionFilterType.WAGER);
        await transactionHistoryPage.selectFilterType(TransactionFilterType.ACCOUNT_ADJUSTMENT);
        await transactionHistoryPage.locators.typeFilterLabel.click();
        await expect(payoutToggle).toHaveAttribute('aria-checked', 'false');

        // Deselect Wager
        await transactionHistoryPage.locators.typeDropdownLabelContainer.click();
        await transactionHistoryPage.selectFilterType(TransactionFilterType.WAGER);
        await transactionHistoryPage.locators.typeFilterLabel.click();

        // Toggle should remain OFF
        await expect(payoutToggle).toHaveAttribute('aria-checked', 'false');
        await ScreenshotHelper(page, screenshotDir, 'T40-transactionHistory', testInfo);
    });

    test('T50.Verify Dropdown Displays Count', async ({ page, transactionHistoryPage, screenshotDir }, testInfo) => {
        await transactionHistoryPage.navigateToTransactionHistory();
        await transactionHistoryPage.openFilter();

        await transactionHistoryPage.locators.typeDropdownLabelContainer.click();
        await transactionHistoryPage.selectFilterType(TransactionFilterType.ACCOUNT_ADJUSTMENT);
        await transactionHistoryPage.selectFilterType(TransactionFilterType.BONUS);

        await transactionHistoryPage.locators.typeFilterLabel.click(); // Close dropdown

        await expect(transactionHistoryPage.locators.typeDropdownLabelContainer).toContainText('(2)');
        await highlightElements(transactionHistoryPage.locators.typeDropdownLabelContainer);

        await ScreenshotHelper(page, screenshotDir, 'T50-transactionHistory-type-dropdown-default', testInfo);
    });

}
