import { Page, Locator, expect } from '@playwright/test';
import { SafeActions } from '../actions/SafeActions';
import { BasePage } from './BasePage';
import { css, xpath, role, text, first, at } from '../locators/sel';

export enum TransactionFilterType {
    PAYOUT = 'Payout',
    WAGER = 'Wager',
    BONUS = 'Bonus',
    ACCOUNT_ADJUSTMENT = 'Account Adjustment',
    WITHDRAWAL = 'Withdrawal',
    DEPOSIT = 'Deposit'
}

export class TransactionHistoryPage extends BasePage {
    readonly locators: Record<string, Locator>;

    constructor(page: Page, safeActions: SafeActions) {
        super(page, safeActions);
        this.locators = this.build('transactionHistory', {
            menuButton: first(role("button", {"name":"menu"})),
            transactionSummaryLink: at(css("div:has-text('Transaction Summary')"), 5),
            filterButton: first(role("button", {"name":"Filter"})),
            startDateInput: css("button[title=\"Start Date\"]"),
            endDateInput: css("button[title=\"End Date\"]"),
            previousMonthButton: css("button[title=\"previous-month\"]"),
            continueButton: first(role("button", {"name":"Continue"})),
            resetButton: first(text("Reset", {"exact":true})),
            closeFilterButton: first(css("[element-name='close-modal']")),
            lastWeekButton: first(role("button", {"name":"Last Week"})),
            last2WeeksButton: first(role("button", {"name":"Last 2 weeks"})),
            lastMonthButton: first(role("button", {"name":"Last Month"})),
            typeDropdownLabelContainer: first(css("[data-pc-name=\"multiselect\"] [data-pc-section=\"label\"]")),
            typeFilterLabel: first(text("Filter By Type")),
            payoutToggleContainer: first(xpath("//*[text()='Show Payout Only']/..")),
            payoutToggleInput: first(role("switch")),
            tableRows: css("table.shaded-table tbody tr"),
            columnHeaders: first(css("td.cell-width:has-text(\"{headerName}\")")),
            showDetailIcon: first(css("td .showDetail")),
            detailViewBackBtn: first(role("button", {"name":"Back"})),
            nextPageBtn: css("div.rounded-r-md"),
            prevPageBtn: css("div.rounded-l-md"),
            pageNumbers: css("div.flex-row.border-1.std-border.rounded-md"),
            goToPageEllipsis: first(text("...")),
            goToInput: first(css("#goToInput")),
            goButton: first(role("button", {"name":"go"})),
            refreshButton: first(role("button", {"name":"Refresh"})),
            noResultsMessage: first(text("No results")),
            payoutOption: first(role("option", {"name":"Payout"})),
            wagerOption: first(role("option", {"name":"Wager"})),
            bonusOption: first(role("option", {"name":"Bonus"})),
            withdrawalOption: first(role("option", {"name":"Withdrawal"})),
            depositOption: first(role("option", {"name":"Deposit"})),
            accountAdjustmentOption: first(role("option", {"name":"Account Adjustment"})),
        });
    }

    // --- element accessors (selectors stay inside the Page Object) ---
    get table(): Locator { return this.page.locator('table.shaded-table'); }
    get allRowCells(): Locator { return this.page.locator('table.shaded-table tbody tr td'); }
    get dateCellSpans(): Locator { return this.page.locator('table.shaded-table tbody tr td:nth-child(1) span'); }
    get summaryHeading(): Locator { return this.page.locator('div.font-bold.text-base-priority', { hasText: 'Transaction Summary' }); }
    get filterModal(): Locator { return this.page.locator('div[aria-labelledby="Filter Transaction Summary-modal-title"]'); }
    get filterModalTitle(): Locator { return this.page.getByText('Filter Transaction Summary', { exact: true }); }
    get filterPayoutSwitch(): Locator { return this.page.locator('input[role="switch"][data-pc-section="input"]'); }
    get filterTypeMultiselect(): Locator { return this.page.locator('[data-pc-name="multiselect"]'); }
    get startDatePlaceholder(): Locator { return this.page.locator('button[title="Start Date"]'); }
    get endDatePlaceholder(): Locator { return this.page.locator('button[title="End Date"]'); }
    get calendarGrid(): Locator { return this.page.locator('div[role="grid"]'); }
    get calendarNextMonth(): Locator { return this.page.locator('button[title="next-month"]'); }
    get calendarDisabledCells(): Locator { return this.page.locator('button[role="gridcell"][disabled]'); }
    get calendarEnabledCells(): Locator { return this.page.locator('button[role="gridcell"]:not([disabled])'); }
    calendarCellByTitle(title: string): Locator { return this.page.locator(`button[role="gridcell"][title="${title}"]`); }
    get goToButton(): Locator { return this.page.getByRole('button', { name: 'go' }); }

