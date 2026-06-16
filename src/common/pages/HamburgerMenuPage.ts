import { Page, Locator, expect } from '@playwright/test';
import { SafeActions } from '../actions/SafeActions';
import { BasePage } from './BasePage';
import { css, role, text, first, at } from '../locators/sel';

export class HamburgerMenuPage extends BasePage {
    readonly locators: Record<string, Locator>;

    constructor(page: Page, safeActions: SafeActions) {
        super(page, safeActions);
        this.locators = this.build('hamBurgerMenu', {
            menuButton: first(role("button", {"name":"menu"})),
            hamburgerMenuClose: first(css("button[element-name=\"hamburger-menu-close\"]")),
            hamburgerLoginCTA: first(css("button[element-name=\"hamburger-menu-login\"]")),
            hamburgerSignUpCTA: first(css("button[element-name=\"hamburger-menu-register\"]")),
            lightThemeToggle: first(css("div:has(button[element-name=\"hamburger-menu-close\"]) button[aria-label=\"light-mode\"]")),
            darkThemeToggle: first(css("div:has(button[element-name=\"hamburger-menu-close\"]) button[aria-label=\"dark-mode\"]")),
            searchField: at(css("[element-name=\"nav-bar-search\"]"), 1),
            promotionsCTA: first(css(".hamburger-account-options:has-text(\"Promotions\")")),
            providersCTA: first(css(".hamburger-account-options:has-text(\"Providers\")")),
            winnersCTA: first(css(".hamburger-account-options:has-text(\"Winners\")")),
            blogCTA: first(css(".hamburger-account-options:has-text(\"Blog\")")),
            newGamesCTA: first(css(".hamburger-account-options:has-text(\"New Games\")")),
            quickLinksDropdown: first(css("summary:has-text(\"Quick Links\")")),
            privacyPolicyCTA: first(css("details:has(summary:has-text(\"Quick Links\")) a[href=\"/privacy-policy\"]")),
            contactUsCTA: first(css("details:has(summary:has-text(\"Quick Links\")) a[href=\"/contact-us\"]")),
            termsConditionsCTA: first(css("details:has(summary:has-text(\"Quick Links\")) a[href=\"/terms-and-conditions\"]")),
            faqsCTA: first(css("details:has(summary:has-text(\"Quick Links\")) a[href=\"/faq\"]")),
            responsibleGamblingCTA: first(css("details:has(summary:has-text(\"Quick Links\")) a[href=\"/responsible-gambling\"]")),
            getTheAppCTA: first(css("details:has(summary:has-text(\"Quick Links\")) a[href=\"/get-the-app\"]")),
            slotGamesCategory: first(css("div:has-text(\"Game Categories\") >> text=\"Slot Games\"")),
            liveGamesCategory: first(css("div:has-text(\"Game Categories\") >> text=\"Live Games\"")),
            aviatorCTA: first(css("div:has-text(\"Game Categories\") >> text=\"Aviator\"")),
            appleAppButton: at(role("button", {"name":"Jackpotcity Apple App"}), 1),
            androidAppButton: at(role("button", {"name":"Jackpotcity Android App"}), 1),
            huaweiAppButton: at(role("button", {"name":"Jackpotcity Huawei App"}), 1),
            profileIcon: at(css("div:has-text(\"Welcome,\")"), 2),
            balanceContainer: first(css("div.flex-col:has(div:has-text(\"Cash\")):has(div:has-text(\"Bonus Balance\"))")),
            cashBalance: first(text("Cash")),
            bonusBalance: first(text("Bonus Balance")),
            depositButton: at(role("button", {"name":"Deposit"}), 1),
            accountNo: first(css("div.truncate:has-text(\"Account No:\")")),
            eyeToggle: first(css("button:has-text(\"Deposit\") + button")),
            withdrawalCTA: first(css(".hamburger-account-options:has-text(\"Withdrawal\")")),
            myAccountDropdown: first(css("summary:has-text(\"My Account\")")),
            myAccountRegion: first(css("details:has(summary:has-text(\"My Account\"))")),
            myAccountDeposit: first(css("details:has(summary:has-text(\"My Account\")) div.cursor-pointer:has-text(\"Deposit\")")),
            myAccountWithdrawal: first(css("details:has(summary:has-text(\"My Account\")) div.cursor-pointer:has-text(\"Withdrawal\")")),
            transactionSummaryCTA: first(css("details:has(summary:has-text(\"My Account\")) div.cursor-pointer:has-text(\"Transaction Summary\")")),
            bonusWalletCTA: first(css("details:has(summary:has-text(\"My Account\")) div.cursor-pointer:has-text(\"Bonus Wallet\")")),
            personalDetailsCTA: first(css("details:has(summary:has-text(\"My Account\")) div.cursor-pointer:has-text(\"My Profile Management\")")),
            accountSettingsCTA: first(css("details:has(summary:has-text(\"My Account\")) div.cursor-pointer:has-text(\"Account Settings\")")),
            updatePasswordCTA: first(css("details:has(summary:has-text(\"My Account\")) div.cursor-pointer:has-text(\"Update Password\")")),
            responsibleGamingCTA: first(css("details:has(summary:has-text(\"My Account\")) div.cursor-pointer:has-text(\"Responsible Gaming\")")),
            documentVerificationCTA: first(css("details:has(summary:has-text(\"My Account\")) div.cursor-pointer:has-text(\"Document Verification\")")),
            logOutCTA: first(css("details:has(summary:has-text(\"My Account\")) div.cursor-pointer:has-text(\"Log out\")")),
            cityRewardsCTA: at(css("details:has(summary:has-text(\"My Account\")) div:has-text(\"City Rewards\")"), 2),
            slotGamesCTA: first(css("div:has-text(\"Game Categories\") >> text=\"Slot Games\"")),
            betGamesCTA: first(css("div:has-text(\"Game Categories\") >> text=\"Betgames\"")),
            quickGamesCTA: first(css("div:has-text(\"Game Categories\") >> text=\"Quick Games\"")),
            crashGamesCTA: first(css("div:has-text(\"Game Categories\") >> text=\"Crash Games\"")),
            transactionSummaryShortcut: first(css(".hamburger-account-options:has-text(\"Transaction Summary\")")),
            cityRewardsShortcut: first(css(".hamburger-account-options:has-text(\"City Rewards\")")),
            accountOptionsDialog: first(css("[role='dialog'][aria-labelledby^='Account Options']")),
            accountOptionsActiveItem: first(css("[role='dialog'][aria-labelledby^='Account Options'] button.bg-primary-blue-gradient")),
            accountOptionsBankingFrame: first(css("iframe[id^='banking_frame']")),
        });
    }

