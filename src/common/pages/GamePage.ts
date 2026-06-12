import { Page, Locator } from '@playwright/test';
import { loadLocatorsFromJson } from '../../global/utils/file-utils/jsonLocatorLoader';
import { getLocator } from '../../global/utils/file-utils/locatorResolver';
import { SafeActions } from '../actions/SafeActions';

export class GamePage {
    readonly page: Page;
    readonly locators: Record<string, Locator>;

    constructor(page: Page, private safeActions: SafeActions) {
        this.page = page;
        const c = loadLocatorsFromJson('gamePage');
        this.locators = {
            // navigation
            featuredGameCard:        getLocator(this.page, c['featuredGameCard']),
            // top bar
            topBar:                  getLocator(this.page, c['topBar']),
            topBarBackBtn:           getLocator(this.page, c['topBarBackBtn']),
            topBarFavBtn:            getLocator(this.page, c['topBarFavBtn']),
            topBarFavActiveBtn:      getLocator(this.page, c['topBarFavActiveBtn']),
            topBarGameTitle:         getLocator(this.page, c['topBarGameTitle']),
            topBarLikeBtn:           getLocator(this.page, c['topBarLikeBtn']),
            topBarDislikeBtn:        getLocator(this.page, c['topBarDislikeBtn']),
            topBarShareBtn:          getLocator(this.page, c['topBarShareBtn']),
            topBarMaximizeBtn:       getLocator(this.page, c['topBarMaximizeBtn']),
            topBarMinimizeBtn:       getLocator(this.page, c['topBarMinimizeBtn']),
            topBarHamburgerBtn:      getLocator(this.page, c['topBarHamburgerBtn']),
            // stackpot
            stackpotBanner:          getLocator(this.page, c['stackpotBanner']),
            // login modal
            loginModal:              getLocator(this.page, c['loginModal']),
            loginUsername:           getLocator(this.page, c['loginUsername']),
            loginPassword:           getLocator(this.page, c['loginPassword']),
            loginSubmitBtn:          getLocator(this.page, c['loginSubmitBtn']),
            // category dropdown
            categoryDropdown:        getLocator(this.page, c['categoryDropdown']),
            categoryDropdownNameBtn: getLocator(this.page, c['categoryDropdownNameBtn']),
            categoryDropdownToggle:  getLocator(this.page, c['categoryDropdownToggle']),
            // share modal
            shareModal:              getLocator(this.page, c['shareModal']),
            shareModalTitle:         getLocator(this.page, c['shareModalTitle']),
            shareModalCloseBtn:      getLocator(this.page, c['shareModalCloseBtn']),
            shareWhatsAppBtn:        getLocator(this.page, c['shareWhatsAppBtn']),
            shareFacebookBtn:        getLocator(this.page, c['shareFacebookBtn']),
            shareTwitterBtn:         getLocator(this.page, c['shareTwitterBtn']),
            shareEmailBtn:           getLocator(this.page, c['shareEmailBtn']),
            // hamburger panel
            hamburgerPanel:          getLocator(this.page, c['hamburgerPanel']),
            hamburgerLoginBtn:       getLocator(this.page, c['hamburgerLoginBtn']),
            hamburgerSignUpBtn:      getLocator(this.page, c['hamburgerSignUpBtn']),
            hamburgerThemeToggle:    getLocator(this.page, c['hamburgerThemeToggle']),
            hamburgerCloseBtn:       getLocator(this.page, c['hamburgerCloseBtn']),
            hamburgerGameTitle:      getLocator(this.page, c['hamburgerGameTitle']),
            hamburgerFavBtn:         getLocator(this.page, c['hamburgerFavBtn']),
            hamburgerFavActiveBtn:   getLocator(this.page, c['hamburgerFavActiveBtn']),
            hamburgerWhatsAppBtn:    getLocator(this.page, c['hamburgerWhatsAppBtn']),
            hamburgerFacebookBtn:    getLocator(this.page, c['hamburgerFacebookBtn']),
            hamburgerTwitterBtn:     getLocator(this.page, c['hamburgerTwitterBtn']),
            hamburgerEmailBtn:       getLocator(this.page, c['hamburgerEmailBtn']),
            hamburgerLobbiesTitle:   getLocator(this.page, c['hamburgerLobbiesTitle']),
            hamburgerLobbiesList:    getLocator(this.page, c['hamburgerLobbiesList']),
            // category dropdown expanded state
            categoryDropdownPanel:   getLocator(this.page, c['categoryDropdownPanel']),
            categoryDropdownItem:    getLocator(this.page, c['categoryDropdownItem']),
            // sign-up modal
            signUpModal:             getLocator(this.page, c['signUpModal']),
            signUpModalTitle:        getLocator(this.page, c['signUpModalTitle']),
            // logged-in hamburger
            hamburgerWelcomeMsg:     getLocator(this.page, c['hamburgerWelcomeMsg']),
            hamburgerMyAccountTab:   getLocator(this.page, c['hamburgerMyAccountTab']),
            hamburgerLobbiesTab:     getLocator(this.page, c['hamburgerLobbiesTab']),
            // account options dialog (opened by Deposit/Withdrawal/etc. in the in-game hamburger)
            accountOptionsDialog:       getLocator(this.page, c['accountOptionsDialog']),
            accountOptionsActiveItem:   getLocator(this.page, c['accountOptionsActiveItem']),
            accountOptionsBankingFrame: getLocator(this.page, c['accountOptionsBankingFrame']),
            // try similar games panel (appears when logged-in user presses back)
            trySimilarPanel:         getLocator(this.page, c['trySimilarPanel']),
            trySimilarCloseBtn:      getLocator(this.page, c['trySimilarCloseBtn']),
            trySimilarContinueBtn:   getLocator(this.page, c['trySimilarContinueBtn']),
            trySimilarGameCard:      getLocator(this.page, c['trySimilarGameCard']),
            trySimilarActiveCard:    getLocator(this.page, c['trySimilarActiveCard']),
            trySimilarActiveBadge:   getLocator(this.page, c['trySimilarActiveBadge']),
            // game info
            gameMinBet:              getLocator(this.page, c['gameMinBet']),
        };
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
}
