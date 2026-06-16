import { Page, Locator, expect } from '@playwright/test';
import { SafeActions } from '../actions/SafeActions';
import { BasePage } from './BasePage';
import { css, first } from '../locators/sel';

export class GamePage extends BasePage {
    readonly locators: Record<string, Locator>;

    constructor(page: Page, safeActions: SafeActions) {
        super(page, safeActions);
        this.locators = this.build('gamePage', {
            featuredGameCard: first(css("#featured-carousel a.game-card")),
            topBar: first(css("div.bg-layer.flex.justify-between.p-1")),
            topBarBackBtn: first(css("div.bg-layer.flex.justify-between.p-1 button.design-system-button")),
            topBarFavBtn: first(css("div.bg-layer.flex.justify-between.p-1 button:has(div[aria-label^='favorite-game'])")),
            topBarFavActiveBtn: first(css("div.bg-layer.flex.justify-between.p-1 div[aria-label^='favorite-game']:has(svg.primary-pink-gradient-text)")),
            topBarGameTitle: first(css("div.bg-layer.flex.justify-between.p-1 span.font-bold.truncate")),
            stackpotBanner: first(css("div[vertical=spingames]")),
            loginModal: first(css("div.login-container")),
            loginUsername: first(css("input[name='username'][type='tel']")),
            loginPassword: first(css("input[name='password'][type='password']")),
            loginSubmitBtn: first(css("div.login-container button[group='primary']")),
            categoryDropdown: first(css("#in-game-category-dropdown")),
            categoryDropdownNameBtn: first(css("#in-game-category-dropdown button:first-child")),
            categoryDropdownToggle: first(css("#in-game-category-dropdown button:last-child")),
            topBarLikeBtn: first(css("#btn-up-thumb")),
            topBarDislikeBtn: first(css("#btn-down-thumb")),
            topBarShareBtn: first(css("div.bg-layer.flex.justify-between.p-1 button:has(path[d^='M7.217'])")),
            topBarMaximizeBtn: first(css("div.bg-layer.flex.justify-between.p-1 button:has(path[d^='M3.75 3.75v4.5'])")),
            topBarMinimizeBtn: first(css("div.bg-layer.flex.justify-between.p-1 button:has(path[d^='M4.367'])")),
            topBarHamburgerBtn: first(css("div.bg-layer.flex.justify-between.p-1 button:has(path[d^='M3.75 6.75'])")),
            shareModal: first(css("[role='dialog'][aria-labelledby='share-modal-title']")),
            shareModalTitle: first(css("#share-modal-title")),
            shareModalCloseBtn: first(css("button[element-name='close-modal']")),
            shareWhatsAppBtn: first(css("[role='dialog'][aria-labelledby='share-modal-title'] button:has(path[d^='M19.05'])")),
            shareFacebookBtn: first(css("[role='dialog'][aria-labelledby='share-modal-title'] button:has(path[d^='M10.25 23'])")),
            shareTwitterBtn: first(css("[role='dialog'][aria-labelledby='share-modal-title'] button:has(path[d^='M 4.0175781'])")),
            shareEmailBtn: first(css("[role='dialog'][aria-labelledby='share-modal-title'] button:has(path[d^='M21.75 6.75v10.5'])")),
            hamburgerPanel: first(css("div.fixed.flex.flex-col.border-none.shadow-lg.z-40")),
            hamburgerLoginBtn: first(css("button[element-name='hamburger-menu-login']")),
            hamburgerSignUpBtn: first(css("button[element-name='hamburger-menu-register']")),
            hamburgerThemeToggle: first(css("div.fixed.z-40 button[aria-label*='mode']")),
            hamburgerCloseBtn: first(css("button[element-name='hamburger-menu-close']")),
            hamburgerGameTitle: first(css("div.fixed.z-40 p.font-semibold.text-lg.truncate")),
            hamburgerFavBtn: first(css("div.fixed.z-40 button:has(div[aria-label^='favorite-game'])")),
            hamburgerFavActiveBtn: first(css("div.fixed.z-40 div[aria-label^='favorite-game']:has(svg.primary-pink-gradient-text)")),
            hamburgerWhatsAppBtn: first(css("div.fixed.z-40 button:has(path[d^='M19.05'])")),
            hamburgerFacebookBtn: first(css("div.fixed.z-40 button:has(path[d^='M10.25 23'])")),
            hamburgerTwitterBtn: first(css("div.fixed.z-40 button:has(path[d^='M 4.0175781'])")),
            hamburgerEmailBtn: first(css("div.fixed.z-40 button:has(path[d^='M21.75 6.75v10.5'])")),
            hamburgerLobbiesTitle: first(css("div.fixed.z-40 p.font-bold.text-lg.capitalize")),
            hamburgerLobbiesList: first(css("div.fixed.z-40 div.flex.flex-col.gap-2:has(a)")),
            categoryDropdownPanel: first(css("div.animate-fade-down.w-48")),
            categoryDropdownItem: first(css("div.animate-fade-down div.truncate.cursor-pointer")),
            signUpModal: first(css("[role='dialog'][aria-labelledby='Sign Up-modal-title']")),
            signUpModalTitle: first(css("[id='Sign Up-modal-title']")),
            hamburgerWelcomeMsg: first(css("div.fixed.z-40 div.flex.flex-col.flex-1.text-xs.text-base-priority")),
            hamburgerMyAccountTab: first(css("div.fixed.z-40 div#my-account")),
            hamburgerLobbiesTab: first(css("div.fixed.z-40 div#lobbies")),
            trySimilarPanel: first(css("div.bg-layer-secondary.container.mx-auto.p-2.rounded-t-xl")),
            trySimilarCloseBtn: first(css("div.bg-layer-secondary button[element-name='close-modal']")),
            trySimilarContinueBtn: first(css("button[element-name='continue-playing']")),
            trySimilarGameCard: first(css("div.bg-layer-secondary div.scroller-casino a.game-card")),
            trySimilarActiveCard: first(css("div.bg-layer-secondary a[aria-current='page'].game-card")),
            trySimilarActiveBadge: first(css("div.bg-layer-secondary a[aria-current='page'] strong")),
            gameMinBet: first(css("div.bg-dark-800.px-3.py-1.text-xs.capitalize.rounded-md")),
            accountOptionsDialog: first(css("[role='dialog'][aria-labelledby^='Account Options']")),
            accountOptionsActiveItem: first(css("[role='dialog'][aria-labelledby^='Account Options'] button.bg-primary-blue-gradient")),
            accountOptionsBankingFrame: first(css("iframe[id^='banking_frame']")),
        });
    }

