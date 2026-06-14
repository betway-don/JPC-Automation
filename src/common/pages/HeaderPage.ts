import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { SafeActions } from '../actions/SafeActions';
import { css, id, role, text, first, or } from '../locators/sel';

/**
 * Header / top-bar Page Object.
 * Every header selector lives in the `header` group below — the single source of truth. Region
 * differences are supplied in regions/<R>/locators.ts and merged automatically by BasePage.build().
 */
export class HeaderPage extends BasePage {
    readonly locators: Record<string, Locator>;

    constructor(page: Page, safeActions: SafeActions) {
        super(page, safeActions);
        this.locators = this.build('header', {
            menuButton: first(role('button', { name: 'menu' })),
            logoLink: first(role('link', { name: 'Jackpotcity', exact: true })),
            searchButton: first(text('Search games')),
            searchInput: first(css('[element-name="nav-bar-search"]')),
            actualSearchInput: first(css('#search')),
            loginCTA: first(role('button', { name: 'Login' })),
            registerCTA: first(role('button', { name: 'Register' })),
            liveChatIcon: first(role('button', { name: 'Live Chat' })),
            themeToggle: first(css('button[aria-label="light-mode"], button[aria-label="dark-mode"]')),
            profileIcon: first(role('button', { name: 'account', exact: true })),
            notificationIcon: first(role('button', { name: 'notification-panel' })),
            depositCTA: first(css('div:has-text("Cash") button:has(svg path[d="m19.5 8.25-7.5 7.5-7.5-7.5"])')),
            accountBalancesDialog: first(css('div[role="dialog"]:has-text("Account Balances")')),
            usernameInput: first(role('textbox', { name: 'username' })),
            passwordInput: first(role('textbox', { name: 'password' })),
            submitLoginButton: first(role('button', { name: 'Submit' })),
            searchModal: first(css('div[role="dialog"][aria-labelledby="Search games-modal-title"]')),
            searchCloseModal: first(css('button[element-name="close-modal"]')),
            signUpModal: first(css('div[role="dialog"][aria-labelledby="Sign Up-modal-title"]')),
            // ── folded-in accessors (previously scattered inline getters) ──
            siteHeader: id('site-header'),
            htmlRoot: css('html'),
            hamburgerCloseButton: css("button[element-name='hamburger-menu-close']"),
            liveChatFrame: id('genesys-mxg-container-frame'),
            accountOptionsDialog: css("[role='dialog'][aria-labelledby^='Account Options']"),
            bankingFrame: css("iframe[id^='banking_frame']"),
            notificationsTitle: first(text('Notifications', { exact: true })),
            notificationsMarketingTab: first(text('Marketing', { exact: true })),
            welcomeGreeting: first(text(/Welcome,/)),
            accountNumberText: first(text(/Account No:\s*\d{5,}/)),
            verificationOrDialog: or(text(/jackpot city verification/i), first(css("[role='dialog']"))),
        });
    }

