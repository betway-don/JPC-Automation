import { Page, Locator } from '@playwright/test';
import { loadLocatorsFromExcel } from '../../global/utils/file-utils/excelReader';
import { getLocator } from '../../global/utils/file-utils/locatorResolver';
import { SafeActions } from '../actions/SafeActions';

const LOCATOR_URL = "src/global/utils/file-utils/locators.xlsx";

export class LoginPage {
    readonly page: Page;
    readonly locators: Record<string, Locator>;

    constructor(page: Page, private safeActions: SafeActions) {
        this.page = page;

        let configs = loadLocatorsFromExcel(LOCATOR_URL, "login");

        // If Excel loading fails or is empty, use the mock data
        if (!configs || Object.keys(configs).length === 0) {
            console.warn("[LoginPage POM] Excel locators not found or empty. Using internal mock data.");
            configs = this.getMockLocatorData();
        }

        this.locators = {
            loginButton: getLocator(this.page, configs["loginButton"]),
            hamburgerButton: getLocator(this.page, configs["hamburgerButton"]),
            hamburgerLoginButton: getLocator(this.page, configs["hamburgerLoginButton"]),
            registerButton: getLocator(this.page, configs["registerButton"]),
            loginLinkInSignup: getLocator(this.page, configs["loginLinkInSignup"]),
            aviatorButton: getLocator(this.page, configs["aviatorButton"]),
            aviatorHolster: getLocator(this.page, configs["aviatorHolster"]),
            aviatorLoginButton: getLocator(this.page, configs["aviatorLoginButton"]),
            usernameInput: getLocator(this.page, configs["usernameInput"]),
            passwordInput: getLocator(this.page, configs["passwordInput"]),
            mobileValidationMsg: getLocator(this.page, configs["mobileValidationMsg"]),
            passwordValidationMsg: getLocator(this.page, configs["passwordValidationMsg"]),
        };
    }

    // --- Navigation ---
    async goto(url?: string) {
        await this.page.goto(url || '/', { waitUntil: 'domcontentloaded' });
    }

    // --- Actions ---

    async clickLogin() {
        await this.safeActions.safeClick('loginButton', this.locators.loginButton);
    }

    async clickHamburgerMenu() {
        await this.safeActions.safeClick('hamburgerButton', this.locators.hamburgerButton);
    }

    async clickHamburgerLogin() {
        await this.safeActions.safeClick('hamburgerLoginButton', this.locators.hamburgerLoginButton);
    }

    async clickRegister() {
        await this.safeActions.safeClick('registerButton', this.locators.registerButton);
    }

    async clickLoginLinkInSignup() {
        await this.safeActions.safeClick('loginLinkInSignup', this.locators.loginLinkInSignup);
    }

    async clickAviator() {
        await this.safeActions.safeClick('aviatorButton', this.locators.aviatorButton);
        // Wait for the holster to appear as per your raw spec
        await this.locators.aviatorHolster.waitFor({ state: 'visible' });
    }

    async clickAviatorLogin() {
        await this.safeActions.safeClick('aviatorLoginButton', this.locators.aviatorLoginButton);
    }

    async performLogin(mobile: string, pass: string) {
        await this.safeActions.safeFill('usernameInput', this.locators.usernameInput, mobile);
        await this.safeActions.safeFill('passwordInput', this.locators.passwordInput, pass);
        // Press Enter as per raw spec
        await this.locators.passwordInput.press('Enter');
        await this.page.waitForLoadState('domcontentloaded');
    }

    async triggerValidation(mobile: string) {
        await this.safeActions.safeFill('usernameInput', this.locators.usernameInput, mobile);
        // Press Tab to trigger validation
        await this.locators.usernameInput.press('Tab');
    }

    async triggerPasswordValidation(mobile: string, pass: string) {
        await this.safeActions.safeFill('usernameInput', this.locators.usernameInput, mobile);
        await this.safeActions.safeFill('passwordInput', this.locators.passwordInput, pass);
    }

    // --- Highlights (For Screenshots) ---

    async highlightLoginButton() {
        await this.safeActions.safeHighlight('loginButton', this.locators.loginButton);
    }

    async highlightHamburgerLogin() {
        await this.safeActions.safeHighlight('hamburgerLoginButton', this.locators.hamburgerLoginButton);
    }

    async highlightLoginLinkInSignup() {
        await this.safeActions.safeHighlight('loginLinkInSignup', this.locators.loginLinkInSignup);
    }

    async highlightAviatorLogin() {
        await this.safeActions.safeHighlight('aviatorLoginButton', this.locators.aviatorLoginButton);
    }

    async highlightMobileValidation() {
        await this.safeActions.safeHighlight('mobileValidationMsg', this.locators.mobileValidationMsg);
    }

    async highlightPasswordValidation() {
        await this.safeActions.safeHighlight('passwordValidationMsg', this.locators.passwordValidationMsg);
        await this.highlightLoginButton();
    }

    async highlightUsername() {
        await this.safeActions.safeHighlight('usernameInput', this.locators.usernameInput);
    }

    // --- Mock Data (Matches your raw spec selectors) ---
    private getMockLocatorData(): Record<string, any> {
        return {
            "loginButton": { type: "role", value: "button", options: '{"name":"Login"}', nth: 0 },
            "hamburgerButton": { type: "role", value: "button", options: '{"name":"menu"}', nth: 0 },
            "hamburgerLoginButton": { type: "xpath", value: "//aside[@role='complementary']//button[normalize-space()='Login']", options: '{}', nth: 0 },
            "registerButton": { type: "role", value: "button", options: '{"name":"Register"}', nth: 0 },
            "loginLinkInSignup": { type: "text", value: "Already have an account?", options: '{}', nth: 0 },
            "aviatorButton": { type: "role", value: "button", options: '{"name":"aviator Aviator"}', nth: 0 },
            "aviatorHolster": { type: "css", value: "#aviator-holster", options: '{}', nth: 0 },
            "aviatorLoginButton": { type: "xpath", value: "//*[@id='aviator-holster']//button[normalize-space()='Login']", options: '{}', nth: 0 },
            "usernameInput": { type: "role", value: "textbox", options: '{"name":"username"}', nth: 0 },
            "passwordInput": { type: "role", value: "textbox", options: '{"name":"Enter Password"}', nth: 0 },
            "mobileValidationMsg": { type: "text", value: "Please enter a valid Mobile", options: '{}', nth: 0 },
            "passwordValidationMsg": { type: "text", value: "Provide Valid Password", options: '{}', nth: 0 },
        };
    }
}