    /** Scrollable body of the open hamburger panel. */
    get menuScrollContainer(): Locator {
        return this.page.locator('.grow.overflow-y-auto').first();
    }
    /** Update button inside the Account Settings pane of the Account Options dialog. */
    get accountSettingsUpdateButton(): Locator {
        return this.locators.accountOptionsDialog.getByRole('button', { name: /update/i });
    }

    async openMenu() {
        await this.safeActions.safeClick('menuButton', this.locators.menuButton);
        // menu is open once its close button renders — saves every caller a blind sleep
        await this.locators.hamburgerMenuClose.waitFor({ state: 'visible', timeout: 10000 });
    }

    async toggleTheme() {
        await this.safeActions.safeClick('lightThemeToggle', this.locators.lightThemeToggle);
    }

    async clickDarkTheme() {
        await this.safeActions.safeClick('darkThemeToggle', this.locators.darkThemeToggle);
    }

    async clickQuickLinks() {
        await this.safeActions.safeClick('quickLinksDropdown', this.locators.quickLinksDropdown);
    }

    async clickMyAccount() {
        await this.safeActions.safeClick('myAccountDropdown', this.locators.myAccountDropdown);
    }

    async clickSlotGamesCategory() {
        await this.safeActions.safeClick('slotGamesCategory', this.locators.slotGamesCategory);
    }

    async clickLiveGamesCategory() {
        await this.safeActions.safeClick('liveGamesCategory', this.locators.liveGamesCategory);
    }