    // --- Navigation ---

    async navigateToTransactionHistory() {
        await this.safeActions.safeClick('menuButton', this.locators.menuButton);
        await this.locators.transactionSummaryLink.first().click();
        await this.page.waitForTimeout(2000);
    }

    // --- Filter ---

    async openFilter() {
        await this.safeActions.safeClick('filterButton', this.locators.filterButton);
    }

    async openTypeDropdown() {
        await this.locators.typeDropdownLabelContainer.click();
    }

    async closeTypeDropdown() {
        await this.locators.typeFilterLabel.click();
    }

    async selectFilterTypes(types: TransactionFilterType[]) {
        await this.openTypeDropdown();
        for (const type of types) {
            await this.selectFilterType(type);
        }
        await this.closeTypeDropdown();
    }

    private async selectFilterType(type: TransactionFilterType) {
        switch (type) {
            case TransactionFilterType.PAYOUT: await this.locators.payoutOption.click(); break;
            case TransactionFilterType.WAGER: await this.locators.wagerOption.click(); break;
            case TransactionFilterType.BONUS: await this.locators.bonusOption.click(); break;
            case TransactionFilterType.ACCOUNT_ADJUSTMENT: await this.locators.accountAdjustmentOption.click(); break;
            case TransactionFilterType.WITHDRAWAL: await this.locators.withdrawalOption.click(); break;
            case TransactionFilterType.DEPOSIT: await this.locators.depositOption.click(); break;
        }
    }

    // --- Pagination ---

    getPageLocator(n: number) {
        return this.page.locator('div.flex-center.border-l').filter({
            has: this.page.locator('p', { hasText: new RegExp(`^${n}$`) })
        });
    }

    // Page 1 uses a different CSS class (no border-l)
    getPage1Locator() {
        return this.page.locator('div.flex-center').filter({
            has: this.page.locator('p', { hasText: /^1$/ })
        });
    }

    async goToPage(n: number) {
        await this.getPageLocator(n).click();
    }

    // --- Table ---

    getColumnHeader(name: string) {
        return this.page.locator('thead td.cell-width p.text-sm.font-bold', { hasText: name });
    }

    // Table is now 3 columns: Date (td 0), Game Name (td 1), Amount (td 2); td 3 is the detail icon.
    getGameNameCell(rowIndex: number) {
        return this.locators.tableRows.nth(rowIndex).locator('td').nth(1);
    }

    getTransactionAmountCell(rowIndex: number) {
        return this.locators.tableRows.nth(rowIndex).locator('td').nth(2);
    }

    /** The gold "minus" indicator shown on Wager amounts (absent on Payouts) within an amount cell. */
    minusIndicatorIn(amountCell: Locator): Locator {
        return amountCell.locator('span.gold-gradient-text.font-bold.absolute');
    }

    // --- Filter Chips ---

    getFilterChip(label: string) {
        return this.page.locator(`div[data-pc-name="chip"][aria-label="${label}"]`);
    }

    async removeFilterChip(label: string) {
        const chip = this.getFilterChip(label);
        await chip.scrollIntoViewIfNeeded();
        // Remove icon is an aria-hidden SVG with no data attribute — force is required
        await chip.locator('svg').click({ force: true });
    }

    // ══════════════════════════════════════════════════════════════════════════
    //  Intent API — mechanics (waits, date math, DOM probes) live here.
    // ══════════════════════════════════════════════════════════════════════════
    private static readonly DATE_RE = /\d{2}\/\d{2}\/\d{2}-\d{2}:\d{2}:\d{2}/;
    private static readonly AMOUNT_RE = /[\d,]+\.\d{2}/;
    private readonly headerNames = ['Date', 'Game Name', 'Amount'];

    get firstRow(): Locator { return this.locators.tableRows.first(); }
    get noResultsMessage(): Locator { return this.locators.noResultsMessage; }
    get payoutToggle(): Locator { return this.locators.payoutToggleInput; }
    get typeDropdownLabel(): Locator { return this.locators.typeDropdownLabelContainer; }

