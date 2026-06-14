import { Page, TestType, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HeaderPage } from '../pages/HeaderPage';
import { HamburgerMenuPage } from '../pages/HamburgerMenuPage';
import { HomePage } from '../pages/HomePage';
import { WinnersCirclePage } from '../pages/WinnersCirclePage';
import { GamePage } from '../pages/GamePage';
import { SearchPage } from '../pages/SearchPage';
import { TransactionHistoryPage, TransactionFilterType } from '../pages/TransactionHistoryPage';
import { PromotionsPage } from '../pages/PromotionsPage';
import { SignUpModal } from '../components/SignUpModal';
import { LoginModal } from '../components/LoginModal';

type SmokeFixtures = {
    page: Page;
    loginPage: LoginPage;
    headerPage: HeaderPage;
    hamburgerMenuPage: HamburgerMenuPage;
    homePage: HomePage;
    winnersCirclePage: WinnersCirclePage;
    gamePage: GamePage;
    searchPage: SearchPage;
    transactionHistoryPage: TransactionHistoryPage;
    promotionsPage: PromotionsPage;
    signUpModal: SignUpModal;
    loginModal: LoginModal;
    testData: any;
};

const REGION = (process.env.JPC_REGION || 'ZA').toUpperCase();
const notIn = (...regions: string[]) => !regions.includes(REGION);
const ACCOUNT_SKIP = 'Logged-in: pending verified test account (login flow currently blocked)';

async function login(loginPage: LoginPage, testData: any) {
    await loginPage.goto();
    await loginPage.clickLogin();
    await loginPage.performLogin(testData.loginValid.mobile, testData.loginValid.password);
}

/**
 * SECONDARY smoke checks (tagged [smoke][secondary]).
 *
 * Thin reuse of existing Page Object methods, same conventions as the priority suite:
 * region gating via JPC_REGION, logged-in gating via JPC_ACCOUNT_RESTRICTED, and
 * test.fixme for things not modelled / not safely automatable (RG Limit set
 * operations — the Limits PO was removed as the feature has no stable surface; Blog
 * and New Games pages — no Page Object; in-game "Don't show again"; TZ language
 * switch; event-banner deposit).
 *
 * Run just these:  npx playwright test --grep "\\[smoke\\]\\[secondary\\]"
 */
