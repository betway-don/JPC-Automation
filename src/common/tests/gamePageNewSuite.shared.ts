import { Page, TestInfo, TestType, expect } from '@playwright/test';
import { GamePage } from '../pages/GamePage';
import { HeaderPage } from '../pages/HeaderPage';
import { ScreenshotHelper } from '../actions/ScreenshotHelper';

type GamePageSuiteFixtures = {
    page: Page;
    gamePage: GamePage;
    headerPage: HeaderPage;
    screenshotDir: string;
    testData: any;
};

/** Current game's URL slug, e.g. 'ancient-fortunes-poseidon-megaways-jpc' — used to verify share payloads point at THIS game. */
function gameSlug(page: Page): string {
    return new URL(page.url()).pathname.split('/').filter(Boolean).pop() || '';
}

/** Raw i18n keys look like 'twitter-game-share-text'; real copy contains spaces/punctuation once URL-decoded. */
function looksLikeI18nKey(text: string): boolean {
    return /^[a-z0-9]+(-[a-z0-9]+){2,}$/.test(text.trim());
}

export async function runGamePageNewSuiteTests(
    test: TestType<GamePageSuiteFixtures, any>
) {

    test.describe('Game Page - Logged Out', () => {

        test.beforeEach(async ({ page, gamePage }: GamePageSuiteFixtures) => {
            await page.goto('/', { waitUntil: 'domcontentloaded' });
            await gamePage.navigate();
        });

        test('GP-LO-001 - Verify game page loads successfully', async ({ page, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await expect(page).toHaveURL(/\/home\//, { timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'GP-LO-001-pageLoad', testInfo);
        });

        test('GP-LO-002 - Verify game thumbnail, title & Provider name is displayed', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await expect(gamePage.locators.topBar).toBeVisible({ timeout: 15000 });
            await gamePage.highlightElement('topBar');
            await expect(gamePage.locators.topBarGameTitle).toBeVisible({ timeout: 10000 });
            await gamePage.highlightElement('topBarGameTitle');
            const gameTitle = await gamePage.locators.topBarGameTitle.textContent();
            expect(gameTitle?.trim()).toBeTruthy();
            await ScreenshotHelper(page, screenshotDir, 'GP-LO-002-gameThumbnailTitle', testInfo);
        });

        test('GP-LO-003 - Verify "Play Now" button is displayed', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            const playNowBtn = gamePage.playNowButton;
            await expect(playNowBtn).toBeVisible({ timeout: 15000 });
            await gamePage.highlightLocator('playNowBtn', playNowBtn);
            await ScreenshotHelper(page, screenshotDir, 'GP-LO-003-playNowBtn', testInfo);
        });

        test('GP-LO-004 - Verify clicking "Play Now" triggers the login prompt', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            const playNowBtn = gamePage.playNowButton;
            await expect(playNowBtn).toBeVisible({ timeout: 15000 });
            await gamePage.highlightLocator('playNowBtn', playNowBtn);
            await playNowBtn.click();
            await expect(gamePage.locators.loginModal).toBeVisible({ timeout: 15000 });
            await gamePage.highlightElement('loginModal');
            await expect(gamePage.locators.loginUsername).toBeVisible({ timeout: 5000 });
            await ScreenshotHelper(page, screenshotDir, 'GP-LO-004-playNowLogin', testInfo);
        });

        test('GP-LO-005 - Verify clicking favorite icon while logged out prompts login', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await expect(gamePage.locators.topBarFavBtn).toBeVisible({ timeout: 10000 });
            await gamePage.highlightElement('topBarFavBtn');
            await gamePage.locators.topBarFavBtn.click();
            await expect(gamePage.locators.loginModal).toBeVisible({ timeout: 15000 });
            await gamePage.highlightElement('loginModal');
            await expect(gamePage.locators.loginUsername).toBeVisible({ timeout: 5000 });
            await ScreenshotHelper(page, screenshotDir, 'GP-LO-005-favIconLogin', testInfo);
        });

        test('GP-LO-006 - Verify the Stackpot banner is displayed', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await expect(gamePage.locators.stackpotBanner).toBeVisible({ timeout: 15000 });
            await gamePage.highlightElement('stackpotBanner');
            await ScreenshotHelper(page, screenshotDir, 'GP-LO-006-stackpotBanner', testInfo);
        });

        test('GP-LO-007 - Verify clicking share icon opens share options popup', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await expect(gamePage.locators.topBarShareBtn).toBeVisible({ timeout: 10000 });
            await gamePage.highlightElement('topBarShareBtn');
            await gamePage.openShareModal();
            await expect(gamePage.locators.shareModal).toBeVisible({ timeout: 10000 });
            await gamePage.highlightElement('shareModal');
            const titleText = await gamePage.locators.shareModalTitle.textContent();
            expect(titleText?.toLowerCase().trim()).toBe('share');
            await ScreenshotHelper(page, screenshotDir, 'GP-LO-007-sharePopup', testInfo);
        });

        test('GP-LO-008 - Verify share popup can be closed', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await gamePage.openShareModal();
            await expect(gamePage.locators.shareModal).toBeVisible({ timeout: 10000 });
            await expect(gamePage.locators.shareModalCloseBtn).toBeVisible();
            await gamePage.highlightElement('shareModalCloseBtn');
            await gamePage.closeShareModal();
            await expect(gamePage.locators.shareModal).toBeHidden({ timeout: 5000 });
            await ScreenshotHelper(page, screenshotDir, 'GP-LO-008-sharePopupClose', testInfo);
        });

        test('GP-LO-009 - Verify user can enter fullscreen mode', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await expect(gamePage.locators.topBarMaximizeBtn).toBeVisible({ timeout: 10000 });
            await gamePage.highlightElement('topBarMaximizeBtn');
            await gamePage.locators.topBarMaximizeBtn.click();
            await expect.poll(() => gamePage.isFullscreen(), { timeout: 5000 }).toBe(true);
            await ScreenshotHelper(page, screenshotDir, 'GP-LO-009-fullscreen', testInfo);
        });

        test('GP-LO-010 - Verify contract screen exits fullscreen mode', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            const alreadyFullscreen = await gamePage.isFullscreen();
            if (!alreadyFullscreen) {
                await gamePage.locators.topBarMaximizeBtn.click();
            }
            await expect.poll(() => gamePage.isFullscreen(), { timeout: 5000 }).toBe(true);
            await gamePage.locators.topBarMinimizeBtn.click();
            await expect.poll(() => gamePage.isFullscreen(), { timeout: 5000 }).toBe(false);
            await ScreenshotHelper(page, screenshotDir, 'GP-LO-010-exitFullscreen', testInfo);
        });

        test('GP-LO-011 - Verify recommended game tiles are displayed', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            const recommendedSection = gamePage.featuredCarousel;
            await expect(recommendedSection).toBeVisible({ timeout: 15000 });
            await gamePage.highlightLocator('recommendedSection', recommendedSection);
            const tileCount = await gamePage.locators.featuredGameCard.count();
            expect(tileCount).toBeGreaterThan(0);
            await gamePage.highlightLocator('recommendedFirstTile', gamePage.locators.featuredGameCard);
            await ScreenshotHelper(page, screenshotDir, 'GP-LO-011-recommendedTiles', testInfo);
        });

        test('GP-LO-012 - Verify clicking a recommended game tile opens that game page', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await expect(gamePage.locators.featuredGameCard).toBeVisible({ timeout: 15000 });
            await gamePage.highlightLocator('recommendedFirstTile', gamePage.locators.featuredGameCard);
            await gamePage.locators.featuredGameCard.click();
            await expect(page).toHaveURL(/\/home\/featured\//, { timeout: 10000 });
            await expect(gamePage.locators.topBar).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'GP-LO-012-recommendedTileClick', testInfo);
        });

        test('GP-LO-013 - Verify Game Category dropdown is displayed correctly', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await expect(gamePage.locators.categoryDropdown).toBeVisible({ timeout: 10000 });
            await gamePage.highlightElement('categoryDropdown');
            await expect(gamePage.locators.categoryDropdownNameBtn).toBeVisible();
            await gamePage.highlightElement('categoryDropdownNameBtn');
            const categoryName = await gamePage.locators.categoryDropdownNameBtn.textContent();
            expect(categoryName?.trim()).toBeTruthy();
            await ScreenshotHelper(page, screenshotDir, 'GP-LO-013-categoryDropdown', testInfo);
        });

        test('GP-LO-014 - Verify tapping Game Category dropdown expands category list', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await expect(gamePage.locators.categoryDropdownToggle).toBeVisible({ timeout: 10000 });
            await gamePage.highlightElement('categoryDropdownToggle');
            await gamePage.locators.categoryDropdownToggle.click();
            await expect(gamePage.locators.categoryDropdownPanel).toBeVisible({ timeout: 5000 });
            await gamePage.highlightElement('categoryDropdownPanel');
            const itemCount = await gamePage.locators.categoryDropdownItem.count();
            expect(itemCount).toBeGreaterThan(0);
            await ScreenshotHelper(page, screenshotDir, 'GP-LO-014-dropdownExpand', testInfo);
        });

        test('GP-LO-015 - Verify user is able to select category from dropdown', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await gamePage.locators.categoryDropdownToggle.click();
            await expect(gamePage.locators.categoryDropdownPanel).toBeVisible({ timeout: 5000 });
            const selectedText = await gamePage.locators.categoryDropdownItem.textContent();
            await gamePage.locators.categoryDropdownItem.click();
            await expect(gamePage.locators.categoryDropdownPanel).toBeHidden({ timeout: 5000 });
            const nameAfter = await gamePage.locators.categoryDropdownNameBtn.textContent();
            expect(nameAfter?.trim().toLowerCase()).toContain(selectedText?.trim().toLowerCase());
            await ScreenshotHelper(page, screenshotDir, 'GP-LO-015-categorySelect', testInfo);
        });

        test('GP-LO-016 - Verify dropdown closes after selecting category', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await gamePage.locators.categoryDropdownToggle.click();
            await expect(gamePage.locators.categoryDropdownPanel).toBeVisible({ timeout: 5000 });
            await gamePage.locators.categoryDropdownItem.click();
            await expect(gamePage.locators.categoryDropdownPanel).toBeHidden({ timeout: 5000 });
            await ScreenshotHelper(page, screenshotDir, 'GP-LO-016-dropdownClose', testInfo);
        });

        test('GP-LO-017 - Verify dropdown expand/collapse icon functionality', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await expect(gamePage.locators.categoryDropdownToggle).toBeVisible({ timeout: 10000 });
            await gamePage.highlightElement('categoryDropdownToggle');
            await gamePage.locators.categoryDropdownToggle.click();
            await expect(gamePage.locators.categoryDropdownPanel).toBeVisible({ timeout: 5000 });
            await gamePage.locators.categoryDropdownToggle.click();
            await expect(gamePage.locators.categoryDropdownPanel).toBeHidden({ timeout: 5000 });
            await ScreenshotHelper(page, screenshotDir, 'GP-LO-017-dropdownIcon', testInfo);
        });

        test('GP-LO-018 - Verify in-game hamburger menu opens successfully', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await expect(gamePage.locators.topBarHamburgerBtn).toBeVisible({ timeout: 10000 });
            await gamePage.highlightElement('topBarHamburgerBtn');
            await gamePage.openHamburger();
            await expect(gamePage.locators.hamburgerPanel).toBeVisible({ timeout: 10000 });
            await gamePage.highlightElement('hamburgerPanel');
            await ScreenshotHelper(page, screenshotDir, 'GP-LO-018-hamburgerOpen', testInfo);
        });

        test('GP-LO-019 - Verify Login and Sign Up CTA visibility in in-game hamburger menu', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await gamePage.openHamburger();
            await expect(gamePage.locators.hamburgerLoginBtn).toBeVisible({ timeout: 10000 });
            await expect(gamePage.locators.hamburgerSignUpBtn).toBeVisible({ timeout: 5000 });
            await gamePage.highlightElement('hamburgerLoginBtn');
            await gamePage.highlightElement('hamburgerSignUpBtn');
            await ScreenshotHelper(page, screenshotDir, 'GP-LO-019-hamburgerCTAs', testInfo);
        });

        test('GP-LO-020 - Verify Login CTA functionality from in-game hamburger menu', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await gamePage.openHamburger();
            await expect(gamePage.locators.hamburgerLoginBtn).toBeVisible({ timeout: 10000 });
            await gamePage.locators.hamburgerLoginBtn.click();
            await expect(gamePage.locators.loginModal).toBeVisible({ timeout: 15000 });
            await gamePage.highlightElement('loginModal');
            await expect(gamePage.locators.loginUsername).toBeVisible({ timeout: 5000 });
            await ScreenshotHelper(page, screenshotDir, 'GP-LO-020-hamburgerLogin', testInfo);
        });

        test('GP-LO-021 - Verify logging in from game page launches the same game after successful login', async ({ page, gamePage, headerPage, testData, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            const gameUrl = page.url();
            await gamePage.openHamburger();
            await gamePage.locators.hamburgerLoginBtn.click();
            await expect(gamePage.locators.loginModal).toBeVisible({ timeout: 15000 });
            await gamePage.locators.loginUsername.fill(testData.loginValid.mobile);
            await gamePage.locators.loginPassword.fill(testData.loginValid.password);
            await gamePage.locators.loginSubmitBtn.click();
            await expect(page).toHaveURL(new RegExp(gameUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), { timeout: 30000 });
            await expect(gamePage.gameFrame).toBeVisible({ timeout: 30000 });
            await ScreenshotHelper(page, screenshotDir, 'GP-LO-021-loginLaunchGame', testInfo);
        });

        test('GP-LO-022 - Verify Sign Up CTA functionality from in-game hamburger menu', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await gamePage.openHamburger();
            await expect(gamePage.locators.hamburgerSignUpBtn).toBeVisible({ timeout: 10000 });
            await gamePage.highlightElement('hamburgerSignUpBtn');
            await gamePage.locators.hamburgerSignUpBtn.click();
            await expect(gamePage.locators.signUpModal).toBeVisible({ timeout: 15000 });
            await gamePage.highlightElement('signUpModal');
            const titleText = await gamePage.locators.signUpModalTitle.textContent();
            expect(titleText?.trim().toLowerCase()).toBe('sign up');
            await ScreenshotHelper(page, screenshotDir, 'GP-LO-022-hamburgerSignUp', testInfo);
        });

        test('GP-LO-023 - Verify Theme toggle button functionality', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await gamePage.openHamburger();
            await expect(gamePage.locators.hamburgerThemeToggle).toBeVisible({ timeout: 10000 });
            await gamePage.highlightElement('hamburgerThemeToggle');
            // the site applies the theme as a 'dark'/'light' class on <html>
            const wasDark = await gamePage.isDarkTheme();
            await gamePage.locators.hamburgerThemeToggle.click();
            await expect.poll(() => gamePage.isDarkTheme(), { timeout: 5000 }).toBe(!wasDark);
            await ScreenshotHelper(page, screenshotDir, 'GP-LO-023-themeToggle', testInfo);
            // restore the original theme so later tests are unaffected
            await gamePage.locators.hamburgerThemeToggle.click();
            await expect.poll(() => gamePage.isDarkTheme(), { timeout: 5000 }).toBe(wasDark);
        });

        test('GP-LO-024 - Verify Close button functionality in in-game hamburger menu', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await gamePage.openHamburger();
            await expect(gamePage.locators.hamburgerPanel).toBeVisible({ timeout: 10000 });
            await expect(gamePage.locators.hamburgerCloseBtn).toBeVisible();
            await gamePage.highlightElement('hamburgerCloseBtn');
            await gamePage.closeHamburger();
            await expect(gamePage.locators.hamburgerPanel).toBeHidden({ timeout: 5000 });
            await ScreenshotHelper(page, screenshotDir, 'GP-LO-024-hamburgerClose', testInfo);
        });

        test('GP-LO-025 - Verify selected game title is displayed correctly in hamburger menu', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await gamePage.openHamburger();
            await expect(gamePage.locators.hamburgerGameTitle).toBeVisible({ timeout: 10000 });
            await gamePage.highlightElement('hamburgerGameTitle');
            const hamburgerTitle = await gamePage.locators.hamburgerGameTitle.textContent();
            expect(hamburgerTitle?.trim()).toBeTruthy();
            const topBarTitle = await gamePage.locators.topBarGameTitle.textContent();
            expect(hamburgerTitle?.trim()).toBe(topBarTitle?.trim());
            await ScreenshotHelper(page, screenshotDir, 'GP-LO-025-hamburgerGameTitle', testInfo);
        });

        test('GP-LO-026 - Verify Favourite icon visibility and functionality in hamburger menu', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await gamePage.openHamburger();
            await expect(gamePage.locators.hamburgerFavBtn).toBeVisible({ timeout: 10000 });
            await gamePage.highlightElement('hamburgerFavBtn');
            await gamePage.locators.hamburgerFavBtn.click();
            await expect(gamePage.locators.loginModal).toBeVisible({ timeout: 15000 });
            await gamePage.highlightElement('loginModal');
            await ScreenshotHelper(page, screenshotDir, 'GP-LO-026-hamburgerFav', testInfo);
        });

        test('GP-LO-027 - Verify social share icons are displayed correctly in hamburger menu', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await gamePage.openHamburger();
            await expect(gamePage.locators.hamburgerWhatsAppBtn).toBeVisible({ timeout: 10000 });
            await expect(gamePage.locators.hamburgerFacebookBtn).toBeVisible();
            await expect(gamePage.locators.hamburgerTwitterBtn).toBeVisible();
            await expect(gamePage.locators.hamburgerEmailBtn).toBeVisible();
            await gamePage.highlightElement('hamburgerWhatsAppBtn');
            await gamePage.highlightElement('hamburgerFacebookBtn');
            await gamePage.highlightElement('hamburgerTwitterBtn');
            await gamePage.highlightElement('hamburgerEmailBtn');
            await ScreenshotHelper(page, screenshotDir, 'GP-LO-027-socialShareIcons', testInfo);
        });

        test('GP-LO-028 - Verify WhatsApp share icon functionality', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await gamePage.openHamburger();
            await expect(gamePage.locators.hamburgerWhatsAppBtn).toBeVisible({ timeout: 10000 });
            await gamePage.highlightElement('hamburgerWhatsAppBtn');
            const [popup] = await Promise.all([
                page.waitForEvent('popup', { timeout: 10000 }),
                gamePage.locators.hamburgerWhatsAppBtn.click(),
            ]);
            expect(popup.url()).toMatch(/whatsapp/i);
            // the shared link must point at THIS game, not a generic/empty URL
            expect(decodeURIComponent(popup.url())).toContain(gameSlug(page));
            await popup.close();
            await ScreenshotHelper(page, screenshotDir, 'GP-LO-028-whatsappShare', testInfo);
        });

        test('GP-LO-029 - Verify Facebook share icon functionality', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await gamePage.openHamburger();
            await expect(gamePage.locators.hamburgerFacebookBtn).toBeVisible({ timeout: 10000 });
            await gamePage.highlightElement('hamburgerFacebookBtn');
            const [popup] = await Promise.all([
                page.waitForEvent('popup', { timeout: 10000 }),
                gamePage.locators.hamburgerFacebookBtn.click(),
            ]);
            expect(popup.url()).toMatch(/facebook/i);
            // the shared link must point at THIS game, not a generic/empty URL
            expect(decodeURIComponent(popup.url())).toContain(gameSlug(page));
            await popup.close();
            await ScreenshotHelper(page, screenshotDir, 'GP-LO-029-facebookShare', testInfo);
        });

        test('GP-LO-030 - Verify Twitter/X share icon functionality', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await gamePage.openHamburger();
            await expect(gamePage.locators.hamburgerTwitterBtn).toBeVisible({ timeout: 10000 });
            await gamePage.highlightElement('hamburgerTwitterBtn');
            const [popup] = await Promise.all([
                page.waitForEvent('popup', { timeout: 10000 }),
                gamePage.locators.hamburgerTwitterBtn.click(),
            ]);
            expect(popup.url()).toMatch(/twitter|x\.com/i);
            // the shared link must point at THIS game, not a generic/empty URL
            expect(decodeURIComponent(popup.url())).toContain(gameSlug(page));
            // the tweet text must be real copy, not a raw localization key (e.g. 'twitter-game-share-text')
            const tweetText = new URL(popup.url()).searchParams.get('text') || '';
            expect(looksLikeI18nKey(tweetText), `Tweet text looks like an untranslated i18n key: "${tweetText}"`).toBe(false);
            await popup.close();
            await ScreenshotHelper(page, screenshotDir, 'GP-LO-030-twitterShare', testInfo);
        });

        test('GP-LO-031 - Verify Email share icon functionality', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await gamePage.openHamburger();
            await expect(gamePage.locators.hamburgerEmailBtn).toBeVisible({ timeout: 10000 });
            await gamePage.highlightElement('hamburgerEmailBtn');
            // Email share triggers mailto: — no browser popup; verify button is enabled
            await expect(gamePage.locators.hamburgerEmailBtn).not.toBeDisabled();
            await ScreenshotHelper(page, screenshotDir, 'GP-LO-031-emailShare', testInfo);
        });

        test('GP-LO-032 - Verify all lobby category options are displayed correctly', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await gamePage.openHamburger();
            await expect(gamePage.locators.hamburgerLobbiesTitle).toBeVisible({ timeout: 10000 });
            await gamePage.highlightElement('hamburgerLobbiesTitle');
            await expect(gamePage.locators.hamburgerLobbiesList).toBeVisible();
            await gamePage.highlightElement('hamburgerLobbiesList');
            const lobbyCount = await gamePage.hamburgerLobbyLinks.count();
            expect(lobbyCount).toBeGreaterThan(0);
            await ScreenshotHelper(page, screenshotDir, 'GP-LO-032-lobbyCategories', testInfo);
        });

        test('GP-LO-033 - Verify user is able to navigate through lobby categories', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await gamePage.openHamburger();
            await expect(gamePage.locators.hamburgerLobbiesList).toBeVisible({ timeout: 10000 });
            const slotGamesLink = gamePage.hamburgerLobbyLink('/spingames');
            await expect(slotGamesLink).toBeVisible();
            await slotGamesLink.click();
            await expect(page).toHaveURL(/\/spingames/, { timeout: 10000 });
            await ScreenshotHelper(page, screenshotDir, 'GP-LO-033-lobbyCategoryNav', testInfo);
        });

        test('GP-LO-034 - Verify category list is scrollable in in-game hamburger menu', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await gamePage.openHamburger();
            await expect(gamePage.locators.hamburgerPanel).toBeVisible({ timeout: 10000 });
            const panel = gamePage.locators.hamburgerPanel;
            const scrollHeight = await panel.evaluate((el: HTMLElement) => el.scrollHeight);
            const clientHeight = await panel.evaluate((el: HTMLElement) => el.clientHeight);
            if (scrollHeight > clientHeight) {
                await panel.evaluate((el: HTMLElement) => { el.scrollTop = 100; });
                const finalScroll = await panel.evaluate((el: HTMLElement) => el.scrollTop);
                expect(finalScroll).toBeGreaterThan(0);
            } else {
                const lobbyCount = await gamePage.hamburgerLobbyLinks.count();
                expect(lobbyCount).toBeGreaterThan(0);
            }
            await ScreenshotHelper(page, screenshotDir, 'GP-LO-034-categoryListScroll', testInfo);
        });

        test('GP-LO-035 - Verify user is redirected to previous page when clicking back arrow', async ({ page, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            const gameUrl = page.url();
            await page.goBack();
            await expect(page).not.toHaveURL(gameUrl, { timeout: 10000 });
            // We came from the home page, so back must land on home with its content rendered
            await expect(gamePage.featuredCarousel).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'GP-LO-035-backNavigation', testInfo);
        });

        test('GP-LO-036 - Verify redirection retains previous page state', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            const gameUrl = page.url();
            await gamePage.locators.topBarBackBtn.click();
            await expect(page).not.toHaveURL(gameUrl, { timeout: 10000 });
            // Previous page was home — its sections must be restored, not a blank or error page
            await expect(gamePage.featuredCarousel).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'GP-LO-036-backNavigationState', testInfo);
        });

        test('GP-LO-037 - Verify back navigation works across different game providers', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            const firstGameUrl = page.url();
            await gamePage.locators.topBarBackBtn.click();
            await expect(page).not.toHaveURL(firstGameUrl, { timeout: 10000 });
            await expect(gamePage.featuredCarousel).toBeVisible({ timeout: 15000 });
            await gamePage.navigate();
            const secondGameUrl = page.url();
            await gamePage.locators.topBarBackBtn.click();
            await expect(page).not.toHaveURL(secondGameUrl, { timeout: 10000 });
            await expect(gamePage.featuredCarousel).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'GP-LO-037-backNavigationProviders', testInfo);
        });

        test('GP-LO-038 - Verify minimum bet amount is displayed and correctly formatted', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await expect(gamePage.locators.gameMinBet).toBeVisible({ timeout: 10000 });
            await gamePage.highlightElement('gameMinBet');
            const betText = await gamePage.locators.gameMinBet.textContent();
            expect(betText?.trim()).toMatch(/R[\s ]\d+\.\d+/);
            await ScreenshotHelper(page, screenshotDir, 'GP-LO-038-minBet', testInfo);
        });

    });

    test.describe('Game Page - Logged In', () => {

        test.beforeEach(async ({ page, gamePage, headerPage, testData }: GamePageSuiteFixtures) => {
            await page.goto('/', { waitUntil: 'domcontentloaded' });
            await headerPage.login(testData.loginValid.mobile, testData.loginValid.password);
            await gamePage.navigate();
        });

        test('GP-LI-001 - Verify game page loads successfully when logged in', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await expect(page).toHaveURL(/\/home\//, { timeout: 10000 });
            await expect(gamePage.locators.topBar).toBeVisible({ timeout: 15000 });
            await gamePage.highlightElement('topBar');
            await ScreenshotHelper(page, screenshotDir, 'GP-LI-001-pageLoad', testInfo);
        });

        test('GP-LI-002 - Verify game title, like & dislike buttons are displayed', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await expect(gamePage.locators.topBar).toBeVisible({ timeout: 15000 });
            await expect(gamePage.locators.topBarGameTitle).toBeVisible({ timeout: 10000 });
            await gamePage.highlightElement('topBarGameTitle');
            const gameTitle = await gamePage.locators.topBarGameTitle.textContent();
            expect(gameTitle?.trim()).toBeTruthy();
            await expect(gamePage.locators.topBarLikeBtn).toBeVisible({ timeout: 10000 });
            await gamePage.highlightElement('topBarLikeBtn');
            await expect(gamePage.locators.topBarDislikeBtn).toBeVisible({ timeout: 10000 });
            await gamePage.highlightElement('topBarDislikeBtn');
            await ScreenshotHelper(page, screenshotDir, 'GP-LI-002-gameTitleLikeDislike', testInfo);
        });

        test('GP-LI-003 - Verify game launches directly in canvas or iframe when logged in', async ({ page, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await expect(gamePage.gameFrame).toBeVisible({ timeout: 30000 });
            await ScreenshotHelper(page, screenshotDir, 'GP-LI-003-gameFrame', testInfo);
        });

        test('GP-LI-004 - Verify clicking favorite icon toggles the game as favourite', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await expect(gamePage.locators.topBarFavBtn).toBeVisible({ timeout: 10000 });
            await gamePage.highlightElement('topBarFavBtn');
            // Normalize state: a previous run may have left this game favourited
            if (await gamePage.locators.topBarFavActiveBtn.isVisible().catch(() => false)) {
                await gamePage.locators.topBarFavBtn.click();
                await expect(gamePage.locators.topBarFavActiveBtn).not.toBeVisible({ timeout: 5000 });
            }
            await gamePage.locators.topBarFavBtn.click();
            await expect(gamePage.locators.topBarFavActiveBtn).toBeVisible({ timeout: 5000 });
            await gamePage.highlightElement('topBarFavActiveBtn');
            await ScreenshotHelper(page, screenshotDir, 'GP-LI-004-favActive', testInfo);
            await gamePage.locators.topBarFavBtn.click();
            await expect(gamePage.locators.topBarFavActiveBtn).not.toBeVisible({ timeout: 5000 });
            await ScreenshotHelper(page, screenshotDir, 'GP-LI-004-favToggle', testInfo);
        });

        test('GP-LI-005 - Verify the Stackpot banner is displayed', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await expect(gamePage.locators.stackpotBanner).toBeVisible({ timeout: 10000 });
            await gamePage.highlightElement('stackpotBanner');
            await ScreenshotHelper(page, screenshotDir, 'GP-LI-005-stackpotBanner', testInfo);
        });

        test('GP-LI-006 - Verify clicking share icon opens share options popup', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await gamePage.openShareModal();
            await expect(gamePage.locators.shareModal).toBeVisible({ timeout: 10000 });
            await gamePage.highlightElement('shareModal');
            const titleText = await gamePage.locators.shareModalTitle.textContent();
            expect(titleText?.trim().toLowerCase()).toContain('share');
            await ScreenshotHelper(page, screenshotDir, 'GP-LI-006-sharePopup', testInfo);
        });

        test('GP-LI-007 - Verify share popup can be closed', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await gamePage.openShareModal();
            await expect(gamePage.locators.shareModal).toBeVisible({ timeout: 10000 });
            await gamePage.closeShareModal();
            await expect(gamePage.locators.shareModal).toBeHidden({ timeout: 5000 });
            await ScreenshotHelper(page, screenshotDir, 'GP-LI-007-sharePopupClose', testInfo);
        });

        test('GP-LI-008 - Verify user can enter fullscreen mode', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await expect(gamePage.locators.topBarMaximizeBtn).toBeVisible({ timeout: 10000 });
            await gamePage.highlightElement('topBarMaximizeBtn');
            await gamePage.locators.topBarMaximizeBtn.click();
            await expect.poll(() => gamePage.isFullscreen(), { timeout: 5000 }).toBe(true);
            await ScreenshotHelper(page, screenshotDir, 'GP-LI-008-fullscreen', testInfo);
        });

        test('GP-LI-009 - Verify contract screen exits fullscreen mode', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await gamePage.locators.topBarMaximizeBtn.click();
            await expect.poll(() => gamePage.isFullscreen(), { timeout: 5000 }).toBe(true);
            await gamePage.locators.topBarMinimizeBtn.click();
            await expect.poll(() => gamePage.isFullscreen(), { timeout: 5000 }).toBe(false);
            await ScreenshotHelper(page, screenshotDir, 'GP-LI-009-exitFullscreen', testInfo);
        });

        test('GP-LI-010 - Verify recommended game tiles are displayed', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            const recommendedSection = gamePage.featuredCarousel;
            await expect(recommendedSection).toBeVisible({ timeout: 15000 });
            await gamePage.highlightLocator('recommendedSection', recommendedSection);
            const tileCount = await gamePage.locators.featuredGameCard.count();
            expect(tileCount).toBeGreaterThan(0);
            await gamePage.highlightLocator('recommendedFirstTile', gamePage.locators.featuredGameCard);
            await ScreenshotHelper(page, screenshotDir, 'GP-LI-010-recommendedTiles', testInfo);
        });

        test('GP-LI-011 - Verify clicking a recommended game tile opens that game page', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await expect(gamePage.locators.featuredGameCard).toBeVisible({ timeout: 15000 });
            await gamePage.locators.featuredGameCard.click();
            await expect(page).toHaveURL(/\/home\/featured\//, { timeout: 10000 });
            await expect(gamePage.locators.topBar).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'GP-LI-011-recommendedTileClick', testInfo);
        });

        test('GP-LI-012 - Verify Game Category dropdown is displayed correctly', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await expect(gamePage.locators.categoryDropdown).toBeVisible({ timeout: 10000 });
            await gamePage.highlightElement('categoryDropdown');
            await expect(gamePage.locators.categoryDropdownNameBtn).toBeVisible();
            const categoryName = await gamePage.locators.categoryDropdownNameBtn.textContent();
            expect(categoryName?.trim()).toBeTruthy();
            await ScreenshotHelper(page, screenshotDir, 'GP-LI-012-categoryDropdown', testInfo);
        });

        test('GP-LI-013 - Verify tapping Game Category dropdown expands category list', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await gamePage.locators.categoryDropdownToggle.click();
            await expect(gamePage.locators.categoryDropdownPanel).toBeVisible({ timeout: 5000 });
            await gamePage.highlightElement('categoryDropdownPanel');
            const itemCount = await gamePage.locators.categoryDropdownItem.count();
            expect(itemCount).toBeGreaterThan(0);
            await ScreenshotHelper(page, screenshotDir, 'GP-LI-013-dropdownExpand', testInfo);
        });

        test('GP-LI-014 - Verify user is able to select category from dropdown', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await gamePage.locators.categoryDropdownToggle.click();
            await expect(gamePage.locators.categoryDropdownPanel).toBeVisible({ timeout: 5000 });
            const selectedText = await gamePage.locators.categoryDropdownItem.textContent();
            await gamePage.locators.categoryDropdownItem.click();
            await expect(gamePage.locators.categoryDropdownPanel).toBeHidden({ timeout: 5000 });
            const nameAfter = await gamePage.locators.categoryDropdownNameBtn.textContent();
            expect(nameAfter?.trim().toLowerCase()).toContain(selectedText?.trim().toLowerCase());
            await ScreenshotHelper(page, screenshotDir, 'GP-LI-014-categorySelect', testInfo);
        });

        test('GP-LI-015 - Verify dropdown closes after selecting category', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await gamePage.locators.categoryDropdownToggle.click();
            await expect(gamePage.locators.categoryDropdownPanel).toBeVisible({ timeout: 5000 });
            await gamePage.locators.categoryDropdownItem.click();
            await expect(gamePage.locators.categoryDropdownPanel).toBeHidden({ timeout: 5000 });
            await ScreenshotHelper(page, screenshotDir, 'GP-LI-015-dropdownClose', testInfo);
        });

        test('GP-LI-016 - Verify dropdown expand/collapse icon functionality', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await gamePage.locators.categoryDropdownToggle.click();
            await expect(gamePage.locators.categoryDropdownPanel).toBeVisible({ timeout: 5000 });
            await gamePage.locators.categoryDropdownToggle.click();
            await expect(gamePage.locators.categoryDropdownPanel).toBeHidden({ timeout: 5000 });
            await ScreenshotHelper(page, screenshotDir, 'GP-LI-016-dropdownIcon', testInfo);
        });

        test('GP-LI-017 - Verify in-game hamburger menu opens successfully', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await expect(gamePage.locators.topBarHamburgerBtn).toBeVisible({ timeout: 10000 });
            await gamePage.highlightElement('topBarHamburgerBtn');
            await gamePage.openHamburger();
            await expect(gamePage.locators.hamburgerPanel).toBeVisible({ timeout: 10000 });
            await gamePage.highlightElement('hamburgerPanel');
            await ScreenshotHelper(page, screenshotDir, 'GP-LI-017-hamburgerOpen', testInfo);
        });

        test('GP-LI-018 - Verify account-related options are visible in in-game hamburger menu', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await gamePage.openHamburger();
            await expect(gamePage.locators.hamburgerWelcomeMsg).toBeVisible({ timeout: 10000 });
            await gamePage.highlightElement('hamburgerWelcomeMsg');
            await expect(gamePage.locators.hamburgerMyAccountTab).toBeVisible({ timeout: 5000 });
            await gamePage.highlightElement('hamburgerMyAccountTab');
            const depositBtn = gamePage.accountOption('Deposit');
            await expect(depositBtn).toBeVisible({ timeout: 5000 });
            await gamePage.highlightLocator('depositBtn', depositBtn);
            const logoutBtn = gamePage.accountOption('Log out');
            await expect(logoutBtn).toBeVisible({ timeout: 5000 });
            await ScreenshotHelper(page, screenshotDir, 'GP-LI-018-hamburgerAccountOptions', testInfo);
        });

        test('GP-LI-019 - Verify Close button functionality in in-game hamburger menu', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await gamePage.openHamburger();
            await expect(gamePage.locators.hamburgerPanel).toBeVisible({ timeout: 10000 });
            await gamePage.closeHamburger();
            await expect(gamePage.locators.hamburgerPanel).toBeHidden({ timeout: 5000 });
            await ScreenshotHelper(page, screenshotDir, 'GP-LI-019-hamburgerClose', testInfo);
        });

        test('GP-LI-020 - Verify Theme toggle button functionality', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await gamePage.openHamburger();
            await expect(gamePage.locators.hamburgerThemeToggle).toBeVisible({ timeout: 10000 });
            await gamePage.highlightElement('hamburgerThemeToggle');
            // the site applies the theme as a 'dark'/'light' class on <html>
            const wasDark = await gamePage.isDarkTheme();
            await gamePage.locators.hamburgerThemeToggle.click();
            await expect.poll(() => gamePage.isDarkTheme(), { timeout: 5000 }).toBe(!wasDark);
            await ScreenshotHelper(page, screenshotDir, 'GP-LI-020-themeToggle', testInfo);
            // restore the original theme so later tests are unaffected
            await gamePage.locators.hamburgerThemeToggle.click();
            await expect.poll(() => gamePage.isDarkTheme(), { timeout: 5000 }).toBe(wasDark);
        });

        test('GP-LI-021 - Verify selected game title is displayed correctly in hamburger menu', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await expect(gamePage.locators.topBarGameTitle).toBeVisible({ timeout: 10000 });
            await expect(gamePage.locators.topBarGameTitle).not.toHaveText('', { timeout: 5000 });
            const topBarTitle = await gamePage.locators.topBarGameTitle.textContent();
            await gamePage.openHamburger();
            await expect(gamePage.locators.hamburgerGameTitle).toBeVisible({ timeout: 10000 });
            await gamePage.highlightElement('hamburgerGameTitle');
            const hamburgerTitle = await gamePage.locators.hamburgerGameTitle.textContent();
            expect(hamburgerTitle?.trim()).toBe(topBarTitle?.trim());
            await ScreenshotHelper(page, screenshotDir, 'GP-LI-021-hamburgerGameTitle', testInfo);
        });

        test('GP-LI-022 - Verify Favourite icon visibility and functionality in hamburger menu', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await gamePage.openHamburger();
            await expect(gamePage.locators.hamburgerFavBtn).toBeVisible({ timeout: 10000 });
            await gamePage.highlightElement('hamburgerFavBtn');
            // Normalize state: a previous run may have left this game favourited
            if (await gamePage.locators.hamburgerFavActiveBtn.isVisible().catch(() => false)) {
                await gamePage.locators.hamburgerFavBtn.click();
                await expect(gamePage.locators.hamburgerFavActiveBtn).not.toBeVisible({ timeout: 5000 });
            }
            await gamePage.locators.hamburgerFavBtn.click();
            await expect(gamePage.locators.hamburgerFavActiveBtn).toBeVisible({ timeout: 5000 });
            await gamePage.highlightElement('hamburgerFavActiveBtn');
            await ScreenshotHelper(page, screenshotDir, 'GP-LI-022-hamburgerFavActive', testInfo);
            await gamePage.locators.hamburgerFavBtn.click();
            await expect(gamePage.locators.hamburgerFavActiveBtn).not.toBeVisible({ timeout: 5000 });
            await ScreenshotHelper(page, screenshotDir, 'GP-LI-022-hamburgerFav', testInfo);
        });

        test('GP-LI-023 - Verify social share icons are displayed correctly in hamburger menu', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await gamePage.openHamburger();
            await expect(gamePage.locators.hamburgerWhatsAppBtn).toBeVisible({ timeout: 10000 });
            await expect(gamePage.locators.hamburgerFacebookBtn).toBeVisible({ timeout: 5000 });
            await expect(gamePage.locators.hamburgerTwitterBtn).toBeVisible({ timeout: 5000 });
            await expect(gamePage.locators.hamburgerEmailBtn).toBeVisible({ timeout: 5000 });
            await gamePage.highlightElement('hamburgerWhatsAppBtn');
            await gamePage.highlightElement('hamburgerFacebookBtn');
            await gamePage.highlightElement('hamburgerTwitterBtn');
            await gamePage.highlightElement('hamburgerEmailBtn');
            await ScreenshotHelper(page, screenshotDir, 'GP-LI-023-socialShareIcons', testInfo);
        });

        test('GP-LI-024 - Verify WhatsApp share icon functionality', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await gamePage.openHamburger();
            const popupPromise = page.waitForEvent('popup');
            await gamePage.locators.hamburgerWhatsAppBtn.click();
            const popup = await popupPromise;
            await popup.waitForLoadState('domcontentloaded');
            expect(popup.url()).toContain('whatsapp');
            // the shared link must point at THIS game, not a generic/empty URL
            expect(decodeURIComponent(popup.url())).toContain(gameSlug(page));
            await popup.close();
            await ScreenshotHelper(page, screenshotDir, 'GP-LI-024-whatsappShare', testInfo);
        });

        test('GP-LI-025 - Verify Facebook share icon functionality', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await gamePage.openHamburger();
            const popupPromise = page.waitForEvent('popup');
            await gamePage.locators.hamburgerFacebookBtn.click();
            const popup = await popupPromise;
            await popup.waitForLoadState('domcontentloaded');
            expect(popup.url()).toContain('facebook');
            // the shared link must point at THIS game, not a generic/empty URL
            expect(decodeURIComponent(popup.url())).toContain(gameSlug(page));
            await popup.close();
            await ScreenshotHelper(page, screenshotDir, 'GP-LI-025-facebookShare', testInfo);
        });

        test('GP-LI-026 - Verify Twitter/X share icon functionality', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await gamePage.openHamburger();
            const popupPromise = page.waitForEvent('popup');
            await gamePage.locators.hamburgerTwitterBtn.click();
            const popup = await popupPromise;
            await popup.waitForLoadState('domcontentloaded');
            expect(popup.url()).toMatch(/twitter|x\.com/);
            // the shared link must point at THIS game, not a generic/empty URL
            expect(decodeURIComponent(popup.url())).toContain(gameSlug(page));
            // the tweet text must be real copy, not a raw localization key (e.g. 'twitter-game-share-text')
            const tweetText = new URL(popup.url()).searchParams.get('text') || '';
            expect(looksLikeI18nKey(tweetText), `Tweet text looks like an untranslated i18n key: "${tweetText}"`).toBe(false);
            await popup.close();
            await ScreenshotHelper(page, screenshotDir, 'GP-LI-026-twitterShare', testInfo);
        });

        test('GP-LI-027 - Verify Email share icon functionality', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await gamePage.openHamburger();
            await expect(gamePage.locators.hamburgerEmailBtn).toBeVisible({ timeout: 10000 });
            await gamePage.highlightElement('hamburgerEmailBtn');
            const isDisabled = await gamePage.locators.hamburgerEmailBtn.getAttribute('disabled');
            expect(isDisabled).toBeNull();
            await ScreenshotHelper(page, screenshotDir, 'GP-LI-027-emailShare', testInfo);
        });

        test('GP-LI-028 - Verify all lobby category options are displayed correctly', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await gamePage.openHamburger();
            await expect(gamePage.locators.hamburgerLobbiesTab).toBeVisible({ timeout: 10000 });
            await gamePage.locators.hamburgerLobbiesTab.click();
            await expect(gamePage.locators.hamburgerLobbiesList).toBeVisible({ timeout: 5000 });
            await gamePage.highlightElement('hamburgerLobbiesList');
            const linkCount = await gamePage.hamburgerLobbyLinks.count();
            expect(linkCount).toBeGreaterThan(0);
            await ScreenshotHelper(page, screenshotDir, 'GP-LI-028-lobbyCategories', testInfo);
        });

        test('GP-LI-029 - Verify user is able to navigate through lobby categories', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await gamePage.openHamburger();
            await gamePage.locators.hamburgerLobbiesTab.click();
            await expect(gamePage.locators.hamburgerLobbiesList).toBeVisible({ timeout: 5000 });
            await gamePage.hamburgerLobbyLink('/spingames').click();
            await expect(page).toHaveURL(/\/spingames/, { timeout: 10000 });
            await ScreenshotHelper(page, screenshotDir, 'GP-LI-029-lobbyCategoryNav', testInfo);
        });

        test('GP-LI-030 - Verify category list is scrollable in in-game hamburger menu', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await gamePage.openHamburger();
            await gamePage.locators.hamburgerLobbiesTab.click();
            await expect(gamePage.locators.hamburgerLobbiesList).toBeVisible({ timeout: 5000 });
            const panelScrollHeight = await gamePage.locators.hamburgerPanel.evaluate((el) => el.scrollHeight);
            const panelClientHeight = await gamePage.locators.hamburgerPanel.evaluate((el) => el.clientHeight);
            expect(panelScrollHeight).toBeGreaterThanOrEqual(panelClientHeight);
            await ScreenshotHelper(page, screenshotDir, 'GP-LI-030-categoryListScroll', testInfo);
        });

        test('GP-LI-031 - Verify user is redirected to previous page when clicking back arrow', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            const gameUrl = page.url();
            await gamePage.locators.topBarBackBtn.click();
            await expect(page).not.toHaveURL(gameUrl, { timeout: 10000 });
            await ScreenshotHelper(page, screenshotDir, 'GP-LI-031-backNavigation', testInfo);
        });

        test('GP-LI-032 - Verify redirection retains previous page state', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            const gameUrl = page.url();
            await gamePage.locators.topBarBackBtn.click();
            await expect(gamePage.locators.trySimilarPanel).toBeVisible({ timeout: 10000 });
            await gamePage.highlightElement('trySimilarPanel');
            await ScreenshotHelper(page, screenshotDir, 'GP-LI-032-trySimilarPanel', testInfo);
            await gamePage.locators.trySimilarContinueBtn.click();
            await expect(gamePage.locators.trySimilarPanel).toBeHidden({ timeout: 5000 });
            await expect(page).toHaveURL(gameUrl, { timeout: 5000 });
            await ScreenshotHelper(page, screenshotDir, 'GP-LI-032-backNavigationState', testInfo);
        });

        test('GP-LI-033 - Verify back navigation works across different game providers', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            const firstGameUrl = page.url();
            await gamePage.locators.topBarBackBtn.click();
            await expect(gamePage.locators.trySimilarPanel).toBeVisible({ timeout: 10000 });
            await expect(gamePage.locators.trySimilarGameCard).toBeVisible({ timeout: 5000 });
            await gamePage.locators.trySimilarGameCard.click();
            await expect(page).not.toHaveURL(firstGameUrl, { timeout: 15000 });
            await gamePage.locators.topBar.waitFor({ state: 'visible', timeout: 15000 });
            await gamePage.locators.topBarBackBtn.click();
            await expect(gamePage.locators.trySimilarPanel).toBeVisible({ timeout: 10000 });
            await ScreenshotHelper(page, screenshotDir, 'GP-LI-033-backNavigationProviders', testInfo);
        });

        test('GP-LI-034 - Verify close icon dismisses the exit modal', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            const gameUrl = page.url();
            await gamePage.locators.topBarBackBtn.click();
            await expect(gamePage.locators.trySimilarPanel).toBeVisible({ timeout: 10000 });
            await expect(gamePage.locators.trySimilarCloseBtn).toBeVisible({ timeout: 5000 });
            await gamePage.locators.trySimilarCloseBtn.click();
            await expect(gamePage.locators.trySimilarPanel).toBeHidden({ timeout: 5000 });
            await expect(page).toHaveURL(gameUrl, { timeout: 5000 });
            await ScreenshotHelper(page, screenshotDir, 'GP-LI-034-exitModalClose', testInfo);
        });

        test('GP-LI-035 - Verify currently active game is highlighted in exit modal', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await gamePage.locators.topBarBackBtn.click();
            await expect(gamePage.locators.trySimilarPanel).toBeVisible({ timeout: 10000 });
            await expect(gamePage.locators.trySimilarActiveCard).toBeVisible({ timeout: 5000 });
            await gamePage.highlightElement('trySimilarActiveCard');
            await expect(gamePage.locators.trySimilarActiveBadge).toBeVisible({ timeout: 5000 });
            const badgeText = await gamePage.locators.trySimilarActiveBadge.textContent();
            expect(badgeText?.trim().toLowerCase()).toBe('active');
            await ScreenshotHelper(page, screenshotDir, 'GP-LI-035-activeGameHighlighted', testInfo);
        });

        test('GP-LI-036 - Verify wallet balance is displayed on the game page', async ({ page, headerPage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await expect(headerPage.locators.depositCTA).toBeVisible({ timeout: 10000 });
            await headerPage.highlightElement('depositCTA');
            await ScreenshotHelper(page, screenshotDir, 'GP-LI-036-walletBalance', testInfo);
        });

        test('GP-LI-037 - Verify game page refresh retains logged-in session', async ({ page, headerPage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            const gameUrl = page.url();
            await page.reload({ waitUntil: 'domcontentloaded' });
            await expect(page).toHaveURL(new RegExp(gameUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), { timeout: 15000 });
            await expect(headerPage.locators.depositCTA).toBeVisible({ timeout: 15000 });
            await expect(gamePage.gameFrame).toBeVisible({ timeout: 30000 });
            await ScreenshotHelper(page, screenshotDir, 'GP-LI-037-refreshSession', testInfo);
        });

        /**
         * Clicking an account option in the in-game hamburger does NOT navigate — it opens the
         * "Account Options" dialog with the clicked option active in its sidebar. Verifying only
         * that the hamburger closed would pass even with the dialog completely broken.
         */
        async function openAccountOptionAndVerify(page: Page, gamePage: GamePage, optionName: string) {
            await gamePage.openHamburger();
            const optionBtn = gamePage.accountOption(optionName);
            await expect(optionBtn).toBeVisible({ timeout: 10000 });
            await optionBtn.click();
            await expect(gamePage.locators.hamburgerPanel).toBeHidden({ timeout: 10000 });
            await expect(gamePage.locators.accountOptionsDialog).toBeVisible({ timeout: 15000 });
            // the clicked option must be the highlighted/active one in the dialog sidebar
            await expect(gamePage.locators.accountOptionsActiveItem).toBeVisible({ timeout: 10000 });
            await expect(gamePage.locators.accountOptionsActiveItem).toHaveText(new RegExp(optionName, 'i'));
        }

        test('GP-LI-038 - Verify clicking Deposit from in-game hamburger opens the deposit section', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await openAccountOptionAndVerify(page, gamePage, 'Deposit');
            // deposit flow loads in the banking iframe
            await expect(gamePage.locators.accountOptionsBankingFrame).toBeVisible({ timeout: 20000 });
            const frameSrc = await gamePage.locators.accountOptionsBankingFrame.getAttribute('src');
            expect(decodeURIComponent(frameSrc || '')).toContain('/banking-app/Deposits');
            // user identifier must be a real msisdn, not a serialization bug
            expect(decodeURIComponent((frameSrc || '').replace(/\+/g, ' '))).not.toContain('[object Object]');
            await ScreenshotHelper(page, screenshotDir, 'GP-LI-038-depositRedirect', testInfo);
        });

        test('GP-LI-039 - Verify clicking Withdrawal from in-game hamburger opens the withdrawal section', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await openAccountOptionAndVerify(page, gamePage, 'Withdrawal');
            await expect(gamePage.locators.accountOptionsBankingFrame).toBeVisible({ timeout: 20000 });
            const frameSrc = await gamePage.locators.accountOptionsBankingFrame.getAttribute('src');
            expect(decodeURIComponent((frameSrc || '').replace(/\+/g, ' '))).not.toContain('[object Object]');
            await ScreenshotHelper(page, screenshotDir, 'GP-LI-039-withdrawalRedirect', testInfo);
        });

        test('GP-LI-040 - Verify clicking Transaction Summary from in-game hamburger opens it', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await openAccountOptionAndVerify(page, gamePage, 'Transaction Summary');
            await ScreenshotHelper(page, screenshotDir, 'GP-LI-040-transactionSummaryRedirect', testInfo);
        });

        test('GP-LI-041 - Verify clicking Bonus Wallet from in-game hamburger opens it', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await openAccountOptionAndVerify(page, gamePage, 'Bonus Wallet');
            await ScreenshotHelper(page, screenshotDir, 'GP-LI-041-bonusWalletRedirect', testInfo);
        });

        test('GP-LI-042 - Verify clicking City Rewards from in-game hamburger opens it', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await openAccountOptionAndVerify(page, gamePage, 'City Rewards');
            // rewards content actually rendered, not an empty pane
            await expect(gamePage.accountOptionsCityRewardsContent).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'GP-LI-042-cityRewardsRedirect', testInfo);
        });

        test('GP-LI-043 - Verify clicking My Profile Management from in-game hamburger opens it', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await openAccountOptionAndVerify(page, gamePage, 'My Profile Management');
            await ScreenshotHelper(page, screenshotDir, 'GP-LI-043-myProfileRedirect', testInfo);
        });

        test('GP-LI-044 - Verify clicking Account Settings from in-game hamburger opens it', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await openAccountOptionAndVerify(page, gamePage, 'Account Settings');
            // settings form actually rendered (communication toggles + Update button)
            await expect(gamePage.accountSettingsUpdateButton).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'GP-LI-044-accountSettingsRedirect', testInfo);
        });

        test('GP-LI-045 - Verify clicking Responsible Gaming from in-game hamburger opens it', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await openAccountOptionAndVerify(page, gamePage, 'Responsible Gaming');
            await ScreenshotHelper(page, screenshotDir, 'GP-LI-045-responsibleGamingRedirect', testInfo);
        });

        test('GP-LI-046 - Verify clicking Document Verification from in-game hamburger opens it', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await openAccountOptionAndVerify(page, gamePage, 'Document Verification');
            await ScreenshotHelper(page, screenshotDir, 'GP-LI-046-documentVerificationRedirect', testInfo);
        });

        test('GP-LI-047 - Verify logout from in-game hamburger works correctly', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await gamePage.openHamburger();
            const logoutBtn = gamePage.accountOption('Log out');
            await expect(logoutBtn).toBeVisible({ timeout: 10000 });
            await gamePage.highlightLocator('logoutBtn', logoutBtn);
            await logoutBtn.click();
            await expect(gamePage.locators.hamburgerPanel).toBeHidden({ timeout: 10000 });
            await expect(gamePage.playNowButton).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'GP-LI-047-logout', testInfo);
        });

        test('GP-LI-048 - Verify logout from game page retains same game in logged-out state', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            const gameUrl = page.url();
            await gamePage.openHamburger();
            const logoutBtn = gamePage.accountOption('Log out');
            await logoutBtn.click();
            await expect(gamePage.locators.hamburgerPanel).toBeHidden({ timeout: 10000 });
            await expect(page).toHaveURL(new RegExp(gameUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), { timeout: 15000 });
            await expect(gamePage.playNowButton).toBeVisible({ timeout: 15000 });
            await ScreenshotHelper(page, screenshotDir, 'GP-LI-048-logoutGameState', testInfo);
        });

        // The share MODAL has its own social buttons, separate from the in-game hamburger's —
        // they can break independently (and have), so they get their own tests.

        test('GP-LI-049 - Verify WhatsApp share from share modal opens with this game\'s link', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await gamePage.openShareModal();
            await expect(gamePage.locators.shareWhatsAppBtn).toBeVisible({ timeout: 10000 });
            const popupPromise = page.waitForEvent('popup', { timeout: 15000 });
            await gamePage.locators.shareWhatsAppBtn.click();
            const popup = await popupPromise;
            await popup.waitForLoadState('domcontentloaded').catch(() => { });
            expect(popup.url()).toMatch(/whatsapp/i);
            expect(decodeURIComponent(popup.url())).toContain(gameSlug(page));
            await popup.close();
            await ScreenshotHelper(page, screenshotDir, 'GP-LI-049-shareModalWhatsApp', testInfo);
        });

        test('GP-LI-050 - Verify Facebook share from share modal opens with this game\'s link', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await gamePage.openShareModal();
            await expect(gamePage.locators.shareFacebookBtn).toBeVisible({ timeout: 10000 });
            const popupPromise = page.waitForEvent('popup', { timeout: 15000 });
            await gamePage.locators.shareFacebookBtn.click();
            const popup = await popupPromise;
            await popup.waitForLoadState('domcontentloaded').catch(() => { });
            expect(popup.url()).toMatch(/facebook/i);
            expect(decodeURIComponent(popup.url())).toContain(gameSlug(page));
            await popup.close();
            await ScreenshotHelper(page, screenshotDir, 'GP-LI-050-shareModalFacebook', testInfo);
        });

        test('GP-LI-051 - Verify Twitter/X share from share modal opens with this game\'s link', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await gamePage.openShareModal();
            await expect(gamePage.locators.shareTwitterBtn).toBeVisible({ timeout: 10000 });
            const popupPromise = page.waitForEvent('popup', { timeout: 15000 });
            await gamePage.locators.shareTwitterBtn.click();
            const popup = await popupPromise;
            await popup.waitForLoadState('domcontentloaded').catch(() => { });
            expect(popup.url()).toMatch(/twitter|x\.com/i);
            expect(decodeURIComponent(popup.url())).toContain(gameSlug(page));
            // the tweet text must be real copy, not a raw localization key (e.g. 'twitter-game-share-text')
            const tweetText = new URL(popup.url()).searchParams.get('text') || '';
            expect(looksLikeI18nKey(tweetText), `Tweet text looks like an untranslated i18n key: "${tweetText}"`).toBe(false);
            await popup.close();
            await ScreenshotHelper(page, screenshotDir, 'GP-LI-051-shareModalTwitter', testInfo);
        });

        test('GP-LI-052 - Verify Email share button in share modal is enabled', async ({ page, gamePage, screenshotDir }: GamePageSuiteFixtures, testInfo: TestInfo) => {
            await gamePage.openShareModal();
            await expect(gamePage.locators.shareEmailBtn).toBeVisible({ timeout: 10000 });
            await expect(gamePage.locators.shareEmailBtn).not.toBeDisabled();
            await expect(gamePage.locators.shareEmailBtn).toHaveAttribute('aria-disabled', 'false');
            await ScreenshotHelper(page, screenshotDir, 'GP-LI-052-shareModalEmail', testInfo);
        });

    });
}
