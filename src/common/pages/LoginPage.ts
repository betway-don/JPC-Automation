import { Page, Locator } from '@playwright/test';
import { SafeActions } from '../actions/SafeActions';
import { BasePage } from './BasePage';
import { css, role, text, first, at } from '../locators/sel';

export class LoginPage extends BasePage {
    readonly locators: Record<string, Locator>;

    constructor(page: Page, safeActions: SafeActions) {
        super(page, safeActions);
        this.locators = this.build('login', {
            loginButton: first(role("button", {"name":"Login"})),
            hamburgerButton: first(role("button", {"name":"menu"})),
            hamburgerLoginButton: at(role("button", {"name":"Login"}), 1),
            registerButton: first(role("button", {"name":"Register"})),
            loginLinkInSignup: first(text("Already have an account?")),
            aviatorButton: first(role("button", {"name":"aviator Aviator"})),
            aviatorHolster: first(css("#aviator-holster")),
            aviatorLoginButton: first(css("#aviator-holster >> role=button[name=\"Login\"]")),
            usernameInput: first(role("textbox", {"name":"username"})),
            passwordInput: first(role("textbox", {"name":"password"})),
            mobileValidationMsg: first(text("Please enter a valid Mobile")),
            passwordValidationMsg: first(text("Provide Valid Password")),
        });
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

}