export function runSmokeSecondaryNewSuiteTests(test: TestType<SmokeFixtures, any>) {

    // ── Banners & Navigation ────────────────────────────────────────────────────
    test.describe('[smoke][secondary] Banners & Navigation', () => {
        test.beforeEach(async ({ homePage }: SmokeFixtures) => { await homePage.open(); });
        test('SS-BN-001 Homepage banners scroll', async ({ homePage }: SmokeFixtures) => {
            await homePage.expectBannerScrolls();
        });
        test('SS-BN-002 Banners render without issues', async ({ homePage }: SmokeFixtures) => {
            await homePage.expectBannerLoaded();
        });
        test('SS-BN-003 Banner CTA redirects to the intended page', async ({ homePage }: SmokeFixtures) => {
            await homePage.expectBannerActsLoggedOut();
        });
        test.fixme('SS-BN-004 Event-banner Deposit CTA opens the deposit window', async () => {
            // Event-specific banner + logged-in deposit trigger — not modelled.
        });
    });

    // ── Home Page (navigations) ──────────────────────────────────────────────────
    test.describe('[smoke][secondary] Home Page', () => {
        test.beforeEach(async ({ homePage }: SmokeFixtures) => { await homePage.open(); });
        test('SS-HP-001 Homepage loads with components rendered', async ({ homePage }: SmokeFixtures) => {
            await homePage.waitForPage();
            await homePage.expectBannerLoaded();
        });
        test('SS-HP-002 Vertical game sections are displayed', async ({ homePage }: SmokeFixtures) => {
            await homePage.expectGameTileContent();
        });
        test('SS-HP-003 Show All navigates to the vertical page', async ({ homePage }: SmokeFixtures) => {
            await homePage.openAllGamesLinkAny();
        });
        test('SS-HP-004 Footer "Show all" expands the footer content', async ({ homePage }: SmokeFixtures) => {
            await homePage.expectFooterShowAllToggles();
        });
        test('SS-HP-005 Stackpot sticky banner is displayed (ZA)', async ({ homePage }: SmokeFixtures) => {
            test.skip(notIn('ZA'), 'Stackpot is ZA only');
            await homePage.expectStackpotBanner();
        });
        test('SS-HP-006 A header nav tab navigates and becomes active', async ({ headerPage }: SmokeFixtures) => {
            await headerPage.navigateTo('/');
            await headerPage.clickNavTab('Slot Games');
            await headerPage.expectActiveNavTab('spingames');
        });
    });

    // ── Providers Page ────────────────────────────────────────────────────────────
    test.describe('[smoke][secondary] Providers Page', () => {
        test('SS-PR-001 Providers page loads with providers displayed', async ({ homePage }: SmokeFixtures) => {
            await homePage.gotoProvidersPage();
            await homePage.expectAllProviderTiles();
        });
        test('SS-PR-002 Provider logos render correctly', async ({ homePage }: SmokeFixtures) => {
            await homePage.gotoProvidersPage();
            await homePage.expectProviderTileAccessible();
        });
        test('SS-PR-003 Home providers strip scrolls horizontally', async ({ homePage }: SmokeFixtures) => {
            await homePage.open();
            await homePage.expectProvidersSection();
            await homePage.expectProvidersScroll();
        });
        test('SS-PR-004 Selecting a provider shows its game listing', async ({ homePage }: SmokeFixtures) => {
            await homePage.gotoProvidersPage();
            await homePage.openFirstProviderListing();
        });
        test('SS-PR-005 Show All redirects to the Providers page', async ({ homePage }: SmokeFixtures) => {
            await homePage.open();
            await homePage.openProvidersShowAll();
        });
    });

    // ── Theme ──────────────────────────────────────────────────────────────────────
    test.describe('[smoke][secondary] Theme', () => {
        test('SS-TH-001 Theme toggles from the header (logged out)', async ({ headerPage }: SmokeFixtures) => {
            await headerPage.navigateTo('/');
            await headerPage.expectThemeToggles();
        });
        test('SS-TH-002 Theme toggles from the hamburger menu', async ({ hamburgerMenuPage }: SmokeFixtures) => {
            await hamburgerMenuPage.goto('/');
            await hamburgerMenuPage.expectThemeToggles();
        });
        test('SS-TH-003 Selected theme persists after refresh', async ({ hamburgerMenuPage }: SmokeFixtures) => {
            await hamburgerMenuPage.goto('/');
            await hamburgerMenuPage.openMenu();
            await hamburgerMenuPage.switchToDarkTheme();
            await hamburgerMenuPage.close();
            await hamburgerMenuPage.refresh();
            await hamburgerMenuPage.expectDarkTheme();
            await hamburgerMenuPage.openMenu();          // cleanup → light
            await hamburgerMenuPage.switchToLightTheme();
        });
        test.fixme('SS-TH-004 Icons/buttons render correctly in both themes', async () => {
            // Visual rendering parity — manual / visual-diff check.
        });
    });

    // ── Favourites & Recently Played ─────────────────────────────────────────────
    test.describe('[smoke][secondary] Favourites & Recently Played', () => {
        test('SS-FAV-001 Favourite icon prompts login when logged out', async ({ homePage }: SmokeFixtures) => {
            await homePage.open();
            await homePage.expectFavouritePromptsLogin();
        });
        test('SS-FAV-002 Logged-in user can add and remove a favourite', async ({ loginPage, homePage, testData }: SmokeFixtures) => {
            test.skip(process.env.JPC_ACCOUNT_RESTRICTED === '1', ACCOUNT_SKIP);
            await login(loginPage, testData);
            await homePage.open();
            await homePage.expectCanFavouriteTrending();
        });
        test('SS-FAV-003 Favourites persist after refresh', async ({ loginPage, homePage, testData }: SmokeFixtures) => {
            test.skip(process.env.JPC_ACCOUNT_RESTRICTED === '1', ACCOUNT_SKIP);
            await login(loginPage, testData);
            await homePage.open();
            await homePage.expectFavouritePersistsAfterRefresh();
        });
        test('SS-FAV-004 A played game appears in Recently Played (latest first)', async ({ loginPage, homePage, testData }: SmokeFixtures) => {
            test.skip(process.env.JPC_ACCOUNT_RESTRICTED === '1', ACCOUNT_SKIP);
            await login(loginPage, testData);
            await homePage.open();
            const title = await homePage.playTrendingGameAndReturnHome();
            await homePage.expectRecentlyPlayedTopIs(title);
        });
        test('SS-FAV-005 A game launches from Recently Played', async ({ loginPage, homePage, testData }: SmokeFixtures) => {
            test.skip(process.env.JPC_ACCOUNT_RESTRICTED === '1', ACCOUNT_SKIP);
            await login(loginPage, testData);
            await homePage.open();
            await homePage.expectLaunchFromRecentlyPlayed();
        });
    });

    // ── Winners Carousel Bar (ZA) ────────────────────────────────────────────────
    test.describe('[smoke][secondary] Winners Carousel Bar (ZA)', () => {
        test.beforeEach(async ({ homePage }: SmokeFixtures) => {
            test.skip(notIn('ZA'), 'Winners carousel bar is ZA only');
            await homePage.open();
        });
        test('SS-WC-001 Winners carousel auto-scrolls', async ({ homePage }: SmokeFixtures) => {
            await homePage.expectBigWinnersAutoScroll();
        });
        test('SS-WC-002 Winner information is displayed accurately', async ({ homePage }: SmokeFixtures) => {
            await homePage.expectBigWinnerDetails();
        });
        test('SS-WC-003 A game launches from the Winners carousel', async ({ homePage }: SmokeFixtures) => {
            await homePage.expectBigWinnerOpensGameWithPlayNow();
        });
        test.fixme('SS-WC-004 Carousel arrow redirects to the Winners page', async () => {
            // The trailing chevron → /winners is not modelled with a method yet.
        });
    });

    // ── Winners Page (ZA & TZ) ───────────────────────────────────────────────────
    test.describe('[smoke][secondary] Winners Page', () => {
        test.beforeEach(async ({ winnersCirclePage }: SmokeFixtures) => {
            test.skip(notIn('ZA', 'TZ'), 'Winners Circle page absent on GH/MW');
            await winnersCirclePage.goto('/');
            await winnersCirclePage.open();
        });
        test('SS-WP-001 Winners page loads', async ({ winnersCirclePage }: SmokeFixtures) => {
            await winnersCirclePage.expectOnWinnersPage();
        });
        test('SS-WP-002 Winner records are displayed', async ({ winnersCirclePage }: SmokeFixtures) => {
            await winnersCirclePage.expectAllWinnersHasRows();
        });
        test('SS-WP-003 Big Winners list is displayed', async ({ winnersCirclePage }: SmokeFixtures) => {
            await winnersCirclePage.expectBigWinnersCardCount();
        });
        test('SS-WP-004 Big Winners scroll horizontally', async ({ winnersCirclePage }: SmokeFixtures) => {
            await winnersCirclePage.expectBigWinnersScrolls();
        });
        test('SS-WP-005 A game launches from the Winners page', async ({ winnersCirclePage, gamePage }: SmokeFixtures) => {
            await winnersCirclePage.launchBigWinnersGame();
            await gamePage.expectPlayNowVisible();
        });
    });

    // ── Game Page (UI) ───────────────────────────────────────────────────────────
    test.describe('[smoke][secondary] Game Page', () => {
        test.beforeEach(async ({ gamePage }: SmokeFixtures) => { await gamePage.goto('/'); await gamePage.navigate(); });
        test('SS-GP-001 Game launches and loads', async ({ gamePage }: SmokeFixtures) => {
            await gamePage.expectLoaded();
        });
        test('SS-GP-002 Game page header is displayed', async ({ gamePage }: SmokeFixtures) => {
            await gamePage.expectLoadedWithTopBar();
        });
        test('SS-GP-003 Current game title is displayed', async ({ gamePage }: SmokeFixtures) => {
            await gamePage.expectGameInfo();
        });
        test('SS-GP-004 Fullscreen mode can be entered', async ({ gamePage }: SmokeFixtures) => {
            await gamePage.expectEntersFullscreen();
        });
        test('SS-GP-005 Fullscreen mode can be exited', async ({ gamePage }: SmokeFixtures) => {
            await gamePage.expectEntersFullscreen();
            await gamePage.expectExitsFullscreen();
        });
        test('SS-GP-006 Share icon opens the share modal', async ({ gamePage }: SmokeFixtures) => {
            await gamePage.expectShareModalOpens();
        });
        test('SS-GP-007 Game category dropdown shows categories', async ({ gamePage }: SmokeFixtures) => {
            await gamePage.expectCategoryDropdown();
            await gamePage.expectCategoryExpands();
        });
        test('SS-GP-008 Another game tile launches the selected game', async ({ gamePage }: SmokeFixtures) => {
            await gamePage.expectRecommendedTileOpensGame();
        });
        test('SS-GP-009 Back arrow opens the exit modal', async ({ gamePage }: SmokeFixtures) => {
            test.skip(process.env.JPC_ACCOUNT_RESTRICTED === '1', ACCOUNT_SKIP);
            await gamePage.expectBackOpensExitModal();
        });
        test('SS-GP-010 "Continue Playing" resumes the game', async ({ gamePage }: SmokeFixtures) => {
            test.skip(process.env.JPC_ACCOUNT_RESTRICTED === '1', ACCOUNT_SKIP);
            await gamePage.expectExitModalContinueResumes();
        });
        test('SS-GP-011 Exit modal close (X) dismisses it', async ({ gamePage }: SmokeFixtures) => {
            test.skip(process.env.JPC_ACCOUNT_RESTRICTED === '1', ACCOUNT_SKIP);
            await gamePage.expectExitModalCloseDismisses();
        });
        test.fixme('SS-GP-012 "Don\'t show again" suppresses the exit modal for the session', async () => {
            // No PO method for the "Don't show again" checkbox behaviour.
        });
    });

    // ── Game Hamburger Menu (logged in) ──────────────────────────────────────────
    test.describe('[smoke][secondary] Game Hamburger Menu', () => {
        test.beforeEach(async ({ loginPage, gamePage, testData }: SmokeFixtures) => {
            test.skip(process.env.JPC_ACCOUNT_RESTRICTED === '1', ACCOUNT_SKIP);
            await login(loginPage, testData);
            await gamePage.goto('/');
            await gamePage.navigate();
        });
        test('SS-GH-001 In-game hamburger closes', async ({ gamePage }: SmokeFixtures) => {
            await gamePage.expectHamburgerCloses();
        });
        test('SS-GH-002 Hamburger shows the current game title', async ({ gamePage }: SmokeFixtures) => {
            await gamePage.expectHamburgerGameTitleMatches();
        });
        test('SS-GH-003 Favourite toggles from the hamburger', async ({ gamePage }: SmokeFixtures) => {
            await gamePage.expectHamburgerFavToggles();
        });
        test('SS-GH-004 Social share icons are shown', async ({ gamePage }: SmokeFixtures) => {
            await gamePage.expectHamburgerSocialIcons();
        });
        test('SS-GH-005 Lobby categories are listed', async ({ gamePage }: SmokeFixtures) => {
            await gamePage.expectLobbyCategories();
        });
        test('SS-GH-006 Account option opens from the hamburger', async ({ gamePage }: SmokeFixtures) => {
            await gamePage.expectAccountOptionOpens('Deposit');
        });
        test('SS-GH-007 Responsible Gaming opens from the hamburger', async ({ gamePage }: SmokeFixtures) => {
            await gamePage.expectAccountOptionOpens('Responsible Gaming');
        });
        test('SS-GH-008 Transaction Summary opens from the hamburger', async ({ gamePage }: SmokeFixtures) => {
            await gamePage.expectAccountOptionOpens('Transaction Summary');
        });
        test('SS-GH-009 Theme toggles from the game hamburger', async ({ gamePage }: SmokeFixtures) => {
            await gamePage.expectThemeToggles();
        });
        test('SS-GH-010 Logout from the game hamburger retains the game page', async ({ gamePage }: SmokeFixtures) => {
            await gamePage.expectLogoutRetainsGame();
        });
    });

    // ── Tlogs Filter (logged in) ──────────────────────────────────────────────────
    test.describe('[smoke][secondary] Tlogs Filter', () => {
        test.beforeEach(async ({ loginPage, transactionHistoryPage, testData }: SmokeFixtures) => {
            test.skip(process.env.JPC_ACCOUNT_RESTRICTED === '1', ACCOUNT_SKIP);
            await login(loginPage, testData);
            await transactionHistoryPage.open();
        });
        test('SS-TF-001 Filter popup opens', async ({ transactionHistoryPage }: SmokeFixtures) => {
            await transactionHistoryPage.openFilter();
            await transactionHistoryPage.expectFilterPromptUI();
        });
        test('SS-TF-002 Date range filter can be applied', async ({ transactionHistoryPage }: SmokeFixtures) => {
            await transactionHistoryPage.openFilter();
            await transactionHistoryPage.applyDuration('week');
            await transactionHistoryPage.expectDateRangeChosen();
        });
        test('SS-TF-003 Show Payout Only toggle works', async ({ transactionHistoryPage }: SmokeFixtures) => {
            await transactionHistoryPage.openFilter();
            await transactionHistoryPage.selectFilterTypes([TransactionFilterType.PAYOUT]);
            await transactionHistoryPage.expectPayoutToggle(true);
        });
        test('SS-TF-004 Transaction Type filter works', async ({ transactionHistoryPage }: SmokeFixtures) => {
            await transactionHistoryPage.openFilter();
            await transactionHistoryPage.selectFilterTypes([TransactionFilterType.WAGER]);
            await transactionHistoryPage.expectTypeDropdownContains('1');
        });
        test('SS-TF-005 Continue applies the filters', async ({ transactionHistoryPage }: SmokeFixtures) => {
            await transactionHistoryPage.openFilter();
            await transactionHistoryPage.applyDuration('week');
            await transactionHistoryPage.continueFilter();
            await transactionHistoryPage.expectFilterModalClosed();
        });
        test('SS-TF-006 Reset clears the filters', async ({ transactionHistoryPage }: SmokeFixtures) => {
            await transactionHistoryPage.openFilter();
            await transactionHistoryPage.selectFilterTypes([TransactionFilterType.WAGER]);
            await transactionHistoryPage.resetFilter();
            await transactionHistoryPage.expectFiltersReset();
        });
    });

    // ── New Hamburger Menu — logged out ───────────────────────────────────────────
    test.describe('[smoke][secondary] Hamburger Menu (logged out)', () => {
        test.beforeEach(async ({ hamburgerMenuPage }: SmokeFixtures) => {
            await hamburgerMenuPage.goto('/');
            await hamburgerMenuPage.openMenu();
        });
        test('SS-HM-001 Hamburger menu opens', async ({ hamburgerMenuPage }: SmokeFixtures) => {
            await hamburgerMenuPage.expectOpen();
        });
        test('SS-HM-002 Hamburger menu closes', async ({ hamburgerMenuPage }: SmokeFixtures) => {
            await hamburgerMenuPage.close();
            await hamburgerMenuPage.expectClosed();
        });
        test('SS-HM-003 Login CTA opens the login prompt', async ({ hamburgerMenuPage, loginModal }: SmokeFixtures) => {
            await hamburgerMenuPage.clickHamburgerLoginCTA();
            await loginModal.expectOpen();
        });
        test('SS-HM-004 Sign Up CTA opens the sign-up prompt', async ({ hamburgerMenuPage, signUpModal }: SmokeFixtures) => {
            await hamburgerMenuPage.clickHamburgerSignUpCTA();
            await signUpModal.expectOpen();
        });
        test('SS-HM-005 Theme toggles from the hamburger', async ({ hamburgerMenuPage }: SmokeFixtures) => {
            await hamburgerMenuPage.switchToDarkTheme();
            await hamburgerMenuPage.expectDarkTheme();
            await hamburgerMenuPage.switchToLightTheme();
        });
        test('SS-HM-006 Promotions navigation works', async ({ hamburgerMenuPage }: SmokeFixtures) => {
            await hamburgerMenuPage.promotionsCta.click();
            await hamburgerMenuPage.expectAt(/\/promotions/);
        });
        test('SS-HM-007 App download links are shown', async ({ hamburgerMenuPage }: SmokeFixtures) => {
            await hamburgerMenuPage.scrollToAppSection();
            await expect(hamburgerMenuPage.appleAppButton).toBeVisible();
            await expect(hamburgerMenuPage.androidAppButton).toBeVisible();
        });
        test.fixme('SS-HM-008 Language switch works (TZ)', async () => {
            // TZ language switcher is not modelled (no switcher found on TZ home during discovery).
        });
    });

    // ── New Hamburger Menu — logged in ────────────────────────────────────────────
    test.describe('[smoke][secondary] Hamburger Menu (logged in)', () => {
        test.beforeEach(async ({ loginPage, hamburgerMenuPage, testData }: SmokeFixtures) => {
            test.skip(process.env.JPC_ACCOUNT_RESTRICTED === '1', ACCOUNT_SKIP);
            await login(loginPage, testData);
            await hamburgerMenuPage.openMenu();
        });
        test('SS-HMI-001 User account details are displayed', async ({ hamburgerMenuPage }: SmokeFixtures) => {
            await hamburgerMenuPage.expectUserName();
            await hamburgerMenuPage.expectBalanceWidget();
        });
        test('SS-HMI-002 Transaction Summary opens', async ({ hamburgerMenuPage }: SmokeFixtures) => {
            await hamburgerMenuPage.openMyAccountOption('Transaction Summary');
            await hamburgerMenuPage.expectAccountOptionOpened('Transaction Summary');
        });
        test('SS-HMI-003 My Profile opens', async ({ hamburgerMenuPage }: SmokeFixtures) => {
            await hamburgerMenuPage.openMyAccountOption('My Profile Management');
            await hamburgerMenuPage.expectAccountOptionOpened('My Profile');
        });
        test('SS-HMI-004 Logout works', async ({ hamburgerMenuPage }: SmokeFixtures) => {
            await hamburgerMenuPage.logOut();
            await hamburgerMenuPage.expectLoggedOut();
        });
    });

    // ── Search ─────────────────────────────────────────────────────────────────────
    test.describe('[smoke][secondary] Search', () => {
        test.beforeEach(async ({ searchPage }: SmokeFixtures) => { await searchPage.goto('/'); await searchPage.open(); });
        test('SS-SR-001 Search field is shown', async ({ searchPage }: SmokeFixtures) => {
            await searchPage.expectModalOpen();
        });
        test('SS-SR-002 Searching an exact game name returns results', async ({ searchPage }: SmokeFixtures) => {
            await searchPage.search('book');
            await searchPage.expectResults();
        });
        test('SS-SR-003 Search clears via keyboard backspace', async ({ searchPage }: SmokeFixtures) => {
            await searchPage.search('book');
            await searchPage.clearByKeyboard();
            await searchPage.expectInputEmpty();
        });
        test('SS-SR-004 Search clears via the cross icon', async ({ searchPage }: SmokeFixtures) => {
            await searchPage.search('book');
            await searchPage.clearByButton();
            await searchPage.expectInputEmpty();
        });
        test('SS-SR-005 A game launches from search results', async ({ searchPage, gamePage }: SmokeFixtures) => {
            await searchPage.search('book');
            await searchPage.launchFirstResult();
            await gamePage.expectPlayNowVisible();
        });
    });

    // ── Promotions ─────────────────────────────────────────────────────────────────
    test.describe('[smoke][secondary] Promotions', () => {
        test.beforeEach(async ({ promotionsPage }: SmokeFixtures) => { await promotionsPage.open(); });
        test('SS-PM-001 Promotions page loads', async ({ promotionsPage }: SmokeFixtures) => {
            await promotionsPage.expectPageReady();
        });
        test('SS-PM-002 Promotions are listed correctly', async ({ promotionsPage }: SmokeFixtures) => {
            await promotionsPage.expectPageUI();
        });
        test('SS-PM-003 Promotion detail page shows full information', async ({ promotionsPage }: SmokeFixtures) => {
            await promotionsPage.openFirstPromo();
            await promotionsPage.expectDetailUI();
        });
        test('SS-PM-004 Promotion detail CTA prompts login when logged out', async ({ promotionsPage }: SmokeFixtures) => {
            await promotionsPage.openFirstPromo();
            await promotionsPage.expectLoggedOutOnDetail();
        });
        test('SS-PM-005 Promotion navigation returns to the list', async ({ promotionsPage }: SmokeFixtures) => {
            await promotionsPage.openFirstPromo();
            await promotionsPage.expectBackToPromotionsList();
        });
    });

    // ── Promotion Opt-In (logged in) ─────────────────────────────────────────────
    test.describe('[smoke][secondary] Promotion Opt-In', () => {
        test('SS-PO-001 User can favourite (opt into) a promotion', async ({ loginPage, promotionsPage, testData }: SmokeFixtures) => {
            test.skip(process.env.JPC_ACCOUNT_RESTRICTED === '1', ACCOUNT_SKIP);
            await login(loginPage, testData);
            await promotionsPage.open();
            await promotionsPage.addFavourite();
            await promotionsPage.removeFavourite();   // cleanup
        });
        test.fixme('SS-PO-002 Promotion status / participation reflects after opt-in', async () => {
            // Opt-in status surface beyond the favourite toggle is not modelled.
        });
    });

    // ── Blog (ZA) — not modelled ──────────────────────────────────────────────────
    test.describe('[smoke][secondary] Blog (ZA)', () => {
        test.fixme('SS-BL-001 Blog page loads, lists articles, opens an article, thumbnails load', async () => {
            // ZA-only Blog has no Page Object yet — needs discovery + a BlogPage.
        });
    });

    // ── New Games Page — not modelled ─────────────────────────────────────────────
    test.describe('[smoke][secondary] New Games Page', () => {
        test.fixme('SS-NG-001 New Games page loads, shows NEW tags, launches a game, scrolls', async () => {
            // No Page Object for the New Games page yet — needs discovery.
        });
    });

    // ── RG Limit — feature present but PO removed ─────────────────────────────────
    test.describe('[smoke][secondary] RG Limit', () => {
        test.fixme('SS-RGL-001 RG Limits section (Daily/Weekly/Monthly, set/clear, session timer)', async () => {
            // The Limits Page Object was removed; the feature is reachable via the Responsible Gaming
            // dialog but setting/clearing limits is irreversible (no teardown) — kept manual.
        });
    });
}