    async clickEyeToggle() {
        await this.safeActions.safeClick('eyeToggle', this.locators.eyeToggle);
    }

    async clickMyAccountDeposit() {
        await this.safeActions.safeClick('myAccountDeposit', this.locators.myAccountDeposit);
    }

    async clickMyAccountWithdrawal() {
        await this.safeActions.safeClick('myAccountWithdrawal', this.locators.myAccountWithdrawal);
    }

    async clickTransactionSummary() {
        await this.safeActions.safeClick('transactionSummaryCTA', this.locators.transactionSummaryCTA);
    }

    async clickBonusWallet() {
        await this.safeActions.safeClick('bonusWalletCTA', this.locators.bonusWalletCTA);
    }

    async clickPersonalDetails() {
        await this.safeActions.safeClick('personalDetailsCTA', this.locators.personalDetailsCTA);
    }

    async clickAccountSettings() {
        await this.safeActions.safeClick('accountSettingsCTA', this.locators.accountSettingsCTA);
    }

    async clickCityRewards() {
        await this.safeActions.safeClick('cityRewardsCTA', this.locators.cityRewardsCTA);
    }

    async clickResponsibleGaming() {
        await this.safeActions.safeClick('responsibleGamingCTA', this.locators.responsibleGamingCTA);
    }

    async clickDocumentVerification() {
        await this.safeActions.safeClick('documentVerificationCTA', this.locators.documentVerificationCTA);
    }

    async clickLogOut() {
        await this.safeActions.safeClick('logOutCTA', this.locators.logOutCTA);
    }

    async clickAviatorCTA() {
        await this.safeActions.safeClick('aviatorCTA', this.locators.aviatorCTA);
    }

    async clickSlotGamesCTA() {
        await this.safeActions.safeClick('slotGamesCTA', this.locators.slotGamesCTA);
    }

    async clickBetGamesCTA() {
        await this.safeActions.safeClick('betGamesCTA', this.locators.betGamesCTA);
    }

    async clickQuickGamesCTA() {
        await this.safeActions.safeClick('quickGamesCTA', this.locators.quickGamesCTA);
    }

    async closeMenu() {
        await this.safeActions.safeClick('hamburgerMenuClose', this.locators.hamburgerMenuClose);
    }

    async clickHamburgerLoginCTA() {
        await this.safeActions.safeClick('hamburgerLoginCTA', this.locators.hamburgerLoginCTA);
    }

    async clickHamburgerSignUpCTA() {
        await this.safeActions.safeClick('hamburgerSignUpCTA', this.locators.hamburgerSignUpCTA);
    }

    async clickNewGamesCTA() {
        await this.safeActions.safeClick('newGamesCTA', this.locators.newGamesCTA);
    }

    async clickCrashGamesCTA() {
        await this.safeActions.safeClick('crashGamesCTA', this.locators.crashGamesCTA);
    }

    async clickTransactionSummaryShortcut() {
        await this.safeActions.safeClick('transactionSummaryShortcut', this.locators.transactionSummaryShortcut);
    }

    async clickCityRewardsShortcut() {
        await this.safeActions.safeClick('cityRewardsShortcut', this.locators.cityRewardsShortcut);
    }

    // Highlight methods
    async highlightElement(key: string) {
        if (this.locators[key]) {
            await this.safeActions.safeHighlight(key, this.locators[key]);
        } else {
            console.error(`Locator ${key} not found`);
        }
    }

    // ══════════════════════════════════════════════════════════════════════════
    //  Intent API — what tests speak to. Selectors, waits and DOM probes stay in
    //  here so the specs read as business steps.
    // ══════════════════════════════════════════════════════════════════════════