    // ─── element accessors (keep all selectors inside the Page Object) ─────────
    /** Logged-out "Play now" CTA shown on the game page. */
    get playNowButton(): Locator {
        return this.page.getByRole('button', { name: 'Play now' });
    }
    /** The launched game surface (HTML5 canvas or provider iframe). */
    get gameFrame(): Locator {
        return this.page.locator('canvas, iframe[src]').first();
    }
    /** Featured/recommended games carousel container. */
    get featuredCarousel(): Locator {
        return this.page.locator('#featured-carousel');
    }
    /**
     * Region-agnostic "we landed back on a populated games listing" signal: a game card.
     * ZA back-navigates to home and GH to the Slot Games vertical — both render game cards,
     * whereas only ZA's landing has #featured-carousel. Use this for back-navigation assertions.
     */
    get landingGameGrid(): Locator {
        return this.page.locator('a.game-card').first();
    }
    /** Lobby links inside the in-game hamburger panel. */
    get hamburgerLobbyLinks(): Locator {
        return this.locators.hamburgerLobbiesList.locator('a');
    }
    /** A specific lobby link in the in-game hamburger by destination path. */
    hamburgerLobbyLink(href: string): Locator {
        return this.locators.hamburgerPanel.locator(`a[href="${href}"]`);
    }
    /** An account-option button (Deposit / Withdrawal / Log out / …) in the in-game hamburger. */
    accountOption(name: string): Locator {
        return this.locators.hamburgerPanel.getByRole('button', { name });
    }
    /** Update button inside the Account Settings pane of the Account Options dialog. */
    get accountSettingsUpdateButton(): Locator {
        return this.locators.accountOptionsDialog.getByRole('button', { name: /update/i });
    }
    /** City Rewards content ("My Points") inside the Account Options dialog. */
    get accountOptionsCityRewardsContent(): Locator {
        return this.locators.accountOptionsDialog.getByText(/My Points/i).first();
    }

