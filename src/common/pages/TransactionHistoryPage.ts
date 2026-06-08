import { Page, Locator } from '@playwright/test';
import { loadLocatorsFromJson } from '../../global/utils/file-utils/jsonLocatorLoader';
import { getLocator } from '../../global/utils/file-utils/locatorResolver';
import { SafeActions } from '../actions/SafeActions';

export enum TransactionFilterType {
    PAYOUT = 'Payout',
    WAGER = 'Wager',
    BONUS = 'Bonus',
    ACCOUNT_ADJUSTMENT = 'Account Adjustment',
    WITHDRAWAL = 'Withdrawal',
    DEPOSIT = 'Deposit'
}

export class TransactionHistoryPage {
    readonly page: Page;
    readonly locators: Record<string, Locator>;

    constructor(page: Page, public readonly safeActions: SafeActions) {
        this.page = page;
        const configs = loadLocatorsFromJson('transactionHistory');

        this.locators = {
            menuButton: getLocator(this.page, configs["menuButton"]),
            transactionSummaryLink: getLocator(this.page, configs["transactionSummaryLink"]),
            filterButton: getLocator(this.page, configs["filterButton"]),
            startDateInput: getLocator(this.page, configs["startDateInput"]),
            endDateInput: getLocator(this.page, configs["endDateInput"]),
            previousMonthButton: getLocator(this.page, configs["previousMonthButton"]),
            continueButton: getLocator(this.page, configs["continueButton"]),
            resetButton: getLocator(this.page, configs["resetButton"]),
            closeFilterButton: getLocator(this.page, configs["closeFilterButton"]),
            lastWeekButton: getLocator(this.page, configs["lastWeekButton"]),
            last2WeeksButton: getLocator(this.page, configs["last2WeeksButton"]),
            lastMonthButton: getLocator(this.page, configs["lastMonthButton"]),
            typeDropdownLabelContainer: getLocator(this.page, configs["typeDropdownLabelContainer"]),
            typeFilterLabel: getLocator(this.page, configs["typeFilterLabel"]),
            payoutToggleContainer: getLocator(this.page, configs["payoutToggleContainer"]),
            payoutToggleInput: getLocator(this.page, configs["payoutToggleInput"]),
            tableRows: getLocator(this.page, configs["tableRows"]),
            columnHeaders: getLocator(this.page, configs["columnHeaders"]),
            showDetailIcon: getLocator(this.page, configs["showDetailIcon"]),
            detailViewBackBtn: getLocator(this.page, configs["detailViewBackBtn"]),
            nextPageBtn: getLocator(this.page, configs["nextPageBtn"]),
            prevPageBtn: getLocator(this.page, configs["prevPageBtn"]),
            pageNumbers: getLocator(this.page, configs["pageNumbers"]),
            goToPageEllipsis: getLocator(this.page, configs["goToPageEllipsis"]),
            goToInput: getLocator(this.page, configs["goToInput"]),
            goButton: getLocator(this.page, configs["goButton"]),
            refreshButton: getLocator(this.page, configs["refreshButton"]),
            noResultsMessage: getLocator(this.page, configs["noResultsMessage"]),
            payoutOption: getLocator(this.page, configs["payoutOption"]),
            wagerOption: getLocator(this.page, configs["wagerOption"]),
            bonusOption: getLocator(this.page, configs["bonusOption"]),
            accountAdjustmentOption: getLocator(this.page, configs["accountAdjustmentOption"]),
            withdrawalOption: getLocator(this.page, configs["withdrawalOption"]),
            depositOption: getLocator(this.page, configs["depositOption"]),
        };
    }

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

    getTransactionTypeCell(rowIndex: number) {
        return this.locators.tableRows.nth(rowIndex).locator('td').nth(3);
    }

    getTransactionAmountCell(rowIndex: number) {
        return this.locators.tableRows.nth(rowIndex).locator('td').nth(4);
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

}