    // ── semantic element accessors (for `expect(menu.x).toBeVisible()`) ─────────
    get closeButton(): Locator { return this.locators.hamburgerMenuClose; }
    get loginCta(): Locator { return this.locators.hamburgerLoginCTA; }
    get signUpCta(): Locator { return this.locators.hamburgerSignUpCTA; }
    get searchField(): Locator { return this.locators.searchField; }
    get promotionsCta(): Locator { return this.locators.promotionsCTA; }
    get providersCta(): Locator { return this.locators.providersCTA; }
    get winnersCta(): Locator { return this.locators.winnersCTA; }
    get blogCta(): Locator { return this.locators.blogCTA; }
    get newGamesCta(): Locator { return this.locators.newGamesCTA; }
    get privacyPolicyCta(): Locator { return this.locators.privacyPolicyCTA; }
    get lightThemeToggle(): Locator { return this.locators.lightThemeToggle; }
    get darkThemeToggle(): Locator { return this.locators.darkThemeToggle; }
    get slotGamesCategory(): Locator { return this.locators.slotGamesCategory; }
    get liveGamesCategory(): Locator { return this.locators.liveGamesCategory; }
    get appleAppButton(): Locator { return this.locators.appleAppButton; }
    get androidAppButton(): Locator { return this.locators.androidAppButton; }
    get appGalleryButton(): Locator { return this.locators.huaweiAppButton; }
    get contactUsCta(): Locator { return this.locators.contactUsCTA; }
    get termsCta(): Locator { return this.locators.termsConditionsCTA; }
    get faqsCta(): Locator { return this.locators.faqsCTA; }
    get responsibleGamblingCta(): Locator { return this.locators.responsibleGamblingCTA; }
    get getTheAppCta(): Locator { return this.locators.getTheAppCTA; }
    get slotGamesCta(): Locator { return this.locators.slotGamesCTA; }
    get aviatorCta(): Locator { return this.locators.aviatorCTA; }
    get crashGamesCta(): Locator { return this.locators.crashGamesCTA; }
    get quickGamesCta(): Locator { return this.locators.quickGamesCTA; }
    get betGamesCta(): Locator { return this.locators.betGamesCTA; }

    /** Click any element (first match). Keeps the raw `.first().click()` mechanic out of specs. */
    async tap(target: Locator): Promise<void> { await target.first().click(); }

    // ── actions (each leaves the app settled — no caller-side waits) ────────────
    async open(): Promise<void> { await this.openMenu(); }
    async close(): Promise<void> { await this.closeMenu(); await this.closeButton.waitFor({ state: 'hidden' }); }
    async tapOutside(): Promise<void> { await this.page.mouse.click(700, 400); await this.closeButton.waitFor({ state: 'hidden' }); }
    async openQuickLinks(): Promise<void> { await this.clickQuickLinks(); await this.locators.privacyPolicyCTA.waitFor({ state: 'visible' }); }
    async scrollToAppSection(): Promise<void> { await this.menuScrollContainer.evaluate((el: HTMLElement) => el.scrollTo(0, el.scrollHeight)); }

    /** Ensure we start in light theme (so a "switch to dark" test has somewhere to go). */
    async ensureLightTheme(): Promise<void> { if (await this.isDarkTheme()) await this.toggleTheme(); }
    /** Ensure we start in dark theme. */
    async ensureDarkTheme(): Promise<void> { if (!await this.isDarkTheme()) await this.clickDarkTheme(); }
    async switchToDarkTheme(): Promise<void> { await this.clickDarkTheme(); }
    async switchToLightTheme(): Promise<void> { await this.toggleTheme(); }

    /** Open a CTA that links out to a new tab; asserts a popup opened, then closes it. */
    async expectOpensPopup(cta: Locator): Promise<void> {
        const [popup] = await Promise.all([this.page.waitForEvent('popup'), cta.first().click()]);
        await popup.waitForLoadState('domcontentloaded').catch(() => { });
        expect(popup.url()).toBeTruthy();
        await popup.close();
    }

