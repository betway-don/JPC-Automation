import { Page, Locator } from '@playwright/test';
import { loadLocatorsFromExcel } from '../../global/utils/file-utils/excelReader';
import { getLocator } from '../../global/utils/file-utils/locatorResolver';
import { SafeActions } from '../actions/SafeActions';

const LOCATOR_URL = "src/global/utils/file-utils/locators.xlsx";

export class LimitsPage {
    readonly page: Page;
    readonly locators: Record<string, Locator>;

    constructor(page: Page, public readonly safeActions: SafeActions) {
        this.page = page;

        let configs = loadLocatorsFromExcel(LOCATOR_URL, "limits");

        if (!configs || Object.keys(configs).length === 0) {
            configs = this.getMockLocatorData();
        }

        this.locators = {
            depositButton: getLocator(this.page, configs["depositButton"]),
            responsibleGamingButton: getLocator(this.page, configs["responsibleGamingButton"]),
            limitsTab: getLocator(this.page, configs["limitsTab"]),
            limitsOptionsContainer: getLocator(this.page, configs["limitsOptionsContainer"]),

            // Daily Limits
            dailyLimitInput: getLocator(this.page, configs["dailyLimitInput"]),
            dailyLimitSetButton: getLocator(this.page, configs["dailyLimitSetButton"]),
            dailyLimitSection: getLocator(this.page, configs["dailyLimitSection"]),
            dailyAccruedBar: getLocator(this.page, configs["dailyAccruedBar"]),

            // Weekly Limits
            weeklyLimitInput: getLocator(this.page, configs["weeklyLimitInput"]),
            weeklyLimitSetButton: getLocator(this.page, configs["weeklyLimitSetButton"]),
            weeklyLimitSection: getLocator(this.page, configs["weeklyLimitSection"]),
            weeklyAccruedBar: getLocator(this.page, configs["weeklyAccruedBar"]),

            // Monthly Limits
            monthlyLimitInput: getLocator(this.page, configs["monthlyLimitInput"]),
            monthlyLimitSetButton: getLocator(this.page, configs["monthlyLimitSetButton"]),
            monthlyLimitSection: getLocator(this.page, configs["monthlyLimitSection"]),
            monthlyAccruedBar: getLocator(this.page, configs["monthlyAccruedBar"]),

            // Session Limits
            timeDropdown: getLocator(this.page, configs["timeDropdown"]),
            submitButton: getLocator(this.page, configs["submitButton"]),
            successPopup: getLocator(this.page, configs["successPopup"]),

            // Generic
            setLimitButton: getLocator(this.page, configs["setLimitButton"]),

            // New Locators for cooling off / disabled button (T15/T16)
            coolingOffContainer: getLocator(this.page, configs["coolingOffContainer"]),
            disabledCoolingOffButton: getLocator(this.page, configs["disabledCoolingOffButton"]),
        };
    }

    // --- Navigation ---
    async navigateToLimits() {
        await this.safeActions.safeClick('depositButton', this.locators.depositButton);
        await this.safeActions.safeClick('responsibleGamingButton', this.locators.responsibleGamingButton);
        await this.safeActions.safeClick('limitsTab', this.locators.limitsTab);
        await this.page.waitForTimeout(2000);
    }

    // --- Actions ---

    async clickDeposit() { // keep public for T1
        await this.safeActions.safeClick('depositButton', this.locators.depositButton);
    }

    async clickResponsibleGaming() {
        await this.safeActions.safeClick('responsibleGamingButton', this.locators.responsibleGamingButton);
    }

    async clickLimitsTab() {
        await this.safeActions.safeClick('limitsTab', this.locators.limitsTab);
    }

    async getCurrentLimitValue(locator: Locator, fallback: number = 0): Promise<number> {
        await locator.waitFor({ state: 'visible' });
        const rawText = await locator.getAttribute('aria-valuenow');
        let val = 0;
        if (rawText) {
            val = parseInt(rawText, 10) || 0;
        }
        if (val === 0 && fallback !== 0) {
            console.error(`Could not retrieve current limit via aria-valuenow. Using fallback value ${fallback}.`);
            return fallback;
        }
        return val;
    }

    async setDailyLimit(amount: string) {
        await this.locators.dailyLimitInput.click();
        await this.locators.dailyLimitInput.fill('');
        await this.locators.dailyLimitInput.type(amount);
        await this.safeActions.safeClick('dailyLimitSetButton', this.locators.dailyLimitSetButton);
    }

    async setWeeklyLimit(amount: string) {
        await this.locators.weeklyLimitInput.click();
        await this.locators.weeklyLimitInput.fill('');
        await this.locators.weeklyLimitInput.type(amount);
        await this.safeActions.safeClick('weeklyLimitSetButton', this.locators.weeklyLimitSetButton);
    }