    // ─── semantic accessors (thin getters over the single-source `locators` map) ──
    get siteHeader(): Locator { return this.locators.siteHeader; }
    get htmlRoot(): Locator { return this.locators.htmlRoot; }
    get hamburgerCloseButton(): Locator { return this.locators.hamburgerCloseButton; }
    get liveChatFrame(): Locator { return this.locators.liveChatFrame; }
    get accountOptionsDialog(): Locator { return this.locators.accountOptionsDialog; }
    get bankingFrame(): Locator { return this.locators.bankingFrame; }
    get notificationsTitle(): Locator { return this.locators.notificationsTitle; }
    get notificationsMarketingTab(): Locator { return this.locators.notificationsMarketingTab; }
    get welcomeGreeting(): Locator { return this.locators.welcomeGreeting; }
    get accountNumberText(): Locator { return this.locators.accountNumberText; }
    get verificationOrDialog(): Locator { return this.locators.verificationOrDialog; }

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
        await Promise.race([
            this.locators.depositCTA.waitFor({ state: 'visible', timeout: 20000 }),
            this.page.getByText('Complete account', { exact: false }).first().waitFor({ state: 'visible', timeout: 20000 }),
        ]);
    }

    // ─── parameterised / composed accessors (depend on a runtime value) ────────
    /** Active-state wrapper <a> for a nav tab, e.g. navItem('spingames'). */
    navItem(navId: string): Locator { return this.page.locator(`#${navId}-nav-item`); }
    /** Header nav button by category, e.g. getNavTab('spingames'). */
    getNavTab(name: string): Locator { return this.page.locator(`button[element-name="page-link-${name}"]`); }
    async clickNavTab(name: string) { await this.getNavTab(name).click(); }
    /** Deposit button inside the wallet/account-balances dropdown. */
    get walletDepositButton(): Locator { return this.locators.accountBalancesDialog.getByRole('button', { name: /deposit/i }); }
    getSearchResultCard(): Locator { return this.locators.searchModal.locator('a.game-card').first(); }
    getSearchNoResults(): Locator { return this.locators.searchModal.getByText('No results'); }
    getCompleteAccountPrompt(): Locator { return this.page.getByText(/complete account/i).first(); }

    // ─── search modal helpers ──────────────────────────────────────────────────
    async openSearch() { await this.safeActions.safeClick('searchInput', this.locators.searchInput); }
    async closeSearch() { await this.safeActions.safeClick('searchCloseModal', this.locators.searchCloseModal); }
    async typeSearch(term: string) { await this.safeActions.safeFill('actualSearchInput', this.locators.actualSearchInput, term); }
    async openWalletDropdown() { await this.clickDeposit(); }

    async highlightElement(key: string) {
        if (this.locators[key]) {
            await this.safeActions.safeHighlight(key, this.locators[key]);
        } else {
            console.error(`Locator ${key} not found`);
        }
    }

    // ══════════════════════════════════════════════════════════════════════════
    //  Intent API — what tests speak to.
    // ══════════════════════════════════════════════════════════════════════════
    /** Region-tolerant "currency amount" matcher (R / GHS / ₵ / MWK / TSh …). */
    private static readonly CURRENCY = /(R|GHS|GH₵|₵|MWK|TZS|TSh)\s*[\d,]+[.,]\d{2}/i;

    // ── semantic element accessors ──────────────────────────────────────────────
    get menuButton(): Locator { return this.locators.menuButton; }
    get logo(): Locator { return this.locators.logoLink; }
    get searchBar(): Locator { return this.locators.searchInput; }
    get searchModal(): Locator { return this.locators.searchModal; }
    get loginButton(): Locator { return this.locators.loginCTA; }
    get signUpButton(): Locator { return this.locators.registerCTA; }
    get liveChatIcon(): Locator { return this.locators.liveChatIcon; }
    get depositButton(): Locator { return this.locators.depositCTA; }
    get notificationIcon(): Locator { return this.locators.notificationIcon; }
    get profileIcon(): Locator { return this.locators.profileIcon; }
    get usernameInput(): Locator { return this.locators.usernameInput; }
    get signUpModal(): Locator { return this.locators.signUpModal; }
    get balancesDialog(): Locator { return this.locators.accountBalancesDialog; }
    get firstSearchResult(): Locator { return this.getSearchResultCard(); }
    get completeAccountPrompt(): Locator { return this.getCompleteAccountPrompt(); }
    navTab(name: string): Locator { return this.getNavTab(name); }

    // ── actions (absorb waits) ──────────────────────────────────────────────────
    async openMenu(): Promise<void> { await this.clickMenu(); }
    async openNavTab(name: string): Promise<void> { await this.clickNavTab(name); }
    /** Open search, type a query, and wait for the first result to render. */
    async search(query: string): Promise<void> {
        await this.openSearch();
        await this.searchModal.waitFor({ state: 'visible' });
        await this.typeSearch(query);
        await this.firstSearchResult.waitFor({ state: 'visible' }).catch(() => { });
    }
    /** Open the wallet dropdown and click its Deposit button. */
    async openDepositFromWallet(): Promise<void> {
        await this.openWalletDropdown();
        await this.balancesDialog.waitFor({ state: 'visible' });
        await this.walletDepositButton.click();
    }

    // ── assertions ──────────────────────────────────────────────────────────────
    async expectMenuOpen(): Promise<void> { await expect(this.hamburgerCloseButton).toBeVisible(); }
    async expectLoginModalOpen(): Promise<void> { await expect(this.usernameInput).toBeVisible(); }
    async expectSignUpModalOpen(): Promise<void> { await expect(this.signUpModal).toBeVisible(); }
    async expectLiveChatOpen(): Promise<void> { await expect(this.liveChatFrame).toBeVisible({ timeout: 20000 }); }
    /** Toggle the theme once and confirm <html>.dark actually flipped. */
    async expectThemeToggles(): Promise<void> {
        const wasDark = await this.isDarkTheme();
        await this.toggleTheme();
        await expect.poll(() => this.isDarkTheme()).toBe(!wasDark);
    }
    async expectWalletShowsBalance(): Promise<void> {
        await expect(this.depositButton).toBeVisible();
        await expect(this.siteHeader).toContainText('Cash');
        await expect(this.siteHeader).toContainText(HeaderPage.CURRENCY);
    }
    async expectBalancesDialog(): Promise<void> {
        await expect(this.balancesDialog).toBeVisible();
        await expect(this.balancesDialog).toContainText('Cash');
        await expect(this.balancesDialog).toContainText('Bonus Balance');
        await expect(this.balancesDialog).toContainText(HeaderPage.CURRENCY);
    }
    async expectBankingOpen(): Promise<void> {
        await expect(this.accountOptionsDialog).toBeVisible();
        await expect(this.bankingFrame).toBeVisible({ timeout: 20000 });
    }
    async expectNotificationsDrawerOpens(): Promise<void> {
        await this.clickNotification();
        await expect(this.notificationsTitle).toBeVisible();
    }
    async expectProfileDrawerOpens(): Promise<void> {
        await this.clickProfile();
        await expect(this.welcomeGreeting).toBeVisible();
    }
    async expectSearchResultRelevant(query: RegExp): Promise<void> {
        await expect(this.firstSearchResult).toBeVisible();
        await expect(this.firstSearchResult).toHaveAttribute('aria-label', query);
    }
    async expectActiveNavTab(name: string): Promise<void> {
        await expect(this.navItem(name)).toHaveClass(/router-link-active/);
    }
}