    // ── assertions (read as the test's expectation) ─────────────────────────────
    async expectOpen(): Promise<void> { await expect(this.closeButton).toBeVisible(); }
    async expectClosed(): Promise<void> { await expect(this.closeButton).not.toBeVisible(); }
    async expectDarkTheme(): Promise<void> { await expect.poll(() => this.isDarkTheme()).toBe(true); }
    async expectLightTheme(): Promise<void> { await expect.poll(() => this.isDarkTheme()).toBe(false); }
    /** Open the menu, flip the theme, confirm <html>.dark changed, and close. (Logged-in theme lives here.) */
    async expectThemeToggles(): Promise<void> {
        const wasDark = await this.isDarkTheme();
        await this.openMenu();
        if (wasDark) await this.toggleTheme(); else await this.clickDarkTheme();
        await expect.poll(() => this.isDarkTheme()).toBe(!wasDark);
        await this.closeMenu().catch(() => { });
    }
    // expectAt() / expectOnContentPage() are inherited from BasePage.

    /** True when a CTA isn't present in the current region (drives region-adaptive `test.skip`). */
    async lacks(cta: Locator): Promise<boolean> { return (await cta.count()) === 0; }

    // ── logged-in intent API ────────────────────────────────────────────────────
    private static readonly CURRENCY = /(R|GHS|GH₵|₵|MWK|TZS|TSh)\s*[\d,]+\.\d{2}/i;

    get balanceWidget(): Locator { return this.locators.balanceContainer; }
    get depositButton(): Locator { return this.locators.depositButton; }
    get profileName(): Locator { return this.locators.profileIcon; }
    get accountNumber(): Locator { return this.locators.accountNo; }
    get eyeToggle(): Locator { return this.locators.eyeToggle; }
    get withdrawalShortcut(): Locator { return this.locators.withdrawalCTA; }
    get myAccountDeposit(): Locator { return this.locators.myAccountDeposit; }
    get myAccountRegion(): Locator { return this.locators.myAccountRegion; }

    async expectBalanceWidget(): Promise<void> {
        await expect(this.balanceWidget).toBeVisible();
        await expect(this.balanceWidget).toContainText(HamburgerMenuPage.CURRENCY);
    }
    async expectDepositButton(): Promise<void> { await expect(this.depositButton).toBeVisible(); }
    async expectUserName(): Promise<void> { await expect(this.profileName).toBeVisible(); }
    async expectAccountNumber(): Promise<void> {
        await expect(this.accountNumber).toBeVisible();
        await expect(this.accountNumber).toHaveText(/Account No:\s*\d{5,}/);
    }
    async expectEyeToggleVisible(): Promise<void> { await expect(this.eyeToggle).toBeVisible(); }
    async hideBalance(): Promise<void> { await this.clickEyeToggle(); }
    async expectBalanceMasked(): Promise<void> {
        await expect(this.balanceWidget).toContainText('●');
        await expect(this.balanceWidget).not.toContainText(HamburgerMenuPage.CURRENCY);
    }
    async expectBalanceShown(): Promise<void> {
        await expect(this.balanceWidget).toContainText(HamburgerMenuPage.CURRENCY);
        await expect(this.balanceWidget).not.toContainText('●');
    }

    /** A My Account option opens the Account Options dialog with that option active in the sidebar. */
    async expectAccountOptionOpened(optionName: string): Promise<void> {
        await expect(this.locators.accountOptionsDialog).toBeVisible();
        await expect(this.locators.accountOptionsActiveItem).toBeVisible();
        await expect(this.locators.accountOptionsActiveItem).toHaveText(new RegExp(optionName, 'i'));
    }
    async expectBankingOpen(): Promise<void> { await expect(this.locators.accountOptionsBankingFrame).toBeVisible({ timeout: 20000 }); }

    // ── language switch (TZ): English / Swahili toggle in the menu ──────────────
    get languageToggleGroup(): Locator { return this.page.locator("div:has(> button:text-is('English')):has(> button:text-is('Swahili'))").first(); }
    get languageEnglishBtn(): Locator { return this.languageToggleGroup.getByRole('button', { name: 'English', exact: true }); }
    get languageSwahiliBtn(): Locator { return this.languageToggleGroup.getByRole('button', { name: 'Swahili', exact: true }); }
    /** Both languages offered, English active by default, and selecting Swahili actually changes the
     *  site language (verified via <html lang> / URL — robust to the reload the switch triggers). */
    async expectLanguageSwitch(): Promise<void> {
        await expect(this.languageEnglishBtn).toBeVisible();
        await expect(this.languageSwahiliBtn).toBeVisible();
        await expect(this.languageEnglishBtn).toHaveClass(/bg-layer-secondary/);   // English active by default
        const before = await this.page.evaluate(() => document.documentElement.lang + '|' + location.href);
        await this.languageSwahiliBtn.click();
        await this.page.waitForTimeout(3000);                                       // switch reloads/re-renders
        const after = await this.page.evaluate(() => document.documentElement.lang + '|' + location.href);
        expect(after, `selecting Swahili should change the site language (was "${before}")`).not.toBe(before);
    }

