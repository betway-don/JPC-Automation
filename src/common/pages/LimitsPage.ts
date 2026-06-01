import { Page, Locator } from '@playwright/test';
import { loadLocatorsFromJson } from '../../global/utils/file-utils/jsonLocatorLoader';
import { getLocator } from '../../global/utils/file-utils/locatorResolver';
import { SafeActions } from '../actions/SafeActions';

export class LimitsPage {
    readonly page: Page;
    readonly locators: Record<string, Locator>;

    constructor(page: Page, public readonly safeActions: SafeActions) {
        this.page = page;
        const configs = loadLocatorsFromJson('limits');

        this.locators = {
            depositButton: getLocator(this.page, configs["depositButton"]),
            responsibleGamingButton: getLocator(this.page, configs["responsibleGamingButton"]),
            limitsTab: getLocator(this.page, configs["limitsTab"]),
            limitsOptionsContainer: getLocator(this.page, configs["limitsOptionsContainer"]),

            // Daily Limits
            dailyLimitSection: getLocator(this.page, configs["dailyLimitSection"]),
            dailyLimitInput: getLocator(this.page, configs["dailyLimitInput"]),
            dailyLimitSetButton: getLocator(this.page, configs["dailyLimitSetButton"]),
            dailyAccruedBar: getLocator(this.page, configs["dailyAccruedBar"]),

            // Weekly Limits
            weeklyLimitSection: getLocator(this.page, configs["weeklyLimitSection"]),
            weeklyLimitInput: getLocator(this.page, configs["weeklyLimitInput"]),
            weeklyLimitSetButton: getLocator(this.page, configs["weeklyLimitSetButton"]),
            weeklyAccruedBar: getLocator(this.page, configs["weeklyAccruedBar"]),

            // Monthly Limits
            monthlyLimitSection: getLocator(this.page, configs["monthlyLimitSection"]),
            monthlyLimitInput: getLocator(this.page, configs["monthlyLimitInput"]),
            monthlyLimitSetButton: getLocator(this.page, configs["monthlyLimitSetButton"]),
            monthlyAccruedBar: getLocator(this.page, configs["monthlyAccruedBar"]),

            // Cooling Off
            coolingOffContainer: getLocator(this.page, configs["coolingOffContainer"]),
            disabledCoolingOffButton: getLocator(this.page, configs["disabledCoolingOffButton"]),

            // Session Limits
            sessionSection: getLocator(this.page, configs["sessionSection"]),
            timeDropdown: getLocator(this.page, configs["timeDropdown"]),
            submitButton: getLocator(this.page, configs["submitButton"]),
            successPopup: getLocator(this.page, configs["successPopup"]),
        };
    }

    // --- Navigation ---
    async navigateToLimits() {
        if (!await this.locators.limitsTab.isVisible()) {
            await this.safeActions.safeClick('depositButton', this.locators.depositButton, { timeout: 60000 });
            await this.safeActions.safeClick('responsibleGamingButton', this.locators.responsibleGamingButton, { timeout: 60000 });
        }
        await this.safeActions.safeClick('limitsTab', this.locators.limitsTab, { timeout: 60000 });
        // Wait for the daily input to be visible to ensure page load
        await this.locators.dailyLimitInput.waitFor({ state: 'visible', timeout: 60000 });
    }

    // --- Actions ---

    async clickDeposit() {
        await this.safeActions.safeClick('depositButton', this.locators.depositButton, { timeout: 60000 });
    }

    async clickResponsibleGaming() {
        await this.safeActions.safeClick('responsibleGamingButton', this.locators.responsibleGamingButton, { timeout: 60000 });
    }

    async clickLimitsTab() {
        await this.safeActions.safeClick('limitsTab', this.locators.limitsTab, { timeout: 60000 });
    }

    async getCurrentLimitValue(locator: Locator, fallback: number = 0): Promise<number> {
        await locator.waitFor({ state: 'visible' });
        // Try getting value from input value attribute first (often more accurate for inputs)
        const inputValue = await locator.inputValue();
        if (inputValue) {
            return parseInt(inputValue, 10);
        }

        const rawText = await locator.getAttribute('aria-valuenow');
        let val = 0;
        if (rawText) {
            val = parseInt(rawText, 10) || 0;
        }
        if (val === 0 && fallback !== 0) {
            console.log(`Could not retrieve current limit. Using fallback value ${fallback}.`);
            return fallback;
        }
        return val;
    }