    async setMonthlyLimit(amount: string) {
        await this.locators.monthlyLimitInput.click();
        await this.locators.monthlyLimitInput.fill('');
        await this.locators.monthlyLimitInput.type(amount);
        await this.safeActions.safeClick('monthlyLimitSetButton', this.locators.monthlyLimitSetButton);
    }

    async setSessionLimit(minutes: string) {
        if (await this.locators.timeDropdown.isVisible()) {
            await this.locators.timeDropdown.click();
            await this.page.getByRole('option', { name: minutes }).click();
            await this.safeActions.safeClick('submitButton', this.locators.submitButton);
        } else {
            // Fallback logic from raw spec
            const option = this.page.getByRole('option', { name: minutes });
            if (await option.isVisible()) {
                await option.click();
            } else {
                await this.page.getByText(`${minutes} Minutes`).click();
            }
            await this.safeActions.safeClick('submitButton', this.locators.submitButton);
        }
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
        await this.safeActions.safeHighlight('setLimitButton', this.locators.setLimitButton.first());
    }

    async highlightCoolingOffContainer() {
        await this.safeActions.safeHighlight('coolingOffContainer', this.locators.coolingOffContainer);
    }

    async highlightDisabledCoolingOffButton() {
        await this.safeActions.safeHighlight('disabledCoolingOffButton', this.locators.disabledCoolingOffButton);
    }


    // --- Mock Data ---
    protected getMockLocatorData(): Record<string, any> {
        return {
            "depositButton": { type: "role", value: "button", options: '{"name":"Deposit"}', nth: 0 },
            "responsibleGamingButton": { type: "role", value: "button", options: '{"name":"responsible gaming"}', nth: 0 },
            "limitsTab": { type: "text", value: "Limits", options: '{"exact":true}', nth: 0 },
            "limitsOptionsContainer": { type: "css", value: "div.px-2.relative", options: '{}', nth: 0 },

            "dailyLimitInput": { type: "css", value: "input[type='text'][data-pc-section='root']", options: '{}', nth: 0 },
            "weeklyLimitInput": { type: "css", value: "input[type='text'][data-pc-section='root']", options: '{}', nth: 1 },
            "monthlyLimitInput": { type: "css", value: "input[type='text'][data-pc-section='root']", options: '{}', nth: 2 },

            "dailyLimitSetButton": { type: "role", value: "button", options: '{"name":"Set Your Limit"}', nth: 0 },
            "weeklyLimitSetButton": { type: "role", value: "button", options: '{"name":"Set Your Limit"}', nth: 1 },
            "monthlyLimitSetButton": { type: "role", value: "button", options: '{"name":"Set Your Limit"}', nth: 2 },

            "setLimitButton": { type: "role", value: "button", options: '{"name":"Set Your Limit"}', nth: 0 },

            "dailyLimitSection": { type: "css", value: ".relative.flex.flex-col.gap-4.pt-4", options: '{}', nth: 0 },
            "weeklyLimitSection": { type: "css", value: ".relative.flex.flex-col.gap-4.pt-4", options: '{}', nth: 1 },
            "monthlyLimitSection": { type: "css", value: ".relative.flex.flex-col.gap-4.pt-4", options: '{}', nth: 2 },

            "dailyAccruedBar": { type: "css", value: "div.rounded-md.bg-layer-2.p-2", options: '{}', nth: 0 },
            "weeklyAccruedBar": { type: "css", value: "div.rounded-md.bg-layer-2.p-2", options: '{}', nth: 1 },
            "monthlyAccruedBar": { type: "css", value: "div.rounded-md.bg-layer-2.p-2", options: '{}', nth: 2 },

            "timeDropdown": { type: "role", value: "combobox", options: '{"name":"Time"}', nth: 0 },
            "submitButton": { type: "role", value: "button", options: '{"name":"Submit"}', nth: 0 },
            "successPopup": { type: "css", value: "#pv_id_1_1_1_9", options: '{}', nth: 0 },

            // New locators to remove hardcoding
            "coolingOffContainer": { type: "css", value: "div.flex.gap-4", options: '{}', nth: 0 },
            // "disabledCoolingOffButton" was `locator('button').nth(1)` of the first container.
            // But we can define it relative to the container in logic, or here if we use a combined selector.
            // Using a combined CSS selector for robustness if possible, or Xpath.
            // "div.flex.gap-4 >> button >> nth=1"
            "disabledCoolingOffButton": { type: "xpath", value: "(//div[contains(@class,'flex gap-4')])[1]//button", options: '{}', nth: 1 },
        };
    }
}
