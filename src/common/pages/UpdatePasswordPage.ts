import { Page, Locator } from '@playwright/test';
import { loadLocatorsFromExcel } from '../../global/utils/file-utils/excelReader';
import { getLocator } from '../../global/utils/file-utils/locatorResolver';
import { SafeActions } from '../actions/SafeActions';

const LOCATOR_URL = "src/global/utils/file-utils/locators.xlsx";

export class UpdatePasswordPage {
    readonly page: Page;
    readonly locators: Record<string, Locator>;

    constructor(page: Page, public readonly safeActions: SafeActions) {
        this.page = page;

        try {
            let configs = loadLocatorsFromExcel(LOCATOR_URL, "updatePassword");

            if (!configs || Object.keys(configs).length === 0) {
                configs = this.getMockLocatorData();
            }
            this.locators = this.initializeLocators(configs);
        } catch (error) {
            console.warn("[UpdatePasswordPage] Failed to load locators from Excel. Using mock data.", error);
            this.locators = this.initializeLocators(this.getMockLocatorData());
        }
    }

    private initializeLocators(configs: Record<string, any>): Record<string, Locator> {
        return {
            depositButton: getLocator(this.page, configs["depositButton"]),
            updatePasswordButton: getLocator(this.page, configs["updatePasswordButton"]),

            // Elements
            sectionHeader: getLocator(this.page, configs["sectionHeader"]),
            passwordValidityText: getLocator(this.page, configs["passwordValidityText"]),
            passwordInput: getLocator(this.page, configs["passwordInput"]),
            confirmPasswordInput: getLocator(this.page, configs["confirmPasswordInput"]),
            eyeToggle: getLocator(this.page, configs["eyeToggle"]),

            // Errors / Success Messages
            provideValidPasswordError: getLocator(this.page, configs["provideValidPasswordError"]),
            mismatchError: getLocator(this.page, configs["mismatchError"]),
            successMatchMessage: getLocator(this.page, configs["successMatchMessage"]),
            oldPasswordError: getLocator(this.page, configs["oldPasswordError"]),

            // Buttons
            updatePasswordSubmitButton: getLocator(this.page, configs["updatePasswordSubmitButton"]),
            updatePasswordDisabledButton: getLocator(this.page, configs["updatePasswordDisabledButton"]),
        };
    }

    // --- Navigation ---
    async navigateToUpdatePassword() {
        await this.safeActions.safeClick('depositButton', this.locators.depositButton);
        await this.safeActions.safeClick('updatePasswordButton', this.locators.updatePasswordButton);
        await this.page.waitForTimeout(2000);
    }

    // --- Actions ---
    async clickPasswordInput() {
        await this.locators.passwordInput.click();
    }

    async fillPassword(password: string) {
        await this.locators.passwordInput.fill('');
        await this.locators.passwordInput.type(password);
    }

    async clickConfirmPasswordInput() {
        await this.locators.confirmPasswordInput.click();
    }

    async fillConfirmPassword(password: string) {
        await this.locators.confirmPasswordInput.fill('');
        await this.locators.confirmPasswordInput.type(password);
    }

    async clickValidityText() {
        await this.locators.passwordValidityText.click();
    }

    async toggleEyeIcon() {
        await this.locators.eyeToggle.click();
    }

    async submitUpdate() {
        await this.safeActions.safeClick('updatePasswordSubmitButton', this.locators.updatePasswordSubmitButton);
    }

    // --- Highlights ---
    async highlightSectionHeader() {
        await this.safeActions.safeHighlight('sectionHeader', this.locators.sectionHeader);
    }

    async highlightValidityText() {
        await this.safeActions.safeHighlight('passwordValidityText', this.locators.passwordValidityText);
    }

    async highlightProvideValidPasswordError() {
        await this.safeActions.safeHighlight('provideValidPasswordError', this.locators.provideValidPasswordError);
    }

    async highlightMismatchError() {
        await this.safeActions.safeHighlight('mismatchError', this.locators.mismatchError);
    }

    async highlightSuccessMatchMessage() {
        await this.safeActions.safeHighlight('successMatchMessage', this.locators.successMatchMessage);
    }

    async highlightDisabledButton() {
        await this.safeActions.safeHighlight('updatePasswordDisabledButton', this.locators.updatePasswordDisabledButton);
    }

    async highlightSubmitButton() {
        await this.safeActions.safeHighlight('updatePasswordSubmitButton', this.locators.updatePasswordSubmitButton);
    }

    async highlightPasswordInput() {
        await this.safeActions.safeHighlight('passwordInput', this.locators.passwordInput);
    }

    async highlightOldPasswordError() {
        await this.safeActions.safeHighlight('oldPasswordError', this.locators.oldPasswordError);
    }

    // --- Mock Data ---
    protected getMockLocatorData(): Record<string, any> {
        return {
            "depositButton": { type: "role", value: "button", options: '{"name":"Deposit"}', nth: 0 },
            "updatePasswordButton": { type: "role", value: "button", options: '{"name":"update password"}', nth: 0 },

            "sectionHeader": { type: "css", value: "div[class='text-base-priority rounded-lg sm:py-1 mx-auto']", options: '{}', nth: 0 },
            "passwordValidityText": { type: "text", value: "Password Validity", options: '{}', nth: 0 },

            "passwordInput": { type: "role", value: "textbox", options: '{"name":"password", "exact":true}', nth: 0 },
            "confirmPasswordInput": { type: "role", value: "textbox", options: '{"name":"confirmPassword"}', nth: 0 },

            "eyeToggle": { type: "css", value: "#password-label svg", options: '{}', nth: 0 },

            "provideValidPasswordError": { type: "text", value: "Provide Valid Password", options: '{}', nth: 0 },
            "mismatchError": { type: "text", value: "passwords do not match.", options: '{}', nth: 0 },
            "successMatchMessage": { type: "text", value: "Passwords must match and be", options: '{}', nth: 0 },

            "oldPasswordError": { type: "css", value: "div.flex-col.leading-4", options: '{}', nth: 0 },

            "updatePasswordSubmitButton": { type: "role", value: "button", options: '{"name":"Update Password", "exact":true}', nth: 0 },
            "updatePasswordDisabledButton": { type: "text", value: "UPDATE PASSWORD", options: '{}', nth: 2 },
        };
    }
}