    /**
     * Clears input using keyboard press to ensure React/Angular events trigger
     */
    async clearAndType(locator: Locator, amount: string) {
        await locator.click();
        // Press Control+A (or Meta+A for Mac) then Delete to clear existing text reliably
        // This handles cases where .fill() doesn't trigger the 'change' event correctly
        const isMac = process.platform === 'darwin';
        await this.page.keyboard.press(isMac ? 'Meta+A' : 'Control+A');
        await this.page.keyboard.press('Backspace');
        await locator.fill(amount);
    }

    async setDailyLimit(amount: string) {
        await this.clearAndType(this.locators.dailyLimitInput, amount);
        await this.safeActions.safeClick('dailyLimitSetButton', this.locators.dailyLimitSetButton, { timeout: 60000 });
    }

    async setWeeklyLimit(amount: string) {
        await this.clearAndType(this.locators.weeklyLimitInput, amount);
        await this.safeActions.safeClick('weeklyLimitSetButton', this.locators.weeklyLimitSetButton, { timeout: 60000 });
    }

    async setMonthlyLimit(amount: string) {
        await this.clearAndType(this.locators.monthlyLimitInput, amount);
        await this.safeActions.safeClick('monthlyLimitSetButton', this.locators.monthlyLimitSetButton, { timeout: 60000 });
    }

    async setSessionLimit(minutes: string) {
        await this.locators.sessionSection.scrollIntoViewIfNeeded();
        await this.locators.timeDropdown.click({ timeout: 60000 });
        await this.page.getByRole('option', { name: minutes }).click({ timeout: 60000 });
        await this.safeActions.safeClick('submitButton', this.locators.submitButton, { timeout: 60000 });
    }

    // --- Highlights ---

    async highlightLimitsOption() {
        await this.safeActions.safeHighlight('limitsOptionsContainer', this.locators.limitsOptionsContainer);
    }

    async highlightDailyLimitInput() {
        await this.safeActions.safeHighlight('dailyLimitInput', this.locators.dailyLimitInput);
    }

    async highlightWeeklyLimitInput() {
        await this.safeActions.safeHighlight('weeklyLimitInput', this.locators.weeklyLimitInput);
    }

    async highlightMonthlyLimitInput() {
        await this.safeActions.safeHighlight('monthlyLimitInput', this.locators.monthlyLimitInput);
    }

    async highlightDailySection() {
        await this.safeActions.safeHighlight('dailyLimitSection', this.locators.dailyLimitSection);
    }

    async highlightWeeklySection() {
        await this.safeActions.safeHighlight('weeklyLimitSection', this.locators.weeklyLimitSection);
    }

    async highlightMonthlySection() {
        await this.safeActions.safeHighlight('monthlyLimitSection', this.locators.monthlyLimitSection);
    }

    async highlightAccruedBars() {
        await this.safeActions.safeHighlight('dailyAccruedBar', this.locators.dailyAccruedBar);
        await this.safeActions.safeHighlight('weeklyAccruedBar', this.locators.weeklyAccruedBar);
        await this.safeActions.safeHighlight('monthlyAccruedBar', this.locators.monthlyAccruedBar);
    }

    async highlightFirstAccruedBar() {
        await this.safeActions.safeHighlight('dailyAccruedBar', this.locators.dailyAccruedBar);
    }

    async highlightSuccessPopup() {
        await this.safeActions.safeHighlight('successPopup', this.locators.successPopup);
    }

    async highlightSetLimitButtons() {
        await this.safeActions.safeHighlight('monthlyLimitSetButton', this.locators.monthlyLimitSetButton);
    }

    async highlightCoolingOffContainer() {
        await this.safeActions.safeHighlight('coolingOffContainer', this.locators.coolingOffContainer);
    }

    async highlightDisabledCoolingOffButton() {
        await this.safeActions.safeHighlight('disabledCoolingOffButton', this.locators.disabledCoolingOffButton);
    }


}