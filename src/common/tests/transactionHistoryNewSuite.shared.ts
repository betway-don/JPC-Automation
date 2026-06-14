import { Page, TestType } from '@playwright/test';
import { TransactionHistoryPage, TransactionFilterType } from '../pages/TransactionHistoryPage';
import { LoginPage } from '../pages/LoginPage';

type TransactionHistoryFixtures = {
    page: Page;
    transactionHistoryPage: TransactionHistoryPage;
    loginPage: LoginPage;
    testData: any;
};

export async function runTransactionHistoryNewSuiteTests(
    test: TestType<TransactionHistoryFixtures, any>
) {

    test.beforeEach(async ({ loginPage, transactionHistoryPage, testData }: TransactionHistoryFixtures) => {
        test.skip(process.env.JPC_ACCOUNT_RESTRICTED === '1', 'Logged-in: pending test account');
        await loginPage.goto();
        await loginPage.clickLogin();
        await loginPage.performLogin(testData.loginValid.mobile, testData.loginValid.password);
        await transactionHistoryPage.open();
    });

    test.describe('Transaction Summary', () => {

        test('TH-001 - the recent transaction list is shown on load', async ({ transactionHistoryPage }: TransactionHistoryFixtures) => {
            await transactionHistoryPage.expectListLoaded();
        });

        test('TH-002 - all required column headers are shown', async ({ transactionHistoryPage }: TransactionHistoryFixtures) => {
            await transactionHistoryPage.expectColumnHeaders();
        });

        test('TH-003 - transaction type shows as Payout/Wager with provider', async ({ transactionHistoryPage }: TransactionHistoryFixtures) => {
            await transactionHistoryPage.expectTypeFormat();
        });

        test('TH-004 - payout amounts are positive', async ({ transactionHistoryPage }: TransactionHistoryFixtures) => {
            await transactionHistoryPage.expectPayoutsPositive();
        });

        test('TH-005 - wager amounts show a minus sign', async ({ transactionHistoryPage }: TransactionHistoryFixtures) => {
            await transactionHistoryPage.expectWagersNegative();
        });

        test('TH-006 - the Tlog icon opens the transaction detail view', async ({ transactionHistoryPage }: TransactionHistoryFixtures) => {
            await transactionHistoryPage.openDetailView();
            await transactionHistoryPage.expectDetailViewOpen();
        });

        test('TH-007 - Back returns to the Transaction Summary', async ({ transactionHistoryPage }: TransactionHistoryFixtures) => {
            await transactionHistoryPage.openDetailView();
            await transactionHistoryPage.backToSummary();
            await transactionHistoryPage.expectOnSummary();
        });

        test('TH-008 - Refresh reloads the latest data', async ({ transactionHistoryPage }: TransactionHistoryFixtures) => {
            await transactionHistoryPage.clickRefresh();
            await transactionHistoryPage.expectListLoaded();
        });

        test('TH-009 - pages can be navigated by page number', async ({ transactionHistoryPage }: TransactionHistoryFixtures) => {
            await transactionHistoryPage.gotoPageNumber(2);
            await transactionHistoryPage.expectActivePage(2);
        });

        test('TH-010 - a specific page can be reached via Go to Page', async ({ transactionHistoryPage }: TransactionHistoryFixtures) => {
            await transactionHistoryPage.gotoPageViaInput(5);
            await transactionHistoryPage.expectActivePage(5);
            await transactionHistoryPage.expectListLoaded();
        });

        test('TH-011 - the Next button advances the page', async ({ transactionHistoryPage }: TransactionHistoryFixtures) => {
            await transactionHistoryPage.nextPage();
            await transactionHistoryPage.expectActivePage(2);
        });

        test('TH-012 - the Previous button goes back a page', async ({ transactionHistoryPage }: TransactionHistoryFixtures) => {
            await transactionHistoryPage.nextPage();
            await transactionHistoryPage.prevPage();
            await transactionHistoryPage.expectActivePage1();
        });

        test('TH-013 - only transactions from the last 30 days are shown', async ({ transactionHistoryPage }: TransactionHistoryFixtures) => {
            await transactionHistoryPage.expectWithin30Days();
        });

    });

    test.describe('Filter Prompt', () => {

        test('TH-014 - the filter prompt is shown with all its controls', async ({ transactionHistoryPage }: TransactionHistoryFixtures) => {
            await transactionHistoryPage.openFilter();
            await transactionHistoryPage.expectFilterPromptUI();
        });

        test('TH-015 - selected filters persist after leaving and returning', async ({ transactionHistoryPage }: TransactionHistoryFixtures) => {
            await transactionHistoryPage.openFilter();
            await transactionHistoryPage.applyDuration('week');
            await transactionHistoryPage.continueFilter();
            await transactionHistoryPage.openDetailView();
            await transactionHistoryPage.backToSummary();
            await transactionHistoryPage.openFilter();
            await transactionHistoryPage.expectDateRangeChosen();
        });

        test('TH-016 - Continue applies the filter and closes the prompt', async ({ transactionHistoryPage }: TransactionHistoryFixtures) => {
            await transactionHistoryPage.openFilter();
            await transactionHistoryPage.applyDuration('week');
            await transactionHistoryPage.continueFilter();
            await transactionHistoryPage.expectFilterModalClosed();
        });

        test('TH-017 - Reset clears all selected filters', async ({ transactionHistoryPage }: TransactionHistoryFixtures) => {
            await transactionHistoryPage.openFilter();
            await transactionHistoryPage.applyDuration('week');
            await transactionHistoryPage.selectFilterTypes([TransactionFilterType.PAYOUT]);
            await transactionHistoryPage.resetFilter();
            await transactionHistoryPage.expectFiltersReset();
        });

        test('TH-018 - Close dismisses the prompt without applying', async ({ transactionHistoryPage }: TransactionHistoryFixtures) => {
            await transactionHistoryPage.openFilter();
            await transactionHistoryPage.applyDuration('week');
            await transactionHistoryPage.closeFilter();
            await transactionHistoryPage.expectFilterModalClosed();
            await transactionHistoryPage.expectListLoaded();
        });

    });

    test.describe('Calendar / Date Filter', () => {

        test('TH-019 - the calendar only allows the last 30 days', async ({ transactionHistoryPage }: TransactionHistoryFixtures) => {
            await transactionHistoryPage.openFilter();
            await transactionHistoryPage.openStartCalendar();
            await transactionHistoryPage.expectCalendarLimitedToLast30Days();
        });

        test('TH-020 - the default duration options are shown', async ({ transactionHistoryPage }: TransactionHistoryFixtures) => {
            await transactionHistoryPage.openFilter();
            await transactionHistoryPage.expectDurationOptions();
        });

        test('TH-021 - "Last Week" sets a 7-day range', async ({ transactionHistoryPage }: TransactionHistoryFixtures) => {
            await transactionHistoryPage.openFilter();
            await transactionHistoryPage.applyDuration('week');
            await transactionHistoryPage.expectDateRangeChosen();
            await transactionHistoryPage.continueFilter();
            await transactionHistoryPage.expectRowsWithinDays(7);
        });

        test('TH-022 - "Last 14 Days" sets a 14-day range', async ({ transactionHistoryPage }: TransactionHistoryFixtures) => {
            await transactionHistoryPage.openFilter();
            await transactionHistoryPage.applyDuration('2weeks');
            await transactionHistoryPage.expectDateRangeChosen();
            await transactionHistoryPage.continueFilter();
            await transactionHistoryPage.expectRowsWithinDays(14);
        });

        test('TH-023 - "Last 30 Days" sets a 30-day range', async ({ transactionHistoryPage }: TransactionHistoryFixtures) => {
            await transactionHistoryPage.openFilter();
            await transactionHistoryPage.applyDuration('month');
            await transactionHistoryPage.expectDateRangeChosen();
            await transactionHistoryPage.continueFilter();
            await transactionHistoryPage.expectRowsWithinDays(30);
        });

        test('TH-024 - start and end dates can be chosen manually', async ({ transactionHistoryPage }: TransactionHistoryFixtures) => {
            await transactionHistoryPage.openFilter();
            await transactionHistoryPage.openStartCalendar();
            await transactionHistoryPage.pickFirstEnabledDate();
            await transactionHistoryPage.openEndCalendar();
            await transactionHistoryPage.pickLastEnabledDate();
            await transactionHistoryPage.expectDateRangeChosen();
        });

        test('TH-025 - the list updates to the selected date range', async ({ transactionHistoryPage }: TransactionHistoryFixtures) => {
            await transactionHistoryPage.openFilter();
            await transactionHistoryPage.applyDuration('week');
            await transactionHistoryPage.continueFilter();
            await transactionHistoryPage.expectRowsWithinDays(7);
        });

        test('TH-026 - Reset clears the calendar date range', async ({ transactionHistoryPage }: TransactionHistoryFixtures) => {
            await transactionHistoryPage.openFilter();
            await transactionHistoryPage.applyDuration('week');
            await transactionHistoryPage.expectDateRangeChosen();
            await transactionHistoryPage.resetFilter();
            await transactionHistoryPage.expectDateRangeCleared();
        });

        test('TH-027 - an empty-state message shows when no transactions match', async ({ transactionHistoryPage }: TransactionHistoryFixtures) => {
            await transactionHistoryPage.openFilter();
            await transactionHistoryPage.openStartCalendar();
            await transactionHistoryPage.prevCalendarMonth();
            const oldest = await transactionHistoryPage.pickFirstEnabledDate();
            await transactionHistoryPage.openEndCalendar();
            await transactionHistoryPage.pickDateByTitle(oldest);
            await transactionHistoryPage.continueFilter();
            await transactionHistoryPage.expectNoResults();
        });

    });

    test.describe('Show Only Payout Toggle', () => {

        test('TH-028 - the toggle activates when only Payout is selected', async ({ transactionHistoryPage }: TransactionHistoryFixtures) => {
            await transactionHistoryPage.openFilter();
            await transactionHistoryPage.selectFilterTypes([TransactionFilterType.PAYOUT]);
            await transactionHistoryPage.expectPayoutToggle(true);
        });

        test('TH-029 - the toggle deactivates when another type is added', async ({ transactionHistoryPage }: TransactionHistoryFixtures) => {
            await transactionHistoryPage.openFilter();
            await transactionHistoryPage.selectFilterTypes([TransactionFilterType.PAYOUT]);
            await transactionHistoryPage.expectPayoutToggle(true);
            await transactionHistoryPage.selectFilterTypes([TransactionFilterType.WAGER]);
            await transactionHistoryPage.expectPayoutToggle(false);
        });

        test('TH-030 - the toggle deactivates when Payout is deselected', async ({ transactionHistoryPage }: TransactionHistoryFixtures) => {
            await transactionHistoryPage.openFilter();
            await transactionHistoryPage.selectFilterTypes([TransactionFilterType.PAYOUT]);
            await transactionHistoryPage.expectPayoutToggle(true);
            await transactionHistoryPage.selectFilterTypes([TransactionFilterType.PAYOUT]);
            await transactionHistoryPage.expectPayoutToggle(false);
        });

    });

    test.describe('Filter by Type Dropdown', () => {

        test('TH-031 - the dropdown shows "All" by default', async ({ transactionHistoryPage }: TransactionHistoryFixtures) => {
            await transactionHistoryPage.openFilter();
            await transactionHistoryPage.expectTypeDropdownAll();
        });

        test('TH-032 - Reset clears all selected types', async ({ transactionHistoryPage }: TransactionHistoryFixtures) => {
            await transactionHistoryPage.openFilter();
            await transactionHistoryPage.selectFilterTypes([TransactionFilterType.PAYOUT, TransactionFilterType.WAGER]);
            await transactionHistoryPage.expectTypeDropdownNotPlaceholder();
            await transactionHistoryPage.resetFilter();
            await transactionHistoryPage.expectTypeDropdownAll();
        });

        test('TH-033 - filter chips can be removed', async ({ transactionHistoryPage }: TransactionHistoryFixtures) => {
            await transactionHistoryPage.openFilter();
            await transactionHistoryPage.selectFilterTypes([TransactionFilterType.WAGER, TransactionFilterType.PAYOUT]);
            await transactionHistoryPage.expectFilterChip('Wager');
            await transactionHistoryPage.expectFilterChip('Payout');
            await transactionHistoryPage.removeFilterChip('Wager');
            await transactionHistoryPage.expectFilterChipGone('Wager');
            await transactionHistoryPage.expectTypeDropdownContains('Payout');
        });

        test('TH-034 - the dropdown shows the selected transaction count', async ({ transactionHistoryPage }: TransactionHistoryFixtures) => {
            await transactionHistoryPage.openFilter();
            await transactionHistoryPage.selectFilterTypes([TransactionFilterType.PAYOUT, TransactionFilterType.WAGER]);
            await transactionHistoryPage.expectTypeDropdownCount(2);
        });

        test('TH-035 - the dropdown shows "All" when every type is selected', async ({ transactionHistoryPage }: TransactionHistoryFixtures) => {
            await transactionHistoryPage.openFilter();
            await transactionHistoryPage.selectFilterTypes([
                TransactionFilterType.WAGER,
                TransactionFilterType.PAYOUT,
                TransactionFilterType.WITHDRAWAL,
                TransactionFilterType.ACCOUNT_ADJUSTMENT,
                TransactionFilterType.DEPOSIT,
                TransactionFilterType.BONUS,
            ]);
            await transactionHistoryPage.expectTypeDropdownAll();
        });

    });

}
