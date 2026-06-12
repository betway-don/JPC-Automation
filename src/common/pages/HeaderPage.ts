import { Page, Locator } from '@playwright/test';
import { loadLocatorsFromJson } from '../../global/utils/file-utils/jsonLocatorLoader';
import { getLocator } from '../../global/utils/file-utils/locatorResolver';
import { SafeActions } from '../actions/SafeActions';
import { BasePage } from './BasePage';

export class HeaderPage extends BasePage {
    readonly locators: Record<string, Locator>;

    constructor(page: Page, safeActions: SafeActions) {
        super(page, safeActions);
        const configs = loadLocatorsFromJson('header');

        this.locators = {
            menuButton: getLocator(this.page, configs["menuButton"]),
            logoLink: getLocator(this.page, configs["logoLink"]),
            searchButton: getLocator(this.page, configs["searchButton"]),
            searchInput: getLocator(this.page, configs["searchInput"]),
            actualSearchInput: getLocator(this.page, configs["actualSearchInput"]),
            searchModal: getLocator(this.page, configs["searchModal"]),
            searchCloseModal: getLocator(this.page, configs["searchCloseModal"]),
            signUpModal: getLocator(this.page, configs["signUpModal"]),
            loginCTA: getLocator(this.page, configs["loginCTA"]),
            registerCTA: getLocator(this.page, configs["registerCTA"]),
            liveChatIcon: getLocator(this.page, configs["liveChatIcon"]),
            themeToggle: getLocator(this.page, configs["themeToggle"]),
            profileIcon: getLocator(this.page, configs["profileIcon"]),
            notificationIcon: getLocator(this.page, configs["notificationIcon"]),
            depositCTA: getLocator(this.page, configs["depositCTA"]),
            accountBalancesDialog: getLocator(this.page, configs["accountBalancesDialog"]),
            usernameInput: getLocator(this.page, configs["usernameInput"]),
            passwordInput: getLocator(this.page, configs["passwordInput"]),
            submitLoginButton: getLocator(this.page, configs["submitLoginButton"]),
        };
    }

    async navigateTo(url?: string) {
        await this.page.goto(url || '/', { waitUntil: 'domcontentloaded' });
    }

    async clickMenu() {
        await this.safeActions.safeClick('menuButton', this.locators.menuButton);
    }

    async clickLogo() {
        await this.safeActions.safeClick('logoLink', this.locators.logoLink);
    }

    async searchFor(term: string) {
        await this.safeActions.safeClick('searchButton', this.locators.searchButton);
        await this.safeActions.safeFill('actualSearchInput', this.locators.actualSearchInput, term);
        await this.locators.actualSearchInput.press('Enter');
    }

    async clickLoginCTA() {
        await this.safeActions.safeClick('loginCTA', this.locators.loginCTA);
    }

    async clickRegisterCTA() {
        await this.safeActions.safeClick('registerCTA', this.locators.registerCTA);
    }

    async clickLiveChat() {
        await this.safeActions.safeClick('liveChatIcon', this.locators.liveChatIcon);
    }

    async toggleTheme() {
        const isDark = await this.page.evaluate(() => document.documentElement.classList.contains('dark'));
        if (isDark) {
            await this.page.getByRole('button', { name: 'light-mode' }).click();
        } else {
            await this.page.getByRole('button', { name: 'dark-mode' }).click();
        }
    }

    async clickProfile() {
        await this.safeActions.safeClick('profileIcon', this.locators.profileIcon);
    }

    async clickNotification() {
        await this.safeActions.safeClick('notificationIcon', this.locators.notificationIcon);
    }

    async clickDeposit() {
        await this.safeActions.safeClick('depositCTA', this.locators.depositCTA);
    }

    async login(mobile: string, pass: string) {
        await this.clickLoginCTA();
        await this.safeActions.safeFill('usernameInput', this.locators.usernameInput, mobile);
        await this.safeActions.safeFill('passwordInput', this.locators.passwordInput, pass);
        await this.safeActions.safeClick('submitLoginButton', this.locators.submitLoginButton);
        // fully verified accounts show the Deposit CTA; partial accounts show "Complete account" instead.
        // Wait for whichever confirms the session is established.
        await Promise.race([
            this.locators.depositCTA.waitFor({ state: 'visible', timeout: 20000 }),
            this.page.getByText('Complete account', { exact: false }).first().waitFor({ state: 'visible', timeout: 20000 }),
        ]);
    }

    // Navigation tabs
    // ─── header element accessors (selectors stay in the Page Object) ──────────
    get siteHeader(): Locator { return this.page.locator('#site-header'); }
    get htmlRoot(): Locator { return this.page.locator('html'); }
    get hamburgerCloseButton(): Locator { return this.page.locator("button[element-name='hamburger-menu-close']"); }
    get liveChatFrame(): Locator { return this.page.locator('#genesys-mxg-container-frame'); }
    /** Active-state wrapper <a> for a nav tab, e.g. navItem('spingames'). */
    navItem(id: string): Locator { return this.page.locator(`#${id}-nav-item`); }
    /** Account Options dialog + its banking iframe (reached from the wallet Deposit CTA). */
    get accountOptionsDialog(): Locator { return this.page.locator("[role='dialog'][aria-labelledby^='Account Options']"); }
    get bankingFrame(): Locator { return this.page.locator("iframe[id^='banking_frame']"); }
    /** Deposit button inside the wallet/account-balances dropdown. */
    get walletDepositButton(): Locator { return this.locators.accountBalancesDialog.getByRole('button', { name: /deposit/i }); }
    /** Notifications drawer markers. */
    get notificationsTitle(): Locator { return this.page.getByText('Notifications', { exact: true }).first(); }
    get notificationsMarketingTab(): Locator { return this.page.getByText('Marketing', { exact: true }).first(); }
    /** Profile drawer markers. */
    get welcomeGreeting(): Locator { return this.page.getByText(/Welcome,/).first(); }
    get accountNumberText(): Locator { return this.page.getByText(/Account No:\s*\d{5,}/).first(); }
    /** Post-signup account-completion / verification surface (welcome-flow or any dialog). */
    get verificationOrDialog(): Locator {
        return this.page.getByText(/jackpot city verification/i).or(this.page.locator("[role='dialog']").first());
    }

    getNavTab(name: string) {
        return this.page.locator(`button[element-name="page-link-${name}"]`);
    }

    async clickNavTab(name: string) {
        await this.getNavTab(name).click();
    }

    // Search modal
    async openSearch() {
        await this.safeActions.safeClick('searchInput', this.locators.searchInput);
    }

    async closeSearch() {
        await this.safeActions.safeClick('searchCloseModal', this.locators.searchCloseModal);
    }

    async typeSearch(term: string) {
        await this.safeActions.safeFill('actualSearchInput', this.locators.actualSearchInput, term);
    }

    getSearchResultCard() {
        return this.locators.searchModal.locator('a.game-card').first();
    }

    getSearchNoResults() {
        return this.locators.searchModal.getByText('No results');
    }

    // Wallet
    async openWalletDropdown() {
        await this.clickDeposit();
    }

    // Partial account
    getCompleteAccountPrompt() {
        // partial accounts show a "Complete account" prompt in the header
        return this.page.getByText(/complete account/i).first();
    }

    // Highlight methods
    async highlightElement(key: string) {
        if (this.locators[key]) {
            await this.safeActions.safeHighlight(key, this.locators[key]);
        } else {
            console.error(`Locator ${key} not found`);
        }
    }

}