    // ── actions (absorb waits) ──────────────────────────────────────────────────
    async open(): Promise<void> {
        await this.navigateToTransactionHistory();
        await this.firstRow.waitFor({ state: 'visible' });
    }
    async openDetailView(): Promise<void> {
        await this.locators.showDetailIcon.first().click();
        await this.locators.detailViewBackBtn.waitFor({ state: 'visible' });
    }
    async backToSummary(): Promise<void> {
        await this.locators.detailViewBackBtn.click();
        await this.summaryHeading.waitFor({ state: 'visible' });
    }
    async clickRefresh(): Promise<void> {
        await this.locators.refreshButton.click();
        await this.firstRow.waitFor({ state: 'visible' });
    }
    async gotoPageNumber(n: number): Promise<void> { await this.goToPage(n); }
    async gotoPageViaInput(n: number): Promise<void> {
        await this.locators.goToPageEllipsis.click();
        await this.locators.goToInput.fill(String(n));
        await this.goToButton.click();
    }
    async nextPage(): Promise<void> { await this.locators.nextPageBtn.click(); }
    async prevPage(): Promise<void> { await this.locators.prevPageBtn.click(); }
    async applyDuration(which: 'week' | '2weeks' | 'month'): Promise<void> {
        const btn = which === 'week' ? this.locators.lastWeekButton : which === '2weeks' ? this.locators.last2WeeksButton : this.locators.lastMonthButton;
        await btn.click();
    }
    async continueFilter(): Promise<void> { await this.locators.continueButton.click(); await this.filterModal.waitFor({ state: 'hidden' }).catch(() => { }); }
    async resetFilter(): Promise<void> { await this.locators.resetButton.click(); }
    async closeFilter(): Promise<void> { await this.locators.closeFilterButton.click(); await this.filterModal.waitFor({ state: 'hidden' }).catch(() => { }); }
    async openStartCalendar(): Promise<void> { await this.locators.startDateInput.click(); await this.calendarGrid.waitFor({ state: 'visible' }); }
    async openEndCalendar(): Promise<void> { await this.locators.endDateInput.click(); await this.calendarGrid.waitFor({ state: 'visible' }); }
    async prevCalendarMonth(): Promise<void> { await this.locators.previousMonthButton.click(); }
    async pickFirstEnabledDate(): Promise<string> {
        const cell = this.calendarEnabledCells.first();
        const title = (await cell.getAttribute('title')) ?? '';
        await cell.click();
        return title;
    }
    async pickLastEnabledDate(): Promise<void> { await this.calendarEnabledCells.last().click(); }
    async pickDateByTitle(title: string): Promise<void> { await this.calendarCellByTitle(title).click(); }

    // ── data helpers ────────────────────────────────────────────────────────────
    private gameNameTexts(): Promise<string[]> {
        return this.locators.tableRows.evaluateAll((rows: Element[]) =>
            rows.map(r => (r.querySelectorAll('td')[1]?.querySelector('span.truncate')?.textContent ?? '').trim()));
    }