    /** City Rewards (ZA): My Points value with decimal precision, the monthly earnings chart,
     *  and the "Find out how it works" expander. */
    async expectCityRewardsDetails(): Promise<void> {
        const dlg = this.locators.accountOptionsDialog;
        await expect(dlg).toBeVisible();
        // My Points balance — shown to a few decimals (e.g. "1.57")
        const points = dlg.locator('span.text-5xl').first();
        await expect(points).toBeVisible();
        expect((await points.textContent())?.trim(), 'My Points should be a decimal value').toMatch(/^\d+\.\d{1,3}$/);
        // Points-to-Cash converter + monthly earnings bar chart
        await expect(dlg.getByText(/points to cash/i).first()).toBeVisible();
        await expect(dlg.locator('.summary-graph')).toBeVisible();
        expect(await dlg.locator('.barchart-single').count(), 'monthly chart should show month bars').toBeGreaterThanOrEqual(6);
        // "Find out how it works" expander opens
        const how = dlg.locator('details:has(summary:has-text("Find out how it works"))');
        await expect(how).toBeVisible();
        await how.locator('summary').click();
        await expect(how).toHaveAttribute('open', '');
    }

    async openWithdrawalShortcut(): Promise<void> { await this.withdrawalShortcut.first().click(); }
    async openTransactionSummaryShortcut(): Promise<void> { await this.clickTransactionSummaryShortcut(); }
    async openCityRewardsShortcut(): Promise<void> { await this.clickCityRewardsShortcut(); }

    async openMyAccount(): Promise<void> { await this.clickMyAccount(); }
    async expectMyAccountExpanded(): Promise<void> { await expect(this.myAccountDeposit).toBeVisible(); }
    async expectMyAccountCollapsed(): Promise<void> { await expect(this.myAccountDeposit).not.toBeVisible(); }
    async expectMyAccountRegion(): Promise<void> { await expect(this.myAccountRegion).toBeVisible(); }
    async collapseMyAccount(): Promise<void> { await this.clickMyAccount(); }

    /** Open My Account and select one of its options (opens the Account Options dialog). */
    async openMyAccountOption(option: 'Deposit' | 'Withdrawal' | 'Transaction Summary' | 'Bonus Wallet' | 'City Rewards' | 'My Profile Management' | 'Account Settings' | 'Responsible Gaming' | 'Document Verification'): Promise<void> {
        await this.clickMyAccount();
        switch (option) {
            case 'Deposit': await this.clickMyAccountDeposit(); break;
            case 'Withdrawal': await this.clickMyAccountWithdrawal(); break;
            case 'Transaction Summary': await this.clickTransactionSummary(); break;
            case 'Bonus Wallet': await this.clickBonusWallet(); break;
            case 'City Rewards': await this.clickCityRewards(); break;
            case 'My Profile Management': await this.clickPersonalDetails(); break;
            case 'Account Settings': await this.clickAccountSettings(); break;
            case 'Responsible Gaming': await this.clickResponsibleGaming(); break;
            case 'Document Verification': await this.clickDocumentVerification(); break;
        }
    }
    async expectAccountSettingsUpdateButton(): Promise<void> { await expect(this.accountSettingsUpdateButton).toBeVisible(); }
    async logOut(): Promise<void> { await this.clickMyAccount(); await this.clickLogOut(); }
    async expectLoggedOut(): Promise<void> { await expect(this.headerLoginButton).toBeVisible(); }
}
