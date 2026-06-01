import { Page, Locator, expect } from '@playwright/test';
import { loadLocatorsFromJson } from '../../global/utils/file-utils/jsonLocatorLoader';
import { getLocator } from '../../global/utils/file-utils/locatorResolver';
import { SafeActions } from '../actions/SafeActions';
import { highlightElements } from '../actions/HighlightElements';

export enum TransactionFilterType {
    PAYOUT = 'Payout',
    WAGER = 'Wager',
    BONUS = 'Bonus',
    ACCOUNT_ADJUSTMENT = 'Account Adjustment'
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

            // Filters
            filterButton: getLocator(this.page, configs["filterButton"]),
            startDateInput: getLocator(this.page, configs["startDateInput"]),
            endDateInput: getLocator(this.page, configs["endDateInput"]),
            previousMonthButton: getLocator(this.page, configs["previousMonthButton"]),
            continueButton: getLocator(this.page, configs["continueButton"]),
            resetButton: getLocator(this.page, configs["resetButton"]),
            closeFilterButton: getLocator(this.page, configs["closeFilterButton"]),

            // Filter Options
            lastWeekButton: getLocator(this.page, configs["lastWeekButton"]),
            last2WeeksButton: getLocator(this.page, configs["last2WeeksButton"]),
            lastMonthButton: getLocator(this.page, configs["lastMonthButton"]),

            // Type dropdown
            typeDropdownLabelContainer: getLocator(this.page, configs["typeDropdownLabelContainer"]),
            typeFilterLabel: getLocator(this.page, configs["typeFilterLabel"]), // "Filter By Type" text to click outside

            // Payout Toggle
            payoutToggleContainer: getLocator(this.page, configs["payoutToggleContainer"]),
            payoutToggleInput: getLocator(this.page, configs["payoutToggleInput"]),

            // Table Elements
            tableRows: getLocator(this.page, configs["tableRows"]),
            columnHeaders: getLocator(this.page, configs["columnHeaders"]), // Generic container or list
            showDetailIcon: getLocator(this.page, configs["showDetailIcon"]),
            detailViewBackBtn: getLocator(this.page, configs["detailViewBackBtn"]),

            // Pagination
            nextPageBtn: getLocator(this.page, configs["nextPageBtn"]),
            prevPageBtn: getLocator(this.page, configs["prevPageBtn"]),
            pageNumbers: getLocator(this.page, configs["pageNumbers"]),
            goToPageEllipsis: getLocator(this.page, configs["goToPageEllipsis"]),
            goToInput: getLocator(this.page, configs["goToInput"]),
            goButton: getLocator(this.page, configs["goButton"]),

            // Other
            refreshButton: getLocator(this.page, configs["refreshButton"]),
            noResultsMessage: getLocator(this.page, configs["noResultsMessage"]),

            // Filter Options (Dynamic based on role usually, but we can define standard ones)
            payoutOption: getLocator(this.page, configs["payoutOption"]),
            wagerOption: getLocator(this.page, configs["wagerOption"]),
            bonusOption: getLocator(this.page, configs["bonusOption"]),
            accountAdjustmentOption: getLocator(this.page, configs["accountAdjustmentOption"]),
        };
    }

    async navigateToTransactionHistory() {
        await this.safeActions.safeClick('menuButton', this.locators.menuButton);
        await this.locators.transactionSummaryLink.first().click();
        await this.page.waitForTimeout(2000); // stable load
    }

    async openFilter() {
        await this.safeActions.safeClick('filterButton', this.locators.filterButton);
    }

    async selectFilterType(type: TransactionFilterType) {
        // Ensure dropdown is open or container is active if needed? 
        // The tests click `typeDropdownLabelContainer` before selecting.
        // We should probably include that logic or assume caller does it.
        // Assuming caller opens the dropdown:
        switch (type) {
            case TransactionFilterType.PAYOUT:
                await this.locators.payoutOption.click();
                break;
            case TransactionFilterType.WAGER:
                await this.locators.wagerOption.click();
                break;
            case TransactionFilterType.BONUS:
                await this.locators.bonusOption.click();
                break;
            case TransactionFilterType.ACCOUNT_ADJUSTMENT:
                await this.locators.accountAdjustmentOption.click();
                break;
        }
    }

    // --- Column & Row Helpers ---
    getColumnHeader(name: string) {
        return this.page.getByText(name, { exact: true }); // Still using getByText but encapsulated
    }

    getTransactionTypeCell(rowIndex: number) {
        return this.locators.tableRows.nth(rowIndex).locator('td').nth(3); // Type is 4th column (index 3)
    }

    getTransactionAmountCell(rowIndex: number) {
        return this.locators.tableRows.nth(rowIndex).locator('td').nth(4); // Amount is 5th column (index 4)
    }

    getDisabledDateElements() {
        return this.page.locator('span[aria-disabled="true"]');
    }

    // --- Helper for Date Selection ---

    // Formats date as dd/mm/yyyy
    formatDate(d: Date): string {
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const yyyy = d.getFullYear();
        return `${dd}/${mm}/${yyyy}`;
    }

    // Selects a date in the calendar. Handles previous month navigation if needed.
    // Assuming we are opening start or end date picker before calling this or inside this? 
    // The spec opens picker then clicks date.
    async pickDateFromCalendar(dateObj: Date, pickerLocator: Locator) {
        await pickerLocator.click();

        const today = new Date();
        // Simple logic for previous month click - can be improved
        if (dateObj.getMonth() !== today.getMonth() || dateObj.getFullYear() !== today.getFullYear()) {
            // Basic check: if target is older than current month, click previous. 
            // This loop is simple, assuming we don't go back too far or logic is handled by caller relative to today
            await this.locators.previousMonthButton.click();
        }

        const dateStr = this.formatDate(dateObj);
        // Selector strategy from spec: span[title="dd/mm/yyyy"]...
        // We construct the selector dynamically
        await this.page.locator(`span[title="${dateStr}"]:not([aria-disabled="true"])`)
            .first()
            .click();
    }


}