    // ── assertions ──────────────────────────────────────────────────────────────
    async expectListLoaded(): Promise<void> { await expect(this.firstRow).toBeVisible(); }
    async expectColumnHeaders(): Promise<void> {
        for (const h of this.headerNames) await expect(this.getColumnHeader(h)).toBeVisible();
    }
    /** Every row names the game it relates to (the table's middle column). */
    async expectTypeFormat(): Promise<void> {
        const names = await this.gameNameTexts();
        expect(names.length, 'no rows in the transaction table').toBeGreaterThan(0);
        for (const n of names) expect(n.length, 'a row is missing its game name').toBeGreaterThan(0);
    }
    /** Credits (payouts/wins) carry NO minus indicator and show a well-formed amount. */
    async expectPayoutsPositive(): Promise<void> {
        const count = await this.locators.tableRows.count();
        expect(count, 'no rows in the transaction table').toBeGreaterThan(0);
        for (let i = 0; i < count; i++) {
            const cell = this.getTransactionAmountCell(i);
            if (await this.minusIndicatorIn(cell).count() > 0) continue;   // skip debits
            await expect(cell).toContainText(TransactionHistoryPage.AMOUNT_RE);
        }
    }
    /** Debits (wagers) carry the gold minus indicator alongside a well-formed amount. */
    async expectWagersNegative(): Promise<void> {
        const count = await this.locators.tableRows.count();
        expect(count, 'no rows in the transaction table').toBeGreaterThan(0);
        for (let i = 0; i < count; i++) {
            const cell = this.getTransactionAmountCell(i);
            if (await this.minusIndicatorIn(cell).count() === 0) continue;  // skip credits
            await expect(cell).toContainText(TransactionHistoryPage.AMOUNT_RE);
        }
    }
    async expectDetailViewOpen(): Promise<void> { await expect(this.locators.detailViewBackBtn).toBeVisible(); }
    async expectOnSummary(): Promise<void> { await expect(this.summaryHeading).toBeVisible(); }
    async expectActivePage(n: number): Promise<void> { await expect(this.getPageLocator(n)).toHaveClass(/blue-gradient/); }
    async expectActivePage1(): Promise<void> { await expect(this.getPage1Locator()).toHaveClass(/blue-gradient/); }
    /** Every visible row's date falls within the last `days` days (empty result is valid). */
    async expectRowsWithinDays(days: number): Promise<void> {
        if (await this.noResultsMessage.isVisible().catch(() => false)) return;
        const cellTexts = await this.allRowCells.allTextContents();
        const dates = cellTexts.map(t => (t.match(TransactionHistoryPage.DATE_RE) || [])[0]).filter((t): t is string => !!t);
        expect(dates.length, 'no date cells in filtered table').toBeGreaterThan(0);
        const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - days); cutoff.setHours(0, 0, 0, 0);
        for (const raw of dates) {
            const [dd, mm, yy] = raw.split('-')[0].split('/').map(Number);
            expect(new Date(2000 + yy, mm - 1, dd).getTime(), `row date ${raw} outside last ${days} days`).toBeGreaterThanOrEqual(cutoff.getTime());
        }
    }
    async expectWithin30Days(): Promise<void> {
        const count = await this.dateCellSpans.count();
        const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 30); cutoff.setHours(0, 0, 0, 0);
        for (let i = 0; i < count; i++) {
            const raw = (await this.dateCellSpans.nth(i).textContent())?.trim() ?? '';
            const [dd, mm, yy] = raw.split('-')[0].split('/').map(Number);
            expect(new Date(2000 + yy, mm - 1, dd).getTime()).toBeGreaterThanOrEqual(cutoff.getTime());
        }
    }
    async expectFilterPromptUI(): Promise<void> {
        await expect(this.filterModal).toBeVisible();
        await expect(this.filterModalTitle).toBeVisible();
        await expect(this.locators.startDateInput).toBeVisible();
        await expect(this.locators.endDateInput).toBeVisible();
        await expect(this.locators.lastWeekButton).toBeVisible();
        await expect(this.locators.last2WeeksButton).toBeVisible();
        await expect(this.locators.lastMonthButton).toBeVisible();
        await expect(this.filterPayoutSwitch).toBeAttached();
        await expect(this.filterTypeMultiselect).toBeVisible();
        await expect(this.locators.resetButton).toBeVisible();
        await expect(this.locators.continueButton).toBeVisible();
    }
    async expectFilterModalClosed(): Promise<void> { await expect(this.filterModal).not.toBeVisible(); }
    async expectDateRangeChosen(): Promise<void> {
        await expect(this.startDatePlaceholder).toHaveCount(0);
        await expect(this.endDatePlaceholder).toHaveCount(0);
    }
    async expectDateRangeCleared(): Promise<void> {
        await expect(this.startDatePlaceholder).toBeVisible();
        await expect(this.endDatePlaceholder).toBeVisible();
    }
    async expectFiltersReset(): Promise<void> {
        await this.expectDateRangeCleared();
        await expect(this.typeDropdownLabel).toHaveText('All');
    }
    async expectCalendarLimitedToLast30Days(): Promise<void> {
        await expect(this.calendarGrid).toBeVisible();
        await expect(this.calendarNextMonth).toBeDisabled();
        await expect(this.calendarDisabledCells.first()).toBeVisible();
        await this.prevCalendarMonth();
        await expect(this.calendarDisabledCells.first()).toBeVisible();
    }
    async expectDurationOptions(): Promise<void> {
        await expect(this.locators.lastWeekButton).toBeVisible();
        await expect(this.locators.last2WeeksButton).toBeVisible();
        await expect(this.locators.lastMonthButton).toBeVisible();
    }
    async expectNoResults(): Promise<void> { await expect(this.noResultsMessage).toBeVisible(); }
    async expectPayoutToggle(checked: boolean): Promise<void> { await expect(this.payoutToggle).toHaveAttribute('aria-checked', String(checked)); }
    async expectTypeDropdownAll(): Promise<void> {
        await expect(this.typeDropdownLabel).toHaveText('All');
        await expect(this.typeDropdownLabel).toHaveAttribute('data-p', 'placeholder');
    }
    async expectTypeDropdownCount(n: number): Promise<void> { await expect(this.typeDropdownLabel).toContainText(`(${n}) Transactions Selected`); }
    async expectTypeDropdownContains(text: string): Promise<void> { await expect(this.typeDropdownLabel).toContainText(text); }
    async expectTypeDropdownNotPlaceholder(): Promise<void> { await expect(this.typeDropdownLabel).not.toHaveAttribute('data-p', 'placeholder'); }
    async expectFilterChip(label: string): Promise<void> { await expect(this.getFilterChip(label)).toBeVisible(); }
    async expectFilterChipGone(label: string): Promise<void> { await expect(this.getFilterChip(label)).not.toBeVisible(); }
}