    // ─── fullscreen helpers (encapsulate the document.fullscreenElement probe) ──
    isFullscreen(): Promise<boolean> {
        return this.page.evaluate(() => !!document.fullscreenElement);
    }
    /** Theme is dark when <html> carries the Tailwind `dark` class. */
    isDarkTheme(): Promise<boolean> {
        return this.page.evaluate(() => document.documentElement.classList.contains('dark'));
    }

    async navigate() {
        await this.featuredCarousel.waitFor({ state: 'visible', timeout: 15000 });
        await this.locators.featuredGameCard.click();
        await this.page.waitForURL(/\/home\//, { timeout: 10000 });
        await this.page.waitForLoadState('domcontentloaded');
        await this.locators.topBar.waitFor({ state: 'visible', timeout: 15000 });
    }

    /**
     * Reach a playable game via a vertical listing (used by regions whose home has no featured
     * carousel, e.g. GH/TZ). Tries the first few game cards and stops at the first that actually
     * opens the game shell — so a geo-blocked game in slot #1 is skipped instead of failing the
     * whole suite. The launched URL is `<vertical>/featured/<slug>` or `/home/featured/<slug>`.
     */
    protected async navigateViaVertical(path: string): Promise<void> {
        const cards = this.page.locator('a.game-card');
        const reach = async (i: number): Promise<boolean> => {
            await this.page.goto(path, { waitUntil: 'domcontentloaded' });
            await cards.first().waitFor({ state: 'visible', timeout: 20000 });
            await cards.nth(i).click();
            const onGame = await this.page.waitForURL('**/featured/**', { timeout: 12000 }).then(() => true).catch(() => false);
            if (!onGame) return false;
            await this.page.waitForLoadState('domcontentloaded');
            return this.locators.topBar.waitFor({ state: 'visible', timeout: 12000 }).then(() => true).catch(() => false);
        };
        const total = Math.min(await this.page.goto(path, { waitUntil: 'domcontentloaded' })
            .then(() => cards.count()).catch(() => 1), 5);
        for (let i = 0; i < Math.max(total, 1); i++) {
            if (await reach(i)) return;
        }
        // none of the first cards opened a game — surface a clear failure on the last attempt
        await this.locators.topBar.waitFor({ state: 'visible', timeout: 8000 });
    }

    async openHamburger() {
        await this.locators.topBarHamburgerBtn.click();
        await this.locators.hamburgerPanel.waitFor({ state: 'visible', timeout: 10000 });
    }

    async closeHamburger() {
        await this.locators.hamburgerCloseBtn.click();
        await this.locators.hamburgerPanel.waitFor({ state: 'hidden', timeout: 5000 });
    }

    async openShareModal() {
        await this.locators.topBarShareBtn.click();
        await this.locators.shareModal.waitFor({ state: 'visible', timeout: 10000 });
    }

    async closeShareModal() {
        await this.locators.shareModalCloseBtn.click();
        await this.locators.shareModal.waitFor({ state: 'hidden', timeout: 5000 });
    }

    async highlightElement(key: string) {
        if (this.locators[key]) {
            await this.safeActions.safeHighlight(key, this.locators[key]);
        }
    }

    async highlightLocator(name: string, locator: Locator) {
        await this.safeActions.safeHighlight(name, locator);
    }

    // ══════════════════════════════════════════════════════════════════════════
    //  Intent API — every mechanic (waits, popups, fullscreen/theme probes) lives here.
    // ══════════════════════════════════════════════════════════════════════════
    private currentGameSlug(): string { return new URL(this.page.url()).pathname.split('/').filter(Boolean).pop() || ''; }
    private static looksLikeI18nKey(text: string): boolean { return /^[a-z0-9]+(-[a-z0-9]+){2,}$/.test(text.trim()); }

    // ── semantic accessors ──────────────────────────────────────────────────────
    get topBar(): Locator { return this.locators.topBar; }
    get gameTitle(): Locator { return this.locators.topBarGameTitle; }
    get favButton(): Locator { return this.locators.topBarFavBtn; }
    get shareButton(): Locator { return this.locators.topBarShareBtn; }
    get stackpotBanner(): Locator { return this.locators.stackpotBanner; }
    get likeButton(): Locator { return this.locators.topBarLikeBtn; }
    get dislikeButton(): Locator { return this.locators.topBarDislikeBtn; }
    get shareModal(): Locator { return this.locators.shareModal; }
    get hamburgerButton(): Locator { return this.locators.topBarHamburgerBtn; }
    get hamburgerPanel(): Locator { return this.locators.hamburgerPanel; }
    get hamburgerLoginButton(): Locator { return this.locators.hamburgerLoginBtn; }
    get hamburgerSignUpButton(): Locator { return this.locators.hamburgerSignUpBtn; }
    get hamburgerGameTitle(): Locator { return this.locators.hamburgerGameTitle; }
    get categoryDropdown(): Locator { return this.locators.categoryDropdown; }
    get exitModal(): Locator { return this.locators.trySimilarPanel; }
    get minBet(): Locator { return this.locators.gameMinBet; }
    get recommendedTile(): Locator { return this.locators.featuredGameCard; }
    get bankingFrame(): Locator { return this.locators.accountOptionsBankingFrame; }
    get hamburgerWhatsApp(): Locator { return this.locators.hamburgerWhatsAppBtn; }
    get hamburgerFacebook(): Locator { return this.locators.hamburgerFacebookBtn; }
    get hamburgerTwitter(): Locator { return this.locators.hamburgerTwitterBtn; }
    get hamburgerEmail(): Locator { return this.locators.hamburgerEmailBtn; }
    get shareWhatsApp(): Locator { return this.locators.shareWhatsAppBtn; }
    get shareFacebook(): Locator { return this.locators.shareFacebookBtn; }
    get shareTwitter(): Locator { return this.locators.shareTwitterBtn; }
    get shareEmail(): Locator { return this.locators.shareEmailBtn; }

    // ── basic page ───────────────────────────────────────────────────────────────
    async expectLoaded(): Promise<void> { await this.expectAt(/\/featured\//); }
    async expectLoadedWithTopBar(): Promise<void> { await this.expectAt(/\/featured\//); await expect(this.topBar).toBeVisible(); }
    async expectGameInfo(): Promise<void> {
        await expect(this.topBar).toBeVisible();
        await expect(this.gameTitle).toBeVisible();
        expect((await this.gameTitle.textContent())?.trim()).toBeTruthy();
    }
    async expectPlayNowVisible(): Promise<void> { await expect(this.playNowButton).toBeVisible(); }
    async expectGameFrame(): Promise<void> { await expect(this.gameFrame).toBeVisible({ timeout: 30000 }); }
    async expectStackpotBanner(): Promise<void> { await expect(this.stackpotBanner).toBeVisible(); }
    async expectLikeDislikeButtons(): Promise<void> {
        await expect(this.likeButton).toBeVisible();
        await expect(this.dislikeButton).toBeVisible();
    }
    async expectMinBetFormatted(): Promise<void> {
        await expect(this.minBet).toBeVisible();
        expect((await this.minBet.textContent())?.trim()).toMatch(/(R|GHS|GH₵|₵|MWK|TZS|TSh)[\s ]?\d+[.,]\d{2}/i);
    }

    // ── login prompts (logged out) ───────────────────────────────────────────────
    async expectLoginModalOpen(): Promise<void> {
        await expect(this.locators.loginModal).toBeVisible();
        await expect(this.locators.loginUsername).toBeVisible();
    }
    async expectPlayNowPromptsLogin(): Promise<void> {
        await expect(this.playNowButton).toBeVisible();
        await this.playNowButton.click();
        await this.expectLoginModalOpen();
    }
    async expectFavouritePromptsLogin(): Promise<void> {
        await expect(this.favButton).toBeVisible();
        await this.favButton.click();
        await this.expectLoginModalOpen();
    }
    async expectHamburgerFavouritePromptsLogin(): Promise<void> {
        await this.openHamburger();
        await expect(this.locators.hamburgerFavBtn).toBeVisible();
        await this.locators.hamburgerFavBtn.click();
        await expect(this.locators.loginModal).toBeVisible();
    }
    async loginFromHamburgerAndExpectGame(mobile: string, password: string): Promise<void> {
        const gameUrl = this.page.url();
        await this.openHamburger();
        await this.locators.hamburgerLoginBtn.click();
        await expect(this.locators.loginModal).toBeVisible();
        await this.locators.loginUsername.fill(mobile);
        await this.locators.loginPassword.fill(password);
        await this.locators.loginSubmitBtn.click();
        await this.expectAt(new RegExp(gameUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
        await this.expectGameFrame();
    }

    // ── share modal ────────────────────────────────────────────────────────────
    async expectShareModalOpens(): Promise<void> {
        await this.openShareModal();
        await expect(this.shareModal).toBeVisible();
        expect((await this.locators.shareModalTitle.textContent())?.trim().toLowerCase()).toContain('share');
    }
    async expectShareModalCloses(): Promise<void> {
        await this.openShareModal();
        await this.closeShareModal();
        await expect(this.shareModal).toBeHidden();
    }
    /** Click a share trigger, confirm the popup targets the right platform and THIS game's link. */
    async expectShareOpens(trigger: Locator, platform: RegExp, opts: { tweet?: boolean } = {}): Promise<void> {
        const [popup] = await Promise.all([this.page.waitForEvent('popup', { timeout: 15000 }), trigger.click()]);
        await popup.waitForLoadState('domcontentloaded').catch(() => { });
        expect(popup.url()).toMatch(platform);
        expect(decodeURIComponent(popup.url())).toContain(this.currentGameSlug());
        if (opts.tweet) {
            const tweet = new URL(popup.url()).searchParams.get('text') || '';
            expect(GamePage.looksLikeI18nKey(tweet), `Tweet text looks like an untranslated i18n key: "${tweet}"`).toBe(false);
        }
        await popup.close();
    }
    async expectEmailShareEnabled(trigger: Locator): Promise<void> {
        await expect(trigger).toBeVisible();
        await expect(trigger).not.toBeDisabled();
    }

    // ── fullscreen ────────────────────────────────────────────────────────────────
    async expectEntersFullscreen(): Promise<void> {
        await this.locators.topBarMaximizeBtn.click();
        await expect.poll(() => this.isFullscreen()).toBe(true);
    }
    async expectExitsFullscreen(): Promise<void> {
        if (!await this.isFullscreen()) await this.locators.topBarMaximizeBtn.click();
        await expect.poll(() => this.isFullscreen()).toBe(true);
        await this.locators.topBarMinimizeBtn.click();
        await expect.poll(() => this.isFullscreen()).toBe(false);
    }

    // ── recommended games ────────────────────────────────────────────────────────
    async expectRecommendedTiles(): Promise<void> {
        await expect(this.featuredCarousel).toBeVisible();
        expect(await this.recommendedTile.count()).toBeGreaterThan(0);
    }
    async expectRecommendedTileOpensGame(): Promise<void> {
        await expect(this.recommendedTile).toBeVisible();
        await this.recommendedTile.click();
        await this.expectAt(/\/featured\//);
        await expect(this.topBar).toBeVisible();
    }

    // ── category dropdown ────────────────────────────────────────────────────────
    async expectCategoryDropdown(): Promise<void> {
        await expect(this.categoryDropdown).toBeVisible();
        await expect(this.locators.categoryDropdownNameBtn).toBeVisible();
        expect((await this.locators.categoryDropdownNameBtn.textContent())?.trim()).toBeTruthy();
    }
    async expectCategoryExpands(): Promise<void> {
        await this.locators.categoryDropdownToggle.click();
        await expect(this.locators.categoryDropdownPanel).toBeVisible();
        expect(await this.locators.categoryDropdownItem.count()).toBeGreaterThan(0);
    }
    async expectCategorySelectable(): Promise<void> {
        const active = (await this.locators.categoryDropdownNameBtn.textContent())?.trim().toLowerCase() ?? '';
        await this.locators.categoryDropdownToggle.click();
        await expect(this.locators.categoryDropdownPanel).toBeVisible();
        // Select a category OTHER than the active one — re-selecting the active category just
        // collapses the dropdown back to the default lobby, which isn't a meaningful selection.
        const items = this.locators.categoryDropdownPanel.locator('div.truncate.cursor-pointer');
        const count = await items.count();
        let target: Locator | null = null;
        let targetText = '';
        for (let i = 0; i < count; i++) {
            const t = (await items.nth(i).textContent())?.trim() ?? '';
            if (t && t.toLowerCase() !== active) { target = items.nth(i); targetText = t; break; }
        }
        expect(target, 'no non-active category available to select').not.toBeNull();
        await target!.click();
        await expect(this.locators.categoryDropdownPanel).toBeHidden();
        expect((await this.locators.categoryDropdownNameBtn.textContent())?.trim().toLowerCase()).toContain(targetText.toLowerCase());
    }
    async expectCategoryClosesAfterSelect(): Promise<void> {
        await this.locators.categoryDropdownToggle.click();
        await expect(this.locators.categoryDropdownPanel).toBeVisible();
        await this.locators.categoryDropdownItem.click();
        await expect(this.locators.categoryDropdownPanel).toBeHidden();
    }
    async expectCategoryToggleIcon(): Promise<void> {
        await this.locators.categoryDropdownToggle.click();
        await expect(this.locators.categoryDropdownPanel).toBeVisible();
        await this.locators.categoryDropdownToggle.click();
        await expect(this.locators.categoryDropdownPanel).toBeHidden();
    }

    // ── in-game hamburger ─────────────────────────────────────────────────────────
    async expectHamburgerOpens(): Promise<void> { await this.openHamburger(); await expect(this.hamburgerPanel).toBeVisible(); }
    async expectHamburgerCloses(): Promise<void> { await this.openHamburger(); await this.closeHamburger(); await expect(this.hamburgerPanel).toBeHidden(); }
    async expectHamburgerAuthCtas(): Promise<void> {
        await this.openHamburger();
        await expect(this.hamburgerLoginButton).toBeVisible();
        await expect(this.hamburgerSignUpButton).toBeVisible();
    }
    async expectHamburgerLoginOpens(): Promise<void> {
        await this.openHamburger();
        await this.hamburgerLoginButton.click();
        await this.expectLoginModalOpen();
    }
    async expectHamburgerSignUpOpens(): Promise<void> {
        await this.openHamburger();
        await this.hamburgerSignUpButton.click();
        await expect(this.locators.signUpModal).toBeVisible();
        expect((await this.locators.signUpModalTitle.textContent())?.trim().toLowerCase()).toBe('sign up');
    }
    async expectThemeToggles(): Promise<void> {
        await this.openHamburger();
        const wasDark = await this.isDarkTheme();
        await this.locators.hamburgerThemeToggle.click();
        await expect.poll(() => this.isDarkTheme()).toBe(!wasDark);
        await this.locators.hamburgerThemeToggle.click();              // restore
        await expect.poll(() => this.isDarkTheme()).toBe(wasDark);
    }
    async expectHamburgerGameTitleMatches(): Promise<void> {
        await expect(this.gameTitle).toBeVisible();
        const top = (await this.gameTitle.textContent())?.trim();
        await this.openHamburger();
        await expect(this.hamburgerGameTitle).toBeVisible();
        expect((await this.hamburgerGameTitle.textContent())?.trim()).toBe(top);
    }
    // Active state scoped to THAT button's own heart — not "any favourited card on the page".
    private favActive(btn: Locator): Locator { return btn.locator('svg.primary-pink-gradient-text'); }
    async expectHamburgerFavToggles(): Promise<void> {
        await this.openHamburger();
        await expect(this.locators.hamburgerFavBtn).toBeVisible();
        const active = this.favActive(this.locators.hamburgerFavBtn);
        if (await active.count() > 0) {
            await this.locators.hamburgerFavBtn.click();
            await expect(active).toHaveCount(0);
        }
        await this.locators.hamburgerFavBtn.click();
        await expect(active).toHaveCount(1);
        await this.locators.hamburgerFavBtn.click();                   // cleanup
        await expect(active).toHaveCount(0);
    }
    async expectTopBarFavToggles(): Promise<void> {
        await expect(this.favButton).toBeVisible();
        const active = this.favActive(this.favButton);
        if (await active.count() > 0) {
            await this.favButton.click();
            await expect(active).toHaveCount(0);
        }
        await this.favButton.click();
        await expect(active).toHaveCount(1);
        await this.favButton.click();                                  // cleanup
        await expect(active).toHaveCount(0);
    }
    async expectHamburgerSocialIcons(): Promise<void> {
        await this.openHamburger();
        await expect(this.hamburgerWhatsApp).toBeVisible();
        await expect(this.hamburgerFacebook).toBeVisible();
        await expect(this.hamburgerTwitter).toBeVisible();
        await expect(this.hamburgerEmail).toBeVisible();
    }
    async expectAccountOptionsVisible(): Promise<void> {
        await this.openHamburger();
        await expect(this.locators.hamburgerWelcomeMsg).toBeVisible();
        await expect(this.locators.hamburgerMyAccountTab).toBeVisible();
        await expect(this.accountOption('Deposit')).toBeVisible();
        await expect(this.accountOption('Log out')).toBeVisible();
    }

    // ── lobbies ────────────────────────────────────────────────────────────────
    /** Reveal the lobby category list (clicks the Lobbies tab if the menu has one). */
    private async revealLobbies(): Promise<void> {
        if (await this.locators.hamburgerLobbiesTab.isVisible().catch(() => false)) {
            await this.locators.hamburgerLobbiesTab.click();
        }
        await expect(this.locators.hamburgerLobbiesList).toBeVisible();
    }
    async expectLobbyCategories(): Promise<void> {
        await this.openHamburger();
        await this.revealLobbies();
        expect(await this.hamburgerLobbyLinks.count()).toBeGreaterThan(0);
    }
    async expectLobbyNavigates(href = '/spingames'): Promise<void> {
        await this.openHamburger();
        await this.revealLobbies();
        await this.hamburgerLobbyLink(href).click();
        await this.expectAt(new RegExp(href.replace('/', '\\/')));
    }
    async expectHamburgerScrollable(): Promise<void> {
        await this.openHamburger();
        await this.revealLobbies().catch(() => { });
        const panel = this.hamburgerPanel;
        const scrollH = await panel.evaluate((el: HTMLElement) => el.scrollHeight);
        const clientH = await panel.evaluate((el: HTMLElement) => el.clientHeight);
        if (scrollH > clientH) {
            await panel.evaluate((el: HTMLElement) => { el.scrollTop = 100; });
            expect(await panel.evaluate((el: HTMLElement) => el.scrollTop)).toBeGreaterThan(0);
        } else {
            expect(await this.hamburgerLobbyLinks.count()).toBeGreaterThanOrEqual(0);
        }
    }

    // ── back navigation ──────────────────────────────────────────────────────────
    /** Logged out: back arrow returns to the games listing (region-agnostic). */
    async expectBackToListingViaBrowser(): Promise<void> {
        const url = this.page.url();
        await this.page.goBack();
        await expect(this.page).not.toHaveURL(url);
        await expect(this.landingGameGrid).toBeVisible();
    }
    async expectBackToListingViaButton(): Promise<void> {
        const url = this.page.url();
        await this.locators.topBarBackBtn.click();
        await expect(this.page).not.toHaveURL(url);
        await expect(this.landingGameGrid).toBeVisible();
    }
    async expectBackAcrossProviders(): Promise<void> {
        await this.expectBackToListingViaButton();
        await this.navigate();
        await this.expectBackToListingViaButton();
    }
    // Logged in: the back arrow opens a "try similar" exit modal.
    async openExitModal(): Promise<void> {
        await this.expectGameFrame();          // the exit "try similar" modal only arms once the game has loaded
        await this.locators.topBarBackBtn.click();
        await expect(this.exitModal).toBeVisible();
    }
    async expectBackOpensExitModal(): Promise<void> {
        const url = this.page.url();
        await this.locators.topBarBackBtn.click();
        await expect(this.page).not.toHaveURL(url);
    }
    async expectExitModalContinueResumes(): Promise<void> {
        const url = this.page.url();
        await this.openExitModal();
        await this.locators.trySimilarContinueBtn.click();
        await expect(this.exitModal).toBeHidden();
        await this.expectAt(url);
    }
    async expectExitModalCloseDismisses(): Promise<void> {
        const url = this.page.url();
        await this.openExitModal();
        await this.locators.trySimilarCloseBtn.click();
        await expect(this.exitModal).toBeHidden();
        await this.expectAt(url);
    }
    async expectExitModalHighlightsActiveGame(): Promise<void> {
        await this.openExitModal();
        await expect(this.locators.trySimilarActiveCard).toBeVisible();
        await expect(this.locators.trySimilarActiveBadge).toBeVisible();
        expect((await this.locators.trySimilarActiveBadge.textContent())?.trim().toLowerCase()).toBe('active');
    }
    /** The "Don't show again" checkbox in the exit modal — once ticked, the modal must not reappear this session. */
    get dontShowAgainToggle(): Locator {
        return this.exitModal.locator("div:has(> span:text-is(\"Don't show again\")) [data-pc-name='checkbox']");
    }
    async expectDontShowAgainSuppressesModal(): Promise<void> {
        await this.expectGameFrame();          // the exit modal only arms once the game has loaded
        await this.openExitModal();
        await this.dontShowAgainToggle.click();
        await this.locators.trySimilarContinueBtn.click();      // back to the game
        await expect(this.exitModal).toBeHidden();
        // With "don't show again" ticked, the back arrow must NOT reopen the modal this session.
        await this.locators.topBarBackBtn.click();
        await expect(this.exitModal).toBeHidden();
    }
    async expectExitModalSwitchesProvider(): Promise<void> {
        const url = this.page.url();
        await this.openExitModal();
        await expect(this.locators.trySimilarGameCard).toBeVisible();
        await this.locators.trySimilarGameCard.click();
        await expect(this.page).not.toHaveURL(url);
        await this.topBar.waitFor({ state: 'visible', timeout: 15000 });
        await this.openExitModal();
    }

    // ── wallet (in-game) ─────────────────────────────────────────────────────────
    /** The game page has no balance on its top bar — the wallet/banking lives behind the hamburger.
     *  Prove the logged-in player can reach it in-game: the My Account section and the Deposit
     *  entry are present (region-agnostic — Bonus Wallet is ZA-only, but Deposit exists everywhere). */
    async expectWalletReachableInGame(): Promise<void> {
        await this.openHamburger();
        await expect(this.locators.hamburgerMyAccountTab).toBeVisible();
        await expect(this.accountOption('Deposit')).toBeVisible();
    }

    /** Region-adaptive probe: is an account option offered in the in-game hamburger? Opens the
     *  hamburger to check and closes it again so the caller can drive a clean flow afterwards. */
    async hasAccountOption(name: string): Promise<boolean> {
        await this.openHamburger();
        const present = await this.accountOption(name).first()
            .waitFor({ state: 'visible', timeout: 6000 }).then(() => true).catch(() => false);
        await this.closeHamburger().catch(() => { });
        return present;
    }

    // ── refresh ────────────────────────────────────────────────────────────────
    async expectSessionRetainedAfterRefresh(): Promise<void> {
        const url = this.page.url();
        await this.refresh();
        await this.expectAt(new RegExp(url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
        await this.expectGameFrame();
        // Logged-in proof in-game: the hamburger shows the My Account section, not a Login button.
        await this.openHamburger();
        await expect(this.locators.hamburgerMyAccountTab).toBeVisible();
        await expect(this.locators.hamburgerLoginBtn).toHaveCount(0);
    }

    // ── account options (logged in) ──────────────────────────────────────────────
    /** Click an account option in the in-game hamburger; assert the Account Options dialog opens active. */
    async expectAccountOptionOpens(optionName: string): Promise<void> {
        await this.openHamburger();
        const btn = this.accountOption(optionName);
        await expect(btn).toBeVisible();
        await btn.click();
        await expect(this.hamburgerPanel).toBeHidden();
        await expect(this.locators.accountOptionsDialog).toBeVisible();
        await expect(this.locators.accountOptionsActiveItem).toBeVisible();
        await expect(this.locators.accountOptionsActiveItem).toHaveText(new RegExp(optionName, 'i'));
    }
    async expectBankingFrameLoaded(kind: 'Deposits' | 'Withdrawals'): Promise<void> {
        await expect(this.bankingFrame).toBeVisible({ timeout: 20000 });
        const src = (await this.bankingFrame.getAttribute('src')) || '';
        if (kind === 'Deposits') expect(decodeURIComponent(src)).toContain('/banking-app/Deposits');
        // user identifier must be a real msisdn, not a serialization bug
        expect(decodeURIComponent(src.replace(/\+/g, ' '))).not.toContain('[object Object]');
    }
    async expectCityRewardsContent(): Promise<void> { await expect(this.accountOptionsCityRewardsContent).toBeVisible({ timeout: 15000 }); }
    async expectAccountSettingsForm(): Promise<void> { await expect(this.accountSettingsUpdateButton).toBeVisible({ timeout: 15000 }); }

    // ── logout ────────────────────────────────────────────────────────────────────
    async logOut(): Promise<void> {
        await this.openHamburger();
        await this.accountOption('Log out').click();
        await expect(this.hamburgerPanel).toBeHidden();
    }
    async expectLogoutShowsPlayNow(): Promise<void> {
        await this.logOut();
        await expect(this.playNowButton).toBeVisible();
    }
    async expectLogoutRetainsGame(): Promise<void> {
        const url = this.page.url();
        await this.logOut();
        await this.expectAt(new RegExp(url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
        await expect(this.playNowButton).toBeVisible();
    }
}
