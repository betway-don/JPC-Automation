import { Page, Locator } from '@playwright/test';
import { loadLocatorsFromJson } from '../../global/utils/file-utils/jsonLocatorLoader';
import { getLocator } from '../../global/utils/file-utils/locatorResolver';
import { SafeActions } from '../actions/SafeActions';

export class UpdatePasswordPage {
    readonly page: Page;
    readonly locators: Record<string, Locator>;

    constructor(page: Page, public readonly safeActions: SafeActions) {
        this.page = page;
        const configs = loadLocatorsFromJson('updatePassword');

        this.locators = {
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

}
